import { X } from "lucide-react";
import type { GradientCover, Song } from "../types/music";
import {
  defaultGradientFor,
  gradientCoverStyle,
  gradientPresets,
} from "../utils/gradientCover";
import { CoverArt } from "./CoverArt";

interface GradientCoverModalProps {
  song: Song;
  value: GradientCover;
  onChange: (value: GradientCover) => void;
  onSave: () => void;
  onClose: () => void;
}

export function GradientCoverModal({
  song,
  value,
  onChange,
  onSave,
  onClose,
}: GradientCoverModalProps) {
  function update(changes: Partial<GradientCover>) {
    onChange({ ...value, ...changes });
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="modal gradient-modal" onMouseDown={(event) => event.stopPropagation()}>
        <header className="modal__header">
          <div><span className="eyebrow">COVER STUDIO</span><h2>编辑渐变封面</h2></div>
          <button className="icon-button" title="关闭" onClick={onClose}><X /></button>
        </header>
        <div className="gradient-modal__body">
          <div className="gradient-modal__preview">
            <div className="cover-art cover-art--large cover-art--gradient" style={gradientCoverStyle(value)}>
              <span className="cover-art__glow" />
            </div>
            <strong>{song.title}</strong>
            <span>{song.artist}</span>
          </div>
          <div className="gradient-controls">
            <label>预设
              <select
                value={value.preset}
                onChange={(event) => {
                  const preset = event.target.value;
                  onChange({ preset, ...gradientPresets[preset] });
                }}
              >
                {Object.keys(gradientPresets).map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
            <div className="color-controls">
              {(["primary", "secondary", "accent"] as const).map((key) => (
                <label key={key}>{key === "primary" ? "主色" : key === "secondary" ? "辅色" : "点缀色"}
                  <input type="color" value={value[key]} onChange={(event) => update({ [key]: event.target.value })} />
                </label>
              ))}
            </div>
            {(["direction", "glow", "noise", "vignette"] as const).map((key) => (
              <label key={key}>{({ direction: "方向", glow: "光斑", noise: "噪点", vignette: "暗角" })[key]}
                <input
                  type="range"
                  min="0"
                  max={key === "direction" ? "360" : "100"}
                  value={value[key]}
                  onChange={(event) => update({ [key]: Number(event.target.value) })}
                />
              </label>
            ))}
          </div>
        </div>
        <footer className="modal__footer">
          <button className="secondary-button" onClick={() => onChange(defaultGradientFor(song))}>恢复推荐</button>
          <button className="primary-button" onClick={onSave}>保存封面</button>
        </footer>
      </section>
    </div>
  );
}
