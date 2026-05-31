// Review analysis: complaint detection + honest score calculation

const CATEGORIES = [
  {
    id: "pests",
    icon: "bug",
    label: "Pests & cleanliness",
    sev: "high",
    keywords: ["cockroach", "roach", "ant", "bug", "pest", "dirty", "filthy", "unclean",
               "mold", "mould", "smell", "smelly", "stink", "stank", "odor", "odour", "grime", "grimy"],
  },
  {
    id: "loc",
    icon: "pin",
    label: "Misleading location",
    sev: "high",
    keywords: ["far from", "far away", "mislead", "not close", "not central", "not near",
               "long walk", "long way", "20 min", "30 min", "outside the city", "suburbs",
               "nowhere near", "different area", "advertised location", "wrong location"],
  },
  {
    id: "wifi",
    icon: "wifi",
    label: "WiFi / internet issues",
    sev: "med",
    keywords: ["wifi", "wi-fi", "internet", "connection", "no signal", "slow internet",
               "no wifi", "terrible wifi", "weak signal", "disconnects", "no internet"],
  },
  {
    id: "lock",
    icon: "lock",
    label: "Safety & broken locks",
    sev: "high",
    keywords: ["lock", "locks", "unsafe", "not safe", "security", "stolen", "theft",
               "broke in", "broken door", "door lock", "safety concern", "feel safe"],
  },
  {
    id: "noise",
    icon: "noise",
    label: "Noise at night",
    sev: "low",
    keywords: ["noise", "noisy", "loud", "music", "party", "club", "bar", "thin walls",
               "couldn't sleep", "kept awake", "loud neighbours", "street noise"],
  },
];

const GOOD_PATTERNS = [
  { keywords: ["friendly", "helpful", "staff", "kind", "warm"], label: "Staff genuinely friendly" },
  { keywords: ["breakfast", "good food", "great food", "delicious"], label: "Breakfast worth it" },
  { keywords: ["clean room", "spotless", "very clean", "immaculate"], label: "Clean rooms" },
  { keywords: ["great location", "perfect location", "central", "convenient"], label: "Great location" },
  { keywords: ["comfortable bed", "comfy bed", "good sleep", "great bed"], label: "Comfortable beds" },
];

function containsAny(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

// Pull representative quotes from matching reviews
function pickQuote(reviews, keywords) {
  for (const r of reviews) {
    const text = r.text || r.snippet || "";
    if (text.length > 40 && containsAny(text, keywords)) {
      // Return a clipped quote
      const idx = keywords.findIndex((kw) => text.toLowerCase().includes(kw));
      const kw = keywords[idx];
      const pos = text.toLowerCase().indexOf(kw);
      const start = Math.max(0, pos - 30);
      const end = Math.min(text.length, pos + 100);
      let snippet = text.slice(start, end).trim();
      if (start > 0) snippet = "…" + snippet;
      if (end < text.length) snippet = snippet + "…";
      return `"${snippet}"`;
    }
  }
  return null;
}

export function processReviews(placeData, reviews) {
  const totalReviews = placeData.reviewsCount || reviews.length;
  const advertisedRating = placeData.totalScore ?? placeData.rating ?? null;

  // Compute honest average from the reviews we actually fetched
  const ratedReviews = reviews.filter((r) => r.stars != null || r.rating != null);
  const rawAvg = ratedReviews.length > 0
    ? ratedReviews.reduce((s, r) => s + (r.stars ?? r.rating ?? 0), 0) / ratedReviews.length
    : null;

  // Scale to /10 (Google Maps = /5, TripAdvisor = /5 bubbles)
  const honestScore = rawAvg != null ? Math.round(rawAvg * 2 * 10) / 10 : null;

  // Advertised score: platform aggregate × 2 → /10
  const advertisedScore = advertisedRating != null
    ? Math.round(advertisedRating * 2 * 10) / 10
    : null;

  // Analyse negative reviews for complaint categories (1-3 stars)
  const negativeReviews = reviews.filter((r) => {
    const stars = r.stars ?? r.rating ?? 5;
    return stars <= 3;
  });

  const complaintsRaw = CATEGORIES.map((cat) => {
    const matching = negativeReviews.filter((r) =>
      containsAny(r.text || r.snippet || "", cat.keywords)
    );
    const quote = pickQuote(matching, cat.keywords);
    return { ...cat, count: matching.length, quote };
  }).filter((c) => c.count > 0);

  // Sort by count desc, keep up to 5
  const complaints = complaintsRaw
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(({ id, icon, label, sev, count, quote }) => ({
      id, icon, label, sev, count,
      quote: quote || `"Multiple guests mentioned issues with ${label.toLowerCase()}"`,
    }));

  // Complaint percentage
  const complaintReviewCount = new Set(
    negativeReviews
      .filter((r) => CATEGORIES.some((cat) => containsAny(r.text || r.snippet || "", cat.keywords)))
      .map((_, i) => i)
  ).size;
  const complaintPct = totalReviews > 0
    ? Math.round((negativeReviews.length / Math.min(reviews.length, totalReviews)) * 100)
    : 0;

  // What's good: positive patterns in 4-5 star reviews
  const positiveReviews = reviews.filter((r) => (r.stars ?? r.rating ?? 0) >= 4);
  const goods = GOOD_PATTERNS
    .map((p) => ({
      label: p.label,
      count: positiveReviews.filter((r) => containsAny(r.text || r.snippet || "", p.keywords)).length,
    }))
    .filter((g) => g.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return {
    name: placeData.title || placeData.name || "Unknown Hotel",
    address: placeData.address || "",
    honest: honestScore,
    advertised: advertisedScore,
    reviews: totalReviews,
    reviewsFetched: reviews.length,
    complaintPct,
    complaints,
    goods,
    categories: placeData.categories || [],
  };
}
