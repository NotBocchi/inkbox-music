import { Settings } from "lucide-react";
import { usePlayerStore } from "../stores/playerStore";

export function SettingsPage() {
  const volume = usePlayerStore((state) => state.volume);
  const setVolume = usePlayerStore((state) => state.setVolume);

  return (
    <main className="settings-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">PREFERENCES</span>
          <h1>设置</h1>
          <p>调整本机播放体验</p>
        </div>
      </header>
      <section className="settings-section">
        <div className="settings-section__icon"><Settings /></div>
        <div>
          <h2>默认音量</h2>
          <p>音量和播放模式会自动保存在此设备。</p>
        </div>
        <input
          aria-label="默认音量"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          style={{ "--progress": `${volume * 100}%` } as React.CSSProperties}
        />
        <strong>{Math.round(volume * 100)}%</strong>
      </section>
    </main>
  );
}
