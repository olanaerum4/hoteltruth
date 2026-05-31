import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApifyClient } from "apify-client";
import { analyzeWithKimi } from "./ai.js";
import { processReviews } from "./processor.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true }));
app.use(express.json());

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

  const hotelName = query.trim();
  console.log(`[analyze] "${hotelName}"`);

  try {
    // ── Step 1: Apify — scrape Google Maps ──────────────────────────────────
    emit("status", { message: `Searching Google Maps for "${hotelName}"…` });

    const run = await apify.actor("apify/google-maps-scraper").call(
      {
        searchStringsArray: [hotelName],
        maxCrawledPlacesPerSearch: 1,
        language: "en",
        includeReviews: true,
        maxReviews: 200,
        reviewsSort: "newest",
      },
      { waitSecs: 300 }
    );

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

app.listen(PORT, () => {
  console.log(`\nHotelTruth API → http://localhost:${PORT}`);
  console.log(`  Apify token : ${process.env.APIFY_TOKEN ? "✓" : "✗ missing"}`);
  console.log(`  KIMI key    : ${process.env.KIMI_API_KEY ? "✓" : "✗ missing"}\n`);
});
