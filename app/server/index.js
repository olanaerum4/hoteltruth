import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApifyClient } from "apify-client";
import { analyzeWithKimi } from "./ai.js";
import { processReviews } from "./processor.js";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "../dist");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.static(DIST));

const apify = new ApifyClient({ token: process.env.APIFY_TOKEN });

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    apify: !!process.env.APIFY_TOKEN,
    kimi: !!process.env.KIMI_API_KEY,
  });
});

// POST /api/analyze — streams Server-Sent Events back
// Events: { type: "status", message } | { type: "result", data } | { type: "error", message }
app.post("/api/analyze", async (req, res) => {
  // ── SSE setup ────────────────────────────────────────────────────────────
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("X-Accel-Buffering", "no"); // disable nginx buffering
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

  const raw = query.trim();
  const isUrl = raw.includes("google.com/maps") || raw.includes("maps.google.com");

  // Extract display name from Maps URL path, e.g. /maps/place/Scandic+Helsfyr/
  const nameFromUrl = isUrl
    ? (() => { const m = raw.match(/\/maps\/place\/([^/@?]+)/); return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : null; })()
    : null;
  const hotelName = nameFromUrl ?? raw;

  console.log(`[analyze] "${hotelName}" (${isUrl ? "url" : "search"})`);

  try {
    // ── Step 1: Apify — scrape Google Maps ──────────────────────────────────
    emit("status", { message: isUrl ? `Fetching reviews for "${hotelName}"…` : `Searching Google Maps for "${hotelName}"…` });

    const apifyInput = isUrl
      ? { startUrls: [{ url: raw }], maxCrawledPlacesPerSearch: 1, language: "en", includeReviews: true, maxReviews: 200, reviewsSort: "newest" }
      : { searchStringsArray: [hotelName], maxCrawledPlacesPerSearch: 1, language: "en", includeReviews: true, maxReviews: 200, reviewsSort: "newest" };

    const run = await apify.actor("compass/crawler-google-places").call(apifyInput, { waitSecs: 300 });

    if (run.status !== "SUCCEEDED") {
      emit("error", { message: `Scraper failed (${run.status}) — try again.` });
      return res.end();
    }

    const { items } = await apify
      .dataset(run.defaultDatasetId)
      .listItems({ limit: 1 });

    if (!items.length) {
      emit("error", { message: `Couldn't find "${hotelName}" on Google Maps. Try a more specific name.` });
      return res.end();
    }

    const place = items[0];
    const reviews = place.reviews ?? [];
    const reviewCount = reviews.filter((r) => r.text || r.snippet).length;

    emit("status", {
      message: `Found ${place.title} — ${reviews.length} reviews pulled. Running AI analysis…`,
    });

    console.log(`[analyze] "${place.title}" | ${reviews.length} reviews | rating ${place.totalScore}`);

    // ── Step 2: KIMI AI — analyse reviews ────────────────────────────────────
    let result;
    try {
      result = await analyzeWithKimi(
        place.title,
        reviews,
        place,
        (msg) => emit("status", { message: msg })
      );
    } catch (aiErr) {
      console.warn("[analyze] KIMI failed, falling back to keyword analysis:", aiErr.message);
      emit("status", { message: "AI unavailable — using keyword analysis…" });
      result = processReviews(place, reviews);
    }

    emit("result", { data: result });
    res.end();

  } catch (err) {
    console.error("[analyze] error:", err.message);
    emit("error", { message: err.message });
    res.end();
  }
});

// SPA fallback — serve index.html for any non-API route
app.get("*", (_req, res) => {
  res.sendFile(join(DIST, "index.html"));
});

app.listen(PORT, () => {
  console.log(`\nHotelTruth API → http://localhost:${PORT}`);
  console.log(`  Apify token : ${process.env.APIFY_TOKEN ? "✓" : "✗ missing"}`);
  console.log(`  KIMI key    : ${process.env.KIMI_API_KEY ? "✓" : "✗ missing"}\n`);
});
