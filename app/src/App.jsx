import { useState, useCallback } from "react";
import { Landing } from "./pages/Landing";
import { Result } from "./pages/Result";
import { TweaksPanel } from "./components/TweaksPanel";
import { streamAnalyze } from "./api";
import { HT_HOTEL } from "./data";

const DEFAULTS = {
  accent: "oklch(0.60 0.105 185)",
  tone: "calm",
  heroStyle: "gauge",
  dark: false,
};

export default function App() {
  const [tweaks, setTweaks] = useState(DEFAULTS);
  const [view, setView] = useState("landing");
  const [query, setQuery] = useState(HT_HOTEL);

  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [error, setError] = useState(null);

  const setTweak = (key, val) => setTweaks((prev) => ({ ...prev, [key]: val }));

  const goHome = useCallback(() => {
    setView("landing");
    window.scrollTo({ top: 0 });
  }, []);

  const goResult = useCallback(async (q) => {
    const searchQuery = (typeof q === "string" && q.trim()) ? q.trim() : query;
    if (searchQuery !== query) setQuery(searchQuery);

    setView("result");
    setLoading(true);
    setStatusMsg("");
    setError(null);
    setHotelData(null);
    window.scrollTo({ top: 0 });

    try {
      for await (const event of streamAnalyze(searchQuery)) {
        if (event.type === "status") {
          setStatusMsg(event.message);
        } else if (event.type === "result") {
          setHotelData(event.data);
          setLoading(false);
          setStatusMsg("");
        } else if (event.type === "error") {
          throw new Error(event.message);
        }
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [query]);

  return (
    <div
      className={"ht-app" + (tweaks.dark ? " ht-dark" : "")}
      style={{ "--truth": tweaks.accent }}
    >
      {view === "landing" ? (
        <Landing
          tone={tweaks.tone}
          query={query}
          setQuery={setQuery}
          onSearch={goResult}
          onHome={goHome}
        />
      ) : (
        <Result
          tone={tweaks.tone}
          heroStyle={tweaks.heroStyle}
          query={query}
          setQuery={setQuery}
          onSearch={goResult}
          onHome={goHome}
          hotelData={hotelData}
          loading={loading}
          statusMsg={statusMsg}
          error={error}
        />
      )}
      <TweaksPanel
        tweaks={tweaks}
        setTweak={setTweak}
        view={view}
        onJump={view === "landing" ? goResult : goHome}
      />
    </div>
  );
}
