import { createClient } from "@supabase/supabase-js";
import { ApifyClient } from "apify-client";
import { analyzeWithKimi } from "../server/ai.js";
import { processReviews } from "../server/processor.js";

// Vercel: allow up to 5 minutes (requires Pro plan; Free plan caps at 10s)
export const config = { maxDuration: 300 };

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const apify = new ApifyClient({ token: process.env.APIFY_TOKEN });

function cacheKey(query) {
  return query.toLowerCase().trim().replace(/\s+/g, " ");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // ── SSE headers ────────────────────────────────────────────────────────
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const emit = (type, payload) => {
    res.write(`data: ${JSON.stringify({ type, ...payload })}\n\n`);
    if (typeof res.flush === "function") res.flush();
  };

  const { query } = req.body ?? {};
  if (!query || typeof query !== "string" || query.trim().length < 2) {
    emit("error", { message: "Please enter a hotel name." });
    return res.end();
  }

  const hotel = query.trim();
  const key = cacheKey(hotel);

  try {
    // ── 1. Supabase cache check ──────────────────────────────────────────
    const { data: cached } = await supabase
      .from("hotel_analyses")
      .select("result, created_at")
      .eq("query_key", key)
      .maybeSingle();

    if (cached) {
      const ageMs = Date.now() - new Date(cached.created_at).getTime();
      const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
      if (ageMs < WEEK_MS) {
        console.log(`[cache hit] "${hotel}"`);
        emit("status", { message: "Loading from cache…" });
        emit("result", { data: cached.result });
        return res.end();
      }
    }

    // ── 2. Apify — scrape Google Maps reviews ───────────────────────────
    emit("status", { message: `Searching Google Maps for "${hotel}"…` });

    const run = await apify.actor("apify/google-maps-scraper").call(
      {
        searchStringsArray: [hotel],
        maxCrawledPlacesPerSearch: 1,
        language: "en",
        includeReviews: true,
        maxReviews: 200,
        reviewsSort: "newest",
      },
      { waitForFinish: 240 }
    );

    if (run.status !== "SUCCEEDED") {
      emit("error", { message: `Scraper failed (${run.status}) — try again.` });
      return res.end();
    }

    const { items } = await apify
      .dataset(run.defaultDatasetId)
      .listItems({ limit: 1 });

    if (!items.length) {
      emit("error", {
        message: `Couldn't find "${hotel}" on Google Maps. Try a more specific name or add the city.`,
      });
      return res.end();
    }

    const place = items[0];
    const reviews = place.reviews ?? [];

    emit("status", {
      message: `Found ${place.title} · ${reviews.length} reviews — running AI analysis…`,
    });

    // ── 3. KIMI AI analysis ─────────────────────────────────────────────
    let result;
    try {
      result = await analyzeWithKimi(
        place.title,
        reviews,
        place,
        (msg) => emit("status", { message: msg })
      );
    } catch (aiErr) {
      console.warn("[analyze] KIMI failed, falling back:", aiErr.message);
      emit("status", { message: "AI unavailable — using keyword analysis…" });
      result = processReviews(place, reviews);
    }

    // ── 4. Save to Supabase cache ────────────────────────────────────────
    const { error: dbErr } = await supabase
      .from("hotel_analyses")
      .upsert({ query_key: key, result }, { onConflict: "query_key" });

    if (dbErr) console.warn("[analyze] Supabase upsert failed:", dbErr.message);

    emit("result", { data: result });
    res.end();
  } catch (err) {
    console.error("[analyze] error:", err.message);
    emit("error", { message: err.message });
    res.end();
  }
}
