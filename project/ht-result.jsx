// ht-result.jsx — full result screen, two directions. Width 1280.
// Exported: HTResultDashboard, HTResultReport

function HTPhoto({ label = "hotel photo", h = 320, radius = 20 }) {
  return (
    <div style={{ position: "relative", width: "100%", height: h, borderRadius: radius, overflow: "hidden",
      background: "repeating-linear-gradient(135deg, var(--line-wash) 0 14px, var(--surface) 14px 28px)",
      border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: 12.5, color: "var(--muted)",
        background: "var(--bg)", padding: "4px 10px", borderRadius: 99, border: "1px solid var(--line)" }}>{label}</span>
    </div>
  );
}

function HTTopbar({ light }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "18px 44px",
      borderBottom: `1px solid ${light ? "rgba(255,255,255,.14)" : "var(--line)"}` }}>
      <HTLogo size={21} light={light} />
      <div style={{ flex: 1, maxWidth: 440 }}>
        <HTSearch value={HT_HOTEL} size="sm" />
      </div>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 14, fontWeight: 600, color: light ? "rgba(255,255,255,.8)" : "var(--ink-soft)" }}>How it works</span>
      <span className="ht-btn ht-btn-ghost" style={{ fontSize: 14 }}>Sign in</span>
    </div>
  );
}

// R1 · Dashboard
function HTResultDashboard() {
  const d = HT_DATA;
  return (
    <div className="ht-root" style={{ background: "var(--bg)", minHeight: "100%" }}>
      <HTTopbar />
      {/* hero */}
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 44, padding: "40px 44px 32px", alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span className="ht-eyebrow">Honest report</span>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>· Bangkok, Thailand</span>
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: "var(--ink)", letterSpacing: -1.4, margin: "0 0 18px", lineHeight: 1.02 }}>{HT_HOTEL}</h1>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 26 }}>
            <HTScoreBig value={d.honest} size={104} />
          </div>
          <p style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.5, marginTop: 22, maxWidth: 480, textWrap: "pretty" }}>
            Booking sites advertise an <b style={{ color: "var(--ink)" }}>{d.advertised.toFixed(1)}</b>. We read all {d.reviews} reviews — the
            real picture is <b style={{ color: "var(--ink)" }}>pests, a misleading location, and broken locks</b> buried under the marketing.
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
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 30, padding: "34px 44px 48px", alignItems: "start" }}>
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
            {d.complaints.map((c) => <HTComplaint key={c.id} c={c} />)}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "var(--ink)", borderRadius: 20, padding: "24px 24px", color: "#fff" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--amber)", marginBottom: 12 }}>The verdict</div>
            <div style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.35, letterSpacing: -0.3 }}>
              Fine for a cheap one-night stopover. Not if you’re travelling solo or need to sleep, work, or feel safe.
            </div>
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20, padding: "22px 22px" }}>
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
            <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>HOW WE GOT 4.1</div>
            <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5 }}>
              Every review is read for concrete problems, weighted by severity and how often it repeats — then the marketing-driven inflation is stripped out.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// R2 · Investigative report
function HTResultReport() {
  const d = HT_DATA;
  return (
    <div className="ht-root" style={{ background: "var(--paper)", minHeight: "100%" }}>
      <HTTopbar />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "52px 32px 56px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "var(--mono)", fontSize: 12.5,
          color: "var(--muted)", marginBottom: 24 }}>
          <span style={{ color: "var(--alert)", fontWeight: 700 }}>HONEST REPORT</span>
          <span style={{ width: 4, height: 4, borderRadius: 99, background: "var(--muted)" }} />
          <span>{d.reviews} REVIEWS · BANGKOK</span>
        </div>

        <h1 style={{ fontSize: 52, fontWeight: 800, letterSpacing: -1.8, lineHeight: 1.02, color: "var(--ink)", margin: "0 0 20px" }}>{HT_HOTEL}</h1>

        <p style={{ fontSize: 21, lineHeight: 1.5, color: "var(--ink-soft)", margin: "0 0 32px", textWrap: "pretty" }}>
          It advertises an <span style={{ textDecoration: "line-through", textDecorationColor: "var(--alert)" }}>{d.advertised.toFixed(1)}</span>.
          After reading every review, the honest number is{" "}
          <b style={{ color: htScoreColor(d.honest) }}>{d.honest.toFixed(1)}</b> — and here’s exactly why.
        </p>

        {/* big score band */}
        <div style={{ display: "flex", alignItems: "center", gap: 28, padding: "26px 0", borderTop: "2px solid var(--ink)",
          borderBottom: "1px solid var(--line)", marginBottom: 36 }}>
          <div style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: 96, letterSpacing: -4,
            color: htScoreColor(d.honest), lineHeight: 0.8 }}>{d.honest.toFixed(1)}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span className="ht-verified">⎯ Honest score / 10</span>
            <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              {Math.round(d.reviews * d.complaintPct / 100)} of {d.reviews} reviews ({d.complaintPct}%)<br/>describe a real problem.
            </div>
          </div>
        </div>

        {/* numbered complaints */}
        <h2 style={{ fontFamily: "var(--mono)", fontSize: 13, letterSpacing: 1, color: "var(--muted)", margin: "0 0 4px" }}>THE COMPLAINTS, RANKED</h2>
        <div>
          {d.complaints.map((c, i) => (
            <div key={c.id} style={{ display: "flex", gap: 20, padding: "22px 0", borderBottom: "1px solid var(--line)" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 14, color: HT_SEV[c.sev].dot, fontWeight: 700, paddingTop: 3, width: 28 }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 19, fontWeight: 700, color: "var(--ink)", letterSpacing: -0.3 }}>{c.label}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11.5, fontWeight: 600, color: HT_SEV[c.sev].dot,
                    background: HT_SEV[c.sev].bg, padding: "2px 8px", borderRadius: 99 }}>{c.count} reviews</span>
                </div>
                <div style={{ fontSize: 16.5, color: "var(--ink-soft)", fontStyle: "italic", lineHeight: 1.5 }}>{c.quote}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 34, padding: "26px 28px", background: "var(--ink)", borderRadius: 20, color: "#fff" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>The verdict</div>
          <div style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.4, letterSpacing: -0.3 }}>
            Fine for a cheap one-night stopover. Not if you’re travelling solo or need to sleep, work, or feel safe.
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HTPhoto, HTTopbar, HTResultDashboard, HTResultReport });
