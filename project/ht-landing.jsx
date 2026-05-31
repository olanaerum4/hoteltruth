// ht-landing.jsx — three landing directions. Width 1280.
// Exported: HTLandingClean, HTLandingBold, HTLandingReport

const HT_QUOTES = [
  { t: "I spent 3 hours reading reviews and still booked a hotel with cockroaches. The 8.4 score meant nothing.", s: "r/solotravel" },
  { t: "Wish there was a way to just see the actual complaints, not the marketing fluff.", s: "r/solotravel" },
];
const HT_EXAMPLES = ["Hotel Sunrise Bangkok", "Marina Bay Hostel", "Grand Plaza Lisbon"];

// compact honest-result preview card
function HTPreview({ compact }) {
  const d = HT_DATA;
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20,
      boxShadow: "0 18px 50px -22px rgba(20,30,45,.28)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", borderBottom: "1px solid var(--line)", background: "var(--bg)" }}>
        <span style={{ width: 9, height: 9, borderRadius: 99, background: "var(--line-strong)" }} />
        <span style={{ width: 9, height: 9, borderRadius: 99, background: "var(--line-strong)" }} />
        <span style={{ width: 9, height: 9, borderRadius: 99, background: "var(--line-strong)" }} />
        <span style={{ marginLeft: 10, fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>hoteltruth.app/{"hotel-sunrise-bangkok"}</span>
      </div>
      <div style={{ padding: "22px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div className="ht-eyebrow" style={{ marginBottom: 8 }}>Honest report</div>
            <div style={{ fontSize: 21, fontWeight: 800, color: "var(--ink)", letterSpacing: -0.5 }}>{HT_HOTEL}</div>
          </div>
          <HTScoreBig value={d.honest} size={58} sub={null} />
        </div>
        <div style={{ display: "flex", gap: 24, paddingBottom: 16, marginBottom: 6, borderBottom: "1px solid var(--line)" }}>
          <HTStat value={d.reviews} label="reviews analyzed" />
          <HTStat value={d.complaintPct + "%"} label="complaints" accent="var(--alert)" />
          <HTStat value={d.advertised.toFixed(1)} label="advertised" />
        </div>
        {d.complaints.slice(0, compact ? 3 : 4).map((c) => <HTComplaint key={c.id} c={c} variant="line" />)}
      </div>
    </div>
  );
}

function HTLandNav({ light }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "20px 48px" }}>
      <HTLogo size={22} light={light} />
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {["How it works", "Why scores lie", "About"].map((x) => (
          <span key={x} style={{ fontSize: 14.5, fontWeight: 600, color: light ? "rgba(255,255,255,.82)" : "var(--ink-soft)" }}>{x}</span>
        ))}
        <span className="ht-btn ht-btn-primary" style={{ fontSize: 14 }}>Search a hotel</span>
      </div>
    </div>
  );
}

function HTQuoteCard({ q, light }) {
  return (
    <div style={{ background: light ? "rgba(255,255,255,.06)" : "var(--surface)",
      border: `1px solid ${light ? "rgba(255,255,255,.12)" : "var(--line)"}`, borderRadius: 18, padding: "22px 24px" }}>
      <span style={{ color: "var(--alert)", display: "block", marginBottom: 8 }}><HTIcon name="quote" size={26} /></span>
      <div style={{ fontSize: 17, lineHeight: 1.5, color: light ? "#fff" : "var(--ink)", fontWeight: 500, marginBottom: 14, textWrap: "pretty" }}>{q.t}</div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 12.5, color: light ? "rgba(255,255,255,.6)" : "var(--muted)" }}>— {q.s}</div>
    </div>
  );
}

const HT_STEPS = [
  { n: "01", t: "Search any hotel", d: "Paste a Booking or TripAdvisor link, or just type the name." },
  { n: "02", t: "We read every review", d: "All 847 of them — including the 1- and 2-star ones nobody scrolls to." },
  { n: "03", t: "Get the honest score", d: "One real number, plus the actual recurring complaints, ranked by severity." },
];
function HTSteps({ light }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
      {HT_STEPS.map((s) => (
        <div key={s.n} style={{ borderTop: `2px solid ${light ? "rgba(255,255,255,.2)" : "var(--ink)"}`, paddingTop: 18 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--truth)", fontWeight: 700, marginBottom: 12 }}>{s.n}</div>
          <div style={{ fontSize: 19, fontWeight: 700, color: light ? "#fff" : "var(--ink)", letterSpacing: -0.4, marginBottom: 8 }}>{s.t}</div>
          <div style={{ fontSize: 15, lineHeight: 1.5, color: light ? "rgba(255,255,255,.7)" : "var(--ink-soft)" }}>{s.d}</div>
        </div>
      ))}
    </div>
  );
}

// ── D1 · Clean trust (with live search reveal) ────────────────────────────
function HTLandingClean() {
  const [q, setQ] = React.useState(HT_HOTEL);
  const [shown, setShown] = React.useState(true);
  return (
    <div className="ht-root" style={{ background: "var(--bg)", minHeight: "100%" }}>
      <HTLandNav />
      {/* hero */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, padding: "44px 48px 60px", alignItems: "center" }}>
        <div>
          <span className="ht-eyebrow">For travelers who read the 1-star reviews</span>
          <h1 style={{ fontSize: 60, fontWeight: 800, color: "var(--ink)", letterSpacing: -2.4, lineHeight: 0.98, margin: "16px 0 0" }}>
            The hotel score they<br/><span style={{ color: "var(--truth)" }}>don’t want</span> you to see.
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.55, color: "var(--ink-soft)", margin: "22px 0 30px", maxWidth: 460, textWrap: "pretty" }}>
            Every hotel averages a comfortable 8.2. We read all the reviews and surface the real number — and the actual complaints hiding underneath it.
          </p>
          <div style={{ maxWidth: 520 }}>
            <HTSearch value={q} onChange={setQ} onSubmit={() => setShown(true)} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>Try:</span>
            {HT_EXAMPLES.map((x) => (
              <span key={x} className="ht-chip" onClick={() => { setQ(x); setShown(true); }} style={{ cursor: "pointer" }}>{x}</span>
            ))}
          </div>
        </div>
        <div style={{ opacity: shown ? 1 : 0, transition: "opacity .3s" }}><HTPreview compact /></div>
      </div>

      {/* problem */}
      <div style={{ background: "var(--surface)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ padding: "56px 48px" }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: "var(--ink)", letterSpacing: -1, margin: "0 0 8px" }}>The 8.2 problem</h2>
          <p style={{ fontSize: 17, color: "var(--ink-soft)", maxWidth: 620, lineHeight: 1.5, margin: "0 0 32px" }}>
            Booking.com and TripAdvisor scores are inflated and gamed. The problems that actually ruin a trip are buried in reviews nobody reads.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            {HT_QUOTES.map((qq, i) => <HTQuoteCard key={i} q={qq} />)}
          </div>
        </div>
      </div>

      {/* how it works */}
      <div style={{ padding: "56px 48px" }}>
        <h2 className="ht-h2" style={{ marginBottom: 30 }}>From hotel name to the honest truth in seconds</h2>
        <HTSteps />
      </div>

      {/* footer CTA */}
      <div style={{ background: "var(--ink)", color: "#fff", padding: "56px 48px", textAlign: "center" }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1.4, margin: "0 0 10px" }}>Stop gambling on an 8.2.</h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,.7)", margin: "0 auto 28px", maxWidth: 460 }}>Check any hotel before you book. Free while in beta.</p>
        <div style={{ maxWidth: 540, margin: "0 auto" }}><HTSearch placeholder="Search any hotel…" /></div>
      </div>
    </div>
  );
}

// ── D2 · Bold exposé (dark hero) ───────────────────────────────────────────
function HTLandingBold() {
  const d = HT_DATA;
  return (
    <div className="ht-root" style={{ background: "var(--bg)", minHeight: "100%" }}>
      <div style={{ background: "var(--ink)", color: "#fff" }}>
        <HTLandNav light />
        <div style={{ padding: "40px 48px 60px", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 48, alignItems: "center" }}>
          <div>
            <span className="ht-eyebrow" style={{ color: "var(--amber)" }}>No marketing fluff</span>
            <h1 style={{ fontSize: 58, fontWeight: 800, letterSpacing: -2.2, lineHeight: 1.0, margin: "16px 0 22px" }}>
              We read the 1-star<br/>reviews <span style={{ color: "var(--amber)" }}>so you<br/>don’t have to.</span>
            </h1>
            <p style={{ fontSize: 18.5, lineHeight: 1.55, color: "rgba(255,255,255,.74)", margin: "0 0 32px", maxWidth: 460, textWrap: "pretty" }}>
              Every hotel claims an 8-point-something. We expose the cockroaches, the fake location, the broken locks — ranked by how often travelers actually complain.
            </p>
            <div style={{ maxWidth: 520 }}><HTSearch placeholder="Search any hotel…" light /></div>
          </div>
          {/* big comparison */}
          <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 24, padding: "30px 32px" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12.5, color: "rgba(255,255,255,.55)", marginBottom: 18 }}>{HT_HOTEL.toUpperCase()}</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 28, marginBottom: 22 }}>
              <div>
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.55)", marginBottom: 4 }}>They advertise</div>
                <div style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: 60, letterSpacing: -2, color: "rgba(255,255,255,.4)",
                  textDecoration: "line-through", textDecorationColor: "var(--alert)", textDecorationThickness: 3, lineHeight: 0.85 }}>{d.advertised.toFixed(1)}</div>
              </div>
              <span style={{ color: "rgba(255,255,255,.4)", paddingBottom: 8 }}><HTIcon name="arrow" size={26} /></span>
              <div>
                <div style={{ fontSize: 12.5, color: "var(--amber)", marginBottom: 4, fontWeight: 600 }}>The honest score</div>
                <div style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: 84, letterSpacing: -3, color: "var(--amber)", lineHeight: 0.8 }}>{d.honest.toFixed(1)}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {d.complaints.slice(0, 4).map((c) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderTop: "1px solid rgba(255,255,255,.1)" }}>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: HT_SEV[c.sev].dot }} />
                  <span style={{ flex: 1, fontSize: 14.5, color: "rgba(255,255,255,.86)", fontWeight: 500 }}>{c.label}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12.5, color: "rgba(255,255,255,.5)" }}>×{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* quotes band */}
      <div style={{ padding: "56px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 40, alignItems: "center" }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: "var(--ink)", letterSpacing: -1, margin: 0, lineHeight: 1.1 }}>
            2.3M solo travelers<br/>have the same complaint.
          </h2>
          <div style={{ display: "grid", gap: 18 }}>
            {HT_QUOTES.map((qq, i) => <HTQuoteCard key={i} q={qq} />)}
          </div>
        </div>
      </div>

      {/* steps */}
      <div style={{ background: "var(--surface)", borderTop: "1px solid var(--line)", padding: "56px 48px" }}>
        <h2 className="ht-h2" style={{ marginBottom: 30 }}>How HotelTruth works</h2>
        <HTSteps />
      </div>
    </div>
  );
}

// ── D3 · Receipt / editorial (paper) ───────────────────────────────────────
function HTLandingReport() {
  const d = HT_DATA;
  return (
    <div className="ht-root" style={{ background: "var(--paper)", minHeight: "100%" }}>
      <HTLandNav />
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 52, padding: "44px 48px 56px", alignItems: "center" }}>
        <div>
          <span className="ht-eyebrow">An honest report for every hotel</span>
          <h1 style={{ fontSize: 56, fontWeight: 800, color: "var(--ink)", letterSpacing: -2, lineHeight: 1.0, margin: "16px 0 0" }}>
            Booking scores are<br/>marketing. <span style={{ color: "var(--truth)" }}>This is<br/>the receipt.</span>
          </h1>
          <p style={{ fontSize: 18.5, lineHeight: 1.55, color: "var(--ink-soft)", margin: "22px 0 30px", maxWidth: 440, textWrap: "pretty" }}>
            We turn 800+ messy reviews into one plain-text verdict: the honest score, the recurring problems, and the receipts to back it up.
          </p>
          <div style={{ maxWidth: 500 }}><HTSearch placeholder="Search any hotel…" /></div>
          <div style={{ display: "flex", gap: 28, marginTop: 30 }}>
            <HTStat value={"2.3M"} label="travelers underserved" />
            <HTStat value={d.reviews} label="reviews / report" />
            <HTStat value={"0"} label="paid placements" accent="var(--truth)" />
          </div>
        </div>
        <div style={{ transform: "rotate(1.2deg)" }}><HTScoreStudyC /></div>
      </div>

      {/* the process as a mono strip */}
      <div style={{ background: "var(--ink)", color: "#fff", padding: "52px 48px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--amber)", letterSpacing: 1, marginBottom: 28 }}>THE PROCESS</div>
        <HTSteps light />
      </div>

      {/* quotes */}
      <div style={{ padding: "56px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
          {HT_QUOTES.map((qq, i) => <HTQuoteCard key={i} q={qq} />)}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HTPreview, HTLandNav, HTLandingClean, HTLandingBold, HTLandingReport,
  HTSteps, HTQuoteCard, HT_QUOTES, HT_EXAMPLES, HT_STEPS });
