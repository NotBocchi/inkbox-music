# Inkbox Music

本地优先的 Tauri v2 音乐播放器，使用 React、TypeScript、Zustand、
HTMLAudioElement 和 AMLL React。

> **AI 辅助开发声明**
>
> 本软件由作者 ink 在 AI 工具辅助下设计与开发。AI 参与了部分代码生成、
> 调试、文档整理与实现建议，最终功能取舍、代码整合与发布由作者完成。

## 开发

需要 Node.js 20+、Rust stable 和 Tauri v2 的 Windows 系统依赖。

```powershell
npm install
npm run tauri:dev
```

## 当前能力

- 导入单个或多个 MP3、FLAC、WAV、M4A 文件
- 递归导入音乐文件夹
- 播放、暂停、切歌、进度、音量与三种播放模式
- 手动导入 LRC，并转换为 AMLL 歌词数据
- 深色沉浸式正在播放页
- ID3/Vorbis 元数据、内嵌封面和歌曲时长读取
- 喜欢列表、播放队列和同步歌词
- 安装包内置示例歌曲与歌词
