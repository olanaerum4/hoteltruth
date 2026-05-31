// ht-score.jsx — three "Honest Score" component studies
// Width ~600 cards. Exported: HTScoreStudyA / B / C

// A · Gauge + complaint cards (the sketch direction)
function HTScoreStudyA() {
  const d = HT_DATA;
  return (
    <div className="ht-root" style={{ padding: 30, background: "var(--bg)", height: "100%", boxSizing: "border-box",
      display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase",
            letterSpacing: 1.4, marginBottom: 8 }}>Result for</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)", letterSpacing: -0.5 }}>{HT_HOTEL}</div>
        </div>
        <HTScoreBig value={d.honest} size={72} sub={null} />
      </div>
      <HTStatRow items={[
        { value: d.reviews, label: "reviews analyzed" },
        { value: d.complaintPct + "%", label: "are complaints", accent: "var(--alert)" },
        { value: d.advertised.toFixed(1), label: "advertised score" },
      ]} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 2 }}>
        {d.complaints.slice(0, 4).map((c) => <HTComplaint key={c.id} c={c} />)}
      </div>
    </div>
  );
}

// B · Advertised vs Honest comparison
function HTScoreStudyB() {
  const d = HT_DATA;
  return (
    <div className="ht-root" style={{ padding: 34, background: "var(--bg)", height: "100%", boxSizing: "border-box",
      display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase",
        letterSpacing: 1.4 }}>The gap</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "var(--ink)", letterSpacing: -0.6, marginTop: 8, marginBottom: 28,
        lineHeight: 1.2 }}>What they show you vs.<br/>what travelers actually said</div>

      <div style={{ display: "flex", gap: 18, alignItems: "stretch" }}>
        <div style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 18,
          padding: "22px 22px 20px", opacity: .92 }}>
          <div style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600, marginBottom: 10 }}>Booking sites show</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, color: "var(--muted)",
            fontFamily: "var(--sans)", fontWeight: 800, letterSpacing: -2 }}>
            <span style={{ fontSize: 64, textDecoration: "line-through", textDecorationThickness: 3, textDecorationColor: "var(--alert)" }}>{d.advertised.toFixed(1)}</span>
            <span style={{ fontSize: 20, opacity: .6 }}>/10</span>
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 10 }}>“Marketing fluff”, paid placements, filtered reviews.</div>
        </div>
        <div style={{ flex: 1, background: "var(--ink)", borderRadius: 18, padding: "22px 22px 20px", color: "#fff" }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 10, color: "var(--truth-soft)" }}>HotelTruth says</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4,
            fontFamily: "var(--sans)", fontWeight: 800, letterSpacing: -2, color: "var(--amber)" }}>
            <span style={{ fontSize: 64 }}>{d.honest.toFixed(1)}</span>
            <span style={{ fontSize: 20, opacity: .6 }}>/10</span>
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.72)", marginTop: 10 }}>From {d.reviews} reviews, weighted by what goes wrong.</div>
        </div>
      </div>

      <div style={{ marginTop: 30, marginBottom: 6 }}><HTScoreTrack honest={d.honest} advertised={d.advertised} /></div>
      <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10, fontSize: 14.5, color: "var(--ink-soft)" }}>
        <span style={{ fontFamily: "var(--mono)", fontWeight: 700, color: "var(--alert)", fontSize: 17 }}>−4.3</span>
        <span>points the booking score was hiding from you.</span>
      </div>
    </div>
  );
}

// C · Honesty report / receipt (mono)
function HTScoreStudyC() {
  const d = HT_DATA;
  return (
    <div className="ht-root" style={{ padding: 30, background: "var(--paper)", height: "100%", boxSizing: "border-box",
      display: "flex", flexDirection: "column" }}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14,
        padding: "26px 28px", fontFamily: "var(--mono)", flex: 1, display: "flex", flexDirection: "column",
        boxShadow: "0 1px 2px rgba(20,30,40,.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 14 }}>
          <HTLogo size={16} />
          <span style={{ fontSize: 11, color: "var(--muted)" }}>ANALYSIS · 29 MAY 2026</span>
        </div>
        <div style={{ borderTop: "1.5px dashed var(--line-strong)", paddingTop: 14 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 0.5 }}>HOTEL</div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 19, fontWeight: 800, color: "var(--ink)", margin: "2px 0 14px" }}>{HT_HOTEL}</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink-soft)", marginBottom: 6 }}>
            <span>Reviews scanned</span><span style={{ color: "var(--ink)" }}>{d.reviews}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink-soft)" }}>
            <span>Flagged as complaints</span><span style={{ color: "var(--alert)" }}>{Math.round(d.reviews * d.complaintPct / 100)} ({d.complaintPct}%)</span></div>
        </div>
        <div style={{ borderTop: "1.5px dashed var(--line-strong)", margin: "16px 0 12px" }} />
        <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 0.5, marginBottom: 10 }}>TOP COMPLAINTS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
          {d.complaints.map((c) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: HT_SEV[c.sev].dot }} />
              <span style={{ flex: 1, color: "var(--ink-soft)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.label}</span>
              <span style={{ color: "var(--ink)" }}>×{c.count}</span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1.5px dashed var(--line-strong)", margin: "14px 0", position: "relative" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 0.5 }}>HONEST SCORE</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>advertised <span style={{ textDecoration: "line-through" }}>{d.advertised.toFixed(1)}</span></div>
          </div>
          <div style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: 52, letterSpacing: -2,
            color: htScoreColor(d.honest), lineHeight: 0.9 }}>{d.honest.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HTScoreStudyA, HTScoreStudyB, HTScoreStudyC });
