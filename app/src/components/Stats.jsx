export function HTStat({ value, label, accent, mono = true }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{
        fontFamily: mono ? "var(--mono)" : "var(--sans)", fontWeight: 700,
        fontSize: 30, letterSpacing: -1, color: accent || "var(--ink)", lineHeight: 1,
      }}>{value}</div>
      <div style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 500, letterSpacing: 0.1 }}>{label}</div>
    </div>
  );
}

export function HTStatRow({ items, divided = true }) {
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
