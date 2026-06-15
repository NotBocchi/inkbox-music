import {
  AppWindow,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Music2,
  Sparkles,
} from "lucide-react";
import { openExternal } from "../services/systemService";

const releaseNotes = [
  "本地音乐导入与播放",
  "LRC 歌词解析与同步",
  "Apple Music 风格歌词显示",
  "点击歌词跳转播放时间",
  "手动滚动歌词后的“回到当前歌词”按钮",
  "单击选中、双击播放",
  "三点歌曲菜单",
  "喜欢列表",
  "播放模式切换：顺序播放 / 单曲循环 / 随机播放",
  "MP3 内嵌封面读取",
  "无封面时高级渐变封面",
  "歌曲信息弹窗",
  "危险操作二次确认弹窗",
];

const references = [
  ["Tauri", "https://github.com/tauri-apps/tauri"],
  ["applemusic-like-lyrics", "https://github.com/amll-dev/applemusic-like-lyrics"],
  ["AMLL React", "https://www.npmjs.com/package/@applemusic-like-lyrics/react"],
  ["music-metadata", "https://www.npmjs.com/package/music-metadata"],
  ["jsmediatags", "https://github.com/aadsm/jsmediatags"],
];

const futurePlans = [
  "歌单系统",
  "桌面歌词",
  "歌词编辑器",
  "歌曲信息手动编辑",
  "更完整的主题系统",
  "音频频谱 / 可视化效果",
  "全局快捷键",
  "更好的本地音乐库扫描",
];

export function AboutPage() {
  return (
    <main className="about-page page-enter">
      <header className="about-hero">
        <span className="about-hero__icon"><Music2 /></span>
        <div>
          <span className="eyebrow">RELEASE 1.0</span>
          <h1>INKBOX Music</h1>
          <p>一个注重视觉体验的本地音乐播放器。</p>
        </div>
      </header>

      <div className="about-grid">
        <section className="about-card about-card--info">
          <header><AppWindow /><div><span>应用信息</span><h2>关于 INKBOX Music</h2></div></header>
          <p>支持本地音乐导入、Apple Music 风格歌词显示、歌词点击跳转、封面显示、渐变封面、喜欢列表和播放队列。</p>
          <dl>
            <div><dt>版本</dt><dd>Release 1.0</dd></div>
            <div><dt>类型</dt><dd>本地音乐播放器</dd></div>
            <div><dt>技术栈</dt><dd>Tauri + React + TypeScript</dd></div>
            <div><dt>作者</dt><dd>ink</dd></div>
          </dl>
        </section>

        <section className="about-card about-card--release">
          <header><CheckCircle2 /><div><span>更新日志</span><h2>Release 1.0</h2></div></header>
          <ul>{releaseNotes.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        <section className="about-card">
          <header><Code2 /><div><span>技术参考</span><h2>参考项目</h2></div></header>
          <div className="reference-list">
            {references.map(([name, url]) => (
              <button key={url} onClick={() => void openExternal(url)}>
                <span><strong>{name}</strong><small>{url}</small></span>
                <ArrowUpRight />
              </button>
            ))}
          </div>
        </section>

        <section className="about-card">
          <header><Sparkles /><div><span>未来计划</span><h2>下一步</h2></div></header>
          <ul className="future-list">{futurePlans.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      </div>
    </main>
  );
}
