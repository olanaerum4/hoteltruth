export const HT_HOTEL = "Hotel Sunrise Bangkok";

export const HT_DATA = {
  honest: 4.1,
  advertised: 8.4,
  reviews: 847,
  complaintPct: 23,
  complaints: [
    { id: "pests", icon: "bug", label: "Pests & cleanliness", count: 34, sev: "high",
      quote: "“cockroaches in the bathroom, ants crawling on the bed”" },
    { id: "loc", icon: "pin", label: "Misleading location", count: 19, sev: "high",
      quote: "“20 min from the center — not the 5 min they advertise”" },
    { id: "wifi", icon: "wifi", label: "WiFi dead in the rooms", count: 28, sev: "med",
      quote: "“only works in the lobby, useless if you need to work”" },
    { id: "lock", icon: "lock", label: "Broken locks · safety", count: 12, sev: "high",
      quote: "“room lock was broken — didn’t feel safe travelling solo”" },
    { id: "noise", icon: "noise", label: "Noise at night", count: 16, sev: "low",
      quote: "“club next door until 3am, paper-thin walls”" },
  ],
  goods: [
    { label: "Staff genuinely friendly", count: 41 },
    { label: "Breakfast better than expected", count: 22 },
  ],
};

export const HT_SEV = {
  high: { dot: "var(--alert)", bg: "var(--alert-wash)", label: "Serious" },
  med:  { dot: "var(--amber)", bg: "var(--amber-wash)", label: "Common" },
  low:  { dot: "var(--muted)", bg: "var(--line-wash)", label: "Minor" },
};

export const HT_QUOTES = [
  { t: "I spent 3 hours reading reviews and still booked a hotel with cockroaches. The 8.4 score meant nothing.", s: "r/solotravel" },
  { t: "Wish there was a way to just see the actual complaints, not the marketing fluff.", s: "r/solotravel" },
];

export const HT_EXAMPLES = ["Hotel Sunrise Bangkok", "Marina Bay Hostel", "Grand Plaza Lisbon"];

export const HT_STEPS = [
  { n: "01", t: "Search any hotel", d: "Paste a Booking or TripAdvisor link, or just type the name." },
  { n: "02", t: "We read every review", d: "All 847 of them — including the 1- and 2-star ones nobody scrolls to." },
  { n: "03", t: "Get the honest score", d: "One real number, plus the actual recurring complaints, ranked by severity." },
];

export const HT_TONE = {
  calm: {
    h1a: "The hotel score they", h1b: "don’t want", h1c: "you to see.",
    sub: "Every hotel averages a comfortable 8.2. We read all the reviews and surface the real number — and the actual complaints hiding underneath it.",
    resultLede: ["Booking sites advertise an ", ". We read all ", " reviews — the real picture is ", "pests, a misleading location, and broken locks", " buried under the marketing."],
    verdict: "Fine for a cheap one-night stopover. Not if you’re travelling solo or need to sleep, work, or feel safe.",
    footerH: "Stop gambling on an 8.2.",
    footerP: "Check any hotel before you book. Free while in beta.",
  },
  blunt: {
    h1a: "That 8.2 is", h1b: "lying", h1c: "to you.",
    sub: "Booking scores are rigged. We read every review and hand you the real number — plus the cockroaches, the fake location, and the broken locks they buried.",
    resultLede: ["It’s sold to you as an ", ". We read all ", " reviews and the truth is ugly: ", "pests, a fake location, and locks that don’t lock", "."],
    verdict: "Don’t. Unless it’s one desperate night — and you bring earplugs, a door wedge, and very low standards.",
    footerH: "Quit trusting the 8.2.",
    footerP: "Check the real score before you waste a night. Free while in beta.",
  },
};

export function htScoreColor(v) {
  if (v < 4) return "var(--alert)";
  if (v < 6) return "var(--amber)";
  if (v < 8) return "var(--truth)";
  return "var(--good)";
}
