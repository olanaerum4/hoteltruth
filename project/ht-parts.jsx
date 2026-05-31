// ht-parts.jsx — shared HotelTruth pieces (logo, icons, score, stats, complaints, search)
// Exported to window for use across board files. Inline styles + .ht-* utility classes.

// ── Data ────────────────────────────────────────────────────────────────
const HT_HOTEL = "Hotel Sunrise Bangkok";
const HT_DATA = {
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
      quote: "“room lock was broken — didn't feel safe travelling solo”" },
    { id: "noise", icon: "noise", label: "Noise at night", count: 16, sev: "low",
      quote: "“club next door until 3am, paper-thin walls”" },
  ],
  goods: [
    { label: "Staff genuinely friendly", count: 41 },
    { label: "Breakfast better than expected", count: 22 },
  ],
};

// ── Score color logic — low = warning, high = trust ──────────────────────
function htScoreColor(v) {
  if (v < 4) return "var(--alert)";
  if (v < 6) return "var(--amber)";
  if (v < 8) return "var(--truth)";
  return "var(--good)";
}
const HT_SEV = {
  high: { dot: "var(--alert)", bg: "var(--alert-wash)", label: "Serious" },
  med:  { dot: "var(--amber)", bg: "var(--amber-wash)", label: "Common" },
  low:  { dot: "var(--muted)", bg: "var(--line-wash)", label: "Minor" },
};

// ── Logo ─────────────────────────────────────────────────────────────────
function HTLogo({ size = 22, mono, light }) {
  const ink = light ? "#fff" : "var(--ink)";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.42,
      fontFamily: "var(--sans)", fontWeight: 800, fontSize: size, letterSpacing: -0.6,
      color: ink, lineHeight: 1 }}>
      <span aria-hidden style={{ position: "relative", width: size * 1.02, height: size * 1.02,
        display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ position: "absolute", inset: 0, borderRadius: "50%",
          border: `${Math.max(2, size * 0.11)}px solid ${mono ? ink : "var(--truth)"}` }} />
        <span style={{ width: size * 0.3, height: size * 0.3, borderRadius: "50%",
          background: mono ? ink : "var(--truth)" }} />
      </span>
      <span>Hotel<span style={{ color: mono ? ink : "var(--truth)" }}>Truth</span></span>
    </span>
  );
}

// ── Icon set (simple line glyphs) ─────────────────────────────────────────
function HTIcon({ name, size = 20, stroke = 1.7, color = "currentColor" }) {
  const p = { fill: "none", stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    bug: <g {...p}><ellipse cx="12" cy="13" rx="4.2" ry="5.3"/><path d="M12 7.7V5.4M9.4 6 8 4.4M14.6 6 16 4.4M7.8 11H4.5M16.2 11h3.3M7.8 14.5H4.4M16.2 14.5h3.4M7.9 18l-1.6 1.6M16.1 18l1.6 1.6"/></g>,
    pin: <g {...p}><path d="M12 21s6.5-5.4 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.6 12 21 12 21Z"/><circle cx="12" cy="10.6" r="2.3"/></g>,
    wifi: <g {...p}><path d="M4.5 9.2a11 11 0 0 1 15 0M7.4 12.4a7 7 0 0 1 9.2 0M10.2 15.5a3 3 0 0 1 3.6 0"/><circle cx="12" cy="18.3" r="0.6" fill={color} stroke="none"/></g>,
    lock: <g {...p}><rect x="5" y="10.5" width="14" height="9.5" rx="1.8"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></g>,
    noise: <g {...p}><path d="M4 9.5v5h3l4.5 3.5v-12L7 9.5H4ZM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></g>,
    search: <g {...p}><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></g>,
    check: <g {...p}><path d="m5 12.5 4.5 4.5L19 7"/></g>,
    arrow: <g {...p}><path d="M5 12h14M13 6l6 6-6 6"/></g>,
    chevron: <g {...p}><path d="m8 5 7 7-7 7"/></g>,
    spark: <g {...p}><path d="M12 4v4M12 16v4M4 12h4M16 12h4"/></g>,
    flag: <g {...p}><path d="M6 21V4M6 4h11l-2.2 3.5L17 11H6"/></g>,
    quote: <g {...p}><path d="M9 7c-2.5 1-3.5 3-3.5 5.5V17H10v-4.5H7.2C7.4 10 8.2 9 10 8.3 M18 7c-2.5 1-3.5 3-3.5 5.5V17H19v-4.5h-2.8C16.4 10 17.2 9 19 8.3"/></g>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0 }}>{paths[name] || paths.search}</svg>;
}

// ── Search bar ─────────────────────────────────────────────────────────────
function HTSearch({ value = "", placeholder = "Search any hotel…", onChange, onSubmit, size = "lg", light }) {
  const big = size === "lg";
  return (
    <form className="ht-search" onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(); }}
      style={{ display: "flex", alignItems: "center", gap: 10, width: "100%",
        background: light ? "rgba(255,255,255,.1)" : "var(--surface)",
        border: `1.5px solid ${light ? "rgba(255,255,255,.25)" : "var(--line)"}`,
        borderRadius: 999, padding: big ? "8px 8px 8px 22px" : "6px 6px 6px 16px",
        boxShadow: light ? "none" : "0 1px 2px rgba(20,30,40,.04)" }}>
      <span style={{ color: light ? "rgba(255,255,255,.7)" : "var(--muted)" }}><HTIcon name="search" size={big ? 22 : 18} /></span>
      <input value={value} placeholder={placeholder} onChange={(e) => onChange && onChange(e.target.value)}
        style={{ flex: 1, border: "none", outline: "none", background: "transparent",
          fontFamily: "var(--sans)", fontWeight: 500, fontSize: big ? 18 : 15,
          color: light ? "#fff" : "var(--ink)", minWidth: 0 }} />
      <button type="submit" className="ht-btn ht-btn-primary"
        style={{ padding: big ? "12px 22px" : "9px 16px", fontSize: big ? 16 : 14 }}>
        Get the truth
      </button>
    </form>
  );
}

// ── Score number (big honest score) ────────────────────────────────────────
function HTScoreBig({ value = 4.1, size = 116, label = "Honest score", sub }) {
  const c = htScoreColor(value);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, color: c,
        fontFamily: "var(--sans)", fontWeight: 800, lineHeight: 0.9, letterSpacing: -3 }}>
        <span style={{ fontSize: size }}>{value.toFixed(1)}</span>
        <span style={{ fontSize: size * 0.28, fontWeight: 700, opacity: .5, letterSpacing: -0.5 }}>/10</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
        <span className="ht-verified">
          <HTIcon name="check" size={13} stroke={2.4} /> {label}
        </span>
        {sub && <span style={{ fontSize: 13, color: "var(--muted)" }}>{sub}</span>}
      </div>
    </div>
  );
}

// horizontal score track showing honest vs advertised
function HTScoreTrack({ honest = 4.1, advertised = 8.4 }) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ position: "relative", height: 10, borderRadius: 999, background: "var(--line-wash)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${honest * 10}%`,
          borderRadius: 999, background: htScoreColor(honest) }} />
        <div style={{ position: "absolute", left: `${advertised * 10}%`, top: -5, bottom: -5, width: 2,
          background: "var(--ink)", opacity: .35 }} />
        <div style={{ position: "absolute", left: `${advertised * 10}%`, top: -22, transform: "translateX(-50%)",
          fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap" }}>
          adv. {advertised.toFixed(1)}
        </div>
      </div>
    </div>
  );
}

// ── Stat trio ──────────────────────────────────────────────────────────────
function HTStat({ value, label, accent, mono = true }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontFamily: mono ? "var(--mono)" : "var(--sans)", fontWeight: 700,
        fontSize: 30, letterSpacing: -1, color: accent || "var(--ink)", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 500, letterSpacing: 0.1 }}>{label}</div>
    </div>
  );
}
function HTStatRow({ items, divided = true }) {
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "stretch", gap: 28 }}>
          {i > 0 && divided && <div style={{ width: 1, background: "var(--line)" }} />}
          <div style={{ paddingRight: i < items.length - 1 ? 28 : 0 }}>
            <HTStat {...it} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Complaint row ────────────────────────────────────────────────────────────
function HTComplaint({ c, expanded = true, variant = "card" }) {
  const sev = HT_SEV[c.sev];
  if (variant === "line") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0",
        borderBottom: "1px solid var(--line)" }}>
        <span style={{ width: 7, height: 7, borderRadius: 99, background: sev.dot, flexShrink: 0 }} />
        <span style={{ flex: 1, fontWeight: 600, fontSize: 15.5, color: "var(--ink)" }}>{c.label}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--muted)" }}>×{c.count}</span>
      </div>
    );
  }
  return (
    <div className="ht-complaint" style={{ background: "var(--surface)", border: "1px solid var(--line)",
      borderRadius: 16, padding: "16px 18px", display: "flex", gap: 14 }}>
      <span style={{ width: 42, height: 42, borderRadius: 12, background: sev.bg, color: sev.dot,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <HTIcon name={c.icon} size={21} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)", letterSpacing: -0.2 }}>{c.label}</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11.5, fontWeight: 600, color: sev.dot,
            background: sev.bg, padding: "2px 8px", borderRadius: 99 }}>{c.count} reviews</span>
        </div>
        {expanded && (
          <div style={{ fontSize: 14.5, color: "var(--ink-soft)", fontStyle: "italic", lineHeight: 1.45 }}>{c.quote}</div>
        )}
      </div>
      <span style={{ alignSelf: "center", color: "var(--muted)", opacity: .5 }}><HTIcon name="chevron" size={16} /></span>
    </div>
  );
}

Object.assign(window, {
  HT_HOTEL, HT_DATA, HT_SEV, htScoreColor,
  HTLogo, HTIcon, HTSearch, HTScoreBig, HTScoreTrack, HTStat, HTStatRow, HTComplaint,
});
