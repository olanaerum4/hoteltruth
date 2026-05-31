export function HTIcon({ name, size = 20, stroke = 1.7, color = "currentColor" }) {
  const p = { fill: "none", stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    bug:    <g {...p}><ellipse cx="12" cy="13" rx="4.2" ry="5.3"/><path d="M12 7.7V5.4M9.4 6 8 4.4M14.6 6 16 4.4M7.8 11H4.5M16.2 11h3.3M7.8 14.5H4.4M16.2 14.5h3.4M7.9 18l-1.6 1.6M16.1 18l1.6 1.6"/></g>,
    pin:    <g {...p}><path d="M12 21s6.5-5.4 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.6 12 21 12 21Z"/><circle cx="12" cy="10.6" r="2.3"/></g>,
    wifi:   <g {...p}><path d="M4.5 9.2a11 11 0 0 1 15 0M7.4 12.4a7 7 0 0 1 9.2 0M10.2 15.5a3 3 0 0 1 3.6 0"/><circle cx="12" cy="18.3" r="0.6" fill={color} stroke="none"/></g>,
    lock:   <g {...p}><rect x="5" y="10.5" width="14" height="9.5" rx="1.8"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></g>,
    noise:  <g {...p}><path d="M4 9.5v5h3l4.5 3.5v-12L7 9.5H4ZM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></g>,
    search: <g {...p}><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></g>,
    check:  <g {...p}><path d="m5 12.5 4.5 4.5L19 7"/></g>,
    arrow:  <g {...p}><path d="M5 12h14M13 6l6 6-6 6"/></g>,
    chevron:<g {...p}><path d="m8 5 7 7-7 7"/></g>,
    spark:  <g {...p}><path d="M12 4v4M12 16v4M4 12h4M16 12h4"/></g>,
    flag:   <g {...p}><path d="M6 21V4M6 4h11l-2.2 3.5L17 11H6"/></g>,
    quote:  <g {...p}><path d="M9 7c-2.5 1-3.5 3-3.5 5.5V17H10v-4.5H7.2C7.4 10 8.2 9 10 8.3M18 7c-2.5 1-3.5 3-3.5 5.5V17H19v-4.5h-2.8C16.4 10 17.2 9 19 8.3"/></g>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0 }}>
      {paths[name] || paths.search}
    </svg>
  );
}
