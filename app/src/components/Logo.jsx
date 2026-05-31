export function HTLogo({ size = 22, light }) {
  const ink = light ? "#fff" : "var(--ink)";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.42,
      fontFamily: "var(--sans)", fontWeight: 800, fontSize: size, letterSpacing: -0.6,
      color: ink, lineHeight: 1 }}>
      <span aria-hidden style={{ position: "relative", width: size * 1.02, height: size * 1.02,
        display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ position: "absolute", inset: 0, borderRadius: "50%",
          border: `${Math.max(2, size * 0.11)}px solid var(--truth)` }} />
        <span style={{ width: size * 0.3, height: size * 0.3, borderRadius: "50%",
          background: "var(--truth)" }} />
      </span>
      <span>Hotel<span style={{ color: "var(--truth)" }}>Truth</span></span>
    </span>
  );
}
