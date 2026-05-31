// ht-flow.jsx — committed interactive prototype: Landing A → Dashboard result.
// Tweak-aware (tone / hero score style / accent / theme). Uses ht-parts atoms.
// Exported: HTFlowLanding, HTFlowResult

const HT_TONE = {
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

// ── Landing (direction A, flow-aware) ──────────────────────────────────────
function HTFlowLanding({ tone = "calm", query, setQuery, onSearch, onHome }) {
  const c = HT_TONE[tone];
  const focusSearch = () => { const el = document.querySelector(".ht-hero-search input"); if (el) el.focus(); };
  return (
    <div>
      {/* nav */}
      <div style={{ display: "flex", alignItems: "center", padding: "20px 48px", maxWidth: 1320, margin: "0 auto" }}>
        <span onClick={onHome} style={{ cursor: "pointer" }}><HTLogo size={22} /></span>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {["How it works", "Why scores lie", "About"].map((x) => (
            <span key={x} className="ht-navlink" style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink-soft)", cursor: "pointer" }}>{x}</span>
          ))}
          <span className="ht-btn ht-btn-primary" style={{ fontSize: 14 }} onClick={focusSearch}>Search a hotel</span>
        </div>
      </div>

      {/* hero */}
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, padding: "44px 48px 64px", alignItems: "center" }}>
          <div>
            <span className="ht-eyebrow">For travelers who read the 1-star reviews</span>
            <h1 style={{ fontSize: 60, fontWeight: 800, color: "var(--ink)", letterSpacing: -2.4, lineHeight: 0.98, margin: "16px 0 0" }}>
              {c.h1a}<br/><span style={{ color: "var(--truth)" }}>{c.h1b}</span> {c.h1c}
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.55, color: "var(--ink-soft)", margin: "22px 0 30px", maxWidth: 470, textWrap: "pretty" }}>{c.sub}</p>
            <div className="ht-hero-search" style={{ maxWidth: 540 }}>
              <HTSearch value={query} onChange={setQuery} onSubmit={onSearch} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>Try:</span>
              {HT_EXAMPLES.map((x) => (
                <span key={x} className="ht-chip" onClick={() => { setQuery(x); onSearch(x); }} style={{ cursor: "pointer" }}>{x}</span>
              ))}
            </div>
          </div>
          <div onClick={() => onSearch()} style={{ cursor: "pointer" }} title="See the full report"><HTPreview compact /></div>
        </div>
      </div>

      {/* problem */}
      <div style={{ background: "var(--surface)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "60px 48px" }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: "var(--ink)", letterSpacing: -1, margin: "0 0 8px" }}>The 8.2 problem</h2>
          <p style={{ fontSize: 17, color: "var(--ink-soft)", maxWidth: 640, lineHeight: 1.5, margin: "0 0 32px" }}>
            Booking.com and TripAdvisor scores are inflated and gamed. The problems that actually ruin a trip are buried in the 1- and 2-star reviews nobody reads.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            {HT_QUOTES.map((qq, i) => <HTQuoteCard key={i} q={qq} />)}
          </div>
        </div>
      </div>

      {/* how it works */}
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "60px 48px" }}>
        <h2 className="ht-h2" style={{ marginBottom: 30 }}>From hotel name to the honest truth in seconds</h2>
        <HTSteps />
      </div>

      {/* footer CTA */}
      <div style={{ background: "var(--invert-bg)", color: "var(--invert-fg)", padding: "64px 48px", textAlign: "center" }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1.4, margin: "0 0 10px" }}>{c.footerH}</h2>
        <p style={{ fontSize: 17, opacity: .72, margin: "0 auto 28px", maxWidth: 460 }}>{c.footerP}</p>
        <div style={{ maxWidth: 540, margin: "0 auto" }}>
          <HTSearch value={query} onChange={setQuery} onSubmit={onSearch} light />
        </div>
      </div>
    </div>
  );
}

// ── Result (Dashboard, flow-aware) ──────────────────────────────────────────
function HTFlowResult({ tone = "calm", heroStyle = "gauge", query, setQuery, onSearch, onHome }) {
  const d = HT_DATA;
  const c = HT_TONE[tone];
  return (
    <div>
      {/* topbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "18px 44px", borderBottom: "1px solid var(--line)" }}>
        <span onClick={onHome} style={{ cursor: "pointer" }}><HTLogo size={21} /></span>
        <div style={{ flex: 1, maxWidth: 440 }}>
          <HTSearch value={query} onChange={setQuery} onSubmit={onSearch} size="sm" />
        </div>
        <div style={{ flex: 1 }} />
        <span className="ht-btn ht-btn-ghost" style={{ fontSize: 14 }} onClick={onHome}>New search</span>
      </div>

      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        {/* hero */}
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 44, padding: "40px 44px 32px", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span className="ht-eyebrow">Honest report</span>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>· Bangkok, Thailand</span>
            </div>
            <h1 style={{ fontSize: 44, fontWeight: 800, color: "var(--ink)", letterSpacing: -1.4, margin: "0 0 18px", lineHeight: 1.02 }}>{HT_HOTEL}</h1>
            {heroStyle === "gauge" ? (
              <HTScoreBig value={d.honest} size={104} />
            ) : (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 26 }}>
                <div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600, marginBottom: 4 }}>Advertised</div>
                  <div style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: 52, letterSpacing: -2, color: "var(--muted)",
                    textDecoration: "line-through", textDecorationColor: "var(--alert)", textDecorationThickness: 3, lineHeight: 0.85 }}>{d.advertised.toFixed(1)}</div>
                </div>
                <span style={{ color: "var(--muted)", paddingBottom: 8 }}><HTIcon name="arrow" size={24} /></span>
                <HTScoreBig value={d.honest} size={92} />
              </div>
            )}
            <p style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.5, marginTop: 22, maxWidth: 480, textWrap: "pretty" }}>
              {c.resultLede[0]}<b style={{ color: "var(--ink)" }}>{d.advertised.toFixed(1)}</b>{c.resultLede[1]}<b style={{ color: "var(--ink)" }}>{d.reviews}</b>{c.resultLede[2]}<b style={{ color: "var(--ink)" }}>{c.resultLede[3]}</b>{c.resultLede[4]}
            </p>
          </div>
          <HTPhoto h={340} />
        </div>

        {/* stat strip */}
        <div style={{ margin: "0 44px", padding: "22px 28px", background: "var(--surface)", border: "1px solid var(--line)",
          borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 30 }}>
          <HTStatRow items={[
            { value: d.honest.toFixed(1), label: "honest score", accent: htScoreColor(d.honest) },
            { value: d.reviews, label: "reviews analyzed" },
            { value: d.complaintPct + "%", label: "are complaints", accent: "var(--alert)" },
            { value: d.advertised.toFixed(1), label: "advertised" },
          ]} />
          <div style={{ flex: 1, maxWidth: 320, paddingTop: 16 }}><HTScoreTrack honest={d.honest} advertised={d.advertised} /></div>
        </div>

        {/* body */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 30, padding: "34px 44px 56px", alignItems: "start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 className="ht-h2">What actually goes wrong</h2>
              <div style={{ display: "flex", gap: 8 }}>
                <span className="ht-chip ht-chip-on">All</span>
                <span className="ht-chip">Serious</span>
                <span className="ht-chip">Safety</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {d.complaints.map((cc) => <HTComplaint key={cc.id} c={cc} />)}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ background: "var(--invert-bg)", borderRadius: 20, padding: "24px", color: "var(--invert-fg)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--amber)", marginBottom: 12 }}>The verdict</div>
              <div style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.35, letterSpacing: -0.3 }}>{c.verdict}</div>
            </div>

            <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20, padding: "22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ color: "var(--good)" }}><HTIcon name="check" size={18} stroke={2.2} /></span>
                <span style={{ fontWeight: 700, fontSize: 15.5, color: "var(--ink)" }}>What’s actually good</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {d.goods.map((g, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 15, color: "var(--ink-soft)" }}>{g.label}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 12.5, color: "var(--good)" }}>×{g.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ border: "1px dashed var(--line-strong)", borderRadius: 20, padding: "20px 22px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>HOW WE GOT {d.honest.toFixed(1)}</div>
              <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                Every review is read for concrete problems, weighted by severity and how often it repeats — then the marketing-driven inflation is stripped out.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HT_TONE, HTFlowLanding, HTFlowResult });
