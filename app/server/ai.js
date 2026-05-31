import OpenAI from "openai";

const kimi = new OpenAI({
  apiKey: process.env.KIMI_API_KEY,
  baseURL: "https://api.moonshot.ai/v1",
});

const SYSTEM_PROMPT = `You are HotelTruth's review analyst. Your job is to cut through inflated hotel scores and surface the truth for travelers.

You will receive a batch of real hotel reviews with star ratings. Analyse them and return ONLY valid JSON with this exact structure — no markdown, no explanation:

{
  "honest": <float 1.0–10.0, one decimal — the TRUE score based on what reviews actually describe, NOT just averaging stars>,
  "complaintPct": <integer 0–100 — percentage of reviews that describe a real, recurring problem>,
  "verdict": <string — one direct, actionable sentence, max 22 words. Be honest. No hedging.>,
  "complaints": [
    {
      "id": <short lowercase id, e.g. "pests", "location", "wifi", "safety", "noise", "staff", "value">,
      "icon": <one of exactly: "bug", "pin", "wifi", "lock", "noise", "flag", "quote", "spark">,
      "label": <short label, 3–5 words>,
      "sev": <"high" | "med" | "low">,
      "count": <integer — number of reviews mentioning this>,
      "quote": <a verbatim excerpt from one of the provided reviews, wrapped in “” curly quotes>
    }
  ],
  "goods": [
    { "label": <string 3–5 words>, "count": <integer> }
  ]
}

Scoring guide (honest score /10):
- 9–10: Exceptional, problems are rare one-offs
- 7–8: Genuinely good, minor gripes
- 5–6: Decent but with real recurring issues travelers should know about
- 3–4: Significant problems that will bother most guests (pests, fake location, security)
- 1–2: Serious issues — avoid unless desperate

Rules:
- complaints: only include issues mentioned in 3+ reviews. Sort by severity then count. Max 5.
- goods: only include positives mentioned in 3+ reviews. Max 4. Only include if genuinely recurring.
- quote: must be a direct verbatim excerpt (not a paraphrase) from one of the reviews you received.
- icon mapping: pests/cleanliness → "bug", location → "pin", wifi/internet → "wifi", locks/safety/security → "lock", noise → "noise", general warning → "flag"
- Be brutally honest. Travelers are relying on this to not waste money or end up unsafe.`;

export async function analyzeWithKimi(hotelName, reviews, placeData, onStatus) {
  // Cap at 120 reviews — plenty for analysis and stays within 128k tokens
  const sample = reviews
    .filter((r) => (r.text || r.snippet || "").trim().length > 20)
    .slice(0, 120);

  const reviewsBlock = sample
    .map((r, i) => {
      const stars = r.stars ?? r.rating ?? "?";
      const text = (r.text || r.snippet || "").trim().slice(0, 500);
      return `[${i + 1}] ★${stars}/5: ${text}`;
    })
    .join("\n\n");

  const platformRating = placeData.totalScore ?? placeData.rating;
  const advertisedScore = platformRating != null
    ? Math.round(platformRating * 2 * 10) / 10
    : null;

  const userMessage = [
    `Hotel: "${hotelName}"`,
    `Platform aggregate: ${platformRating != null ? platformRating.toFixed(1) + "/5" : "unknown"}`,
    `Total reviews on platform: ${placeData.reviewsCount ?? "unknown"}`,
    `Reviews analysed (${sample.length}):`,
    "",
    reviewsBlock,
  ].join("\n");

  if (onStatus) onStatus(`AI analysing ${sample.length} reviews…`);

  const completion = await kimi.chat.completions.create({
    model: "moonshot-v1-128k",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    temperature: 0.15,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0].message.content;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI returned invalid JSON — try again");
  }

  return {
    name: hotelName,
    address: placeData.address || "",
    honest: typeof parsed.honest === "number" ? parsed.honest : null,
    advertised: advertisedScore,
    reviews: placeData.reviewsCount ?? reviews.length,
    reviewsFetched: sample.length,
    complaintPct: typeof parsed.complaintPct === "number" ? parsed.complaintPct : null,
    verdict: parsed.verdict || null,
    complaints: (parsed.complaints ?? []).slice(0, 5),
    goods: (parsed.goods ?? []).slice(0, 4),
  };
}
