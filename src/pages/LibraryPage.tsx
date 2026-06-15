import { FolderOpen, Music, Plus } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import { SongList } from "../components/SongList";
import {
  chooseAudioFiles,
  chooseMusicFolder,
  type SongReadyHandler,
} from "../services/libraryService";
import { useLibraryStore } from "../stores/libraryStore";
import { useUiStore } from "../stores/uiStore";
import type { Song } from "../types/music";

export function LibraryPage() {
  const library = useLibraryStore();
  const showToast = useUiStore((state) => state.showToast);

  function importErrorMessage(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("invoke")) {
      return "系统文件选择器暂不可用。浏览器预览请刷新页面；桌面版请使用 npm run tauri:dev 启动。";
    }
    return message || "导入失败，请重试。";
  }

  async function importWith(
    loader: (onSongReady?: SongReadyHandler) => Promise<Song[]>,
  ) {
    library.setImporting(true);
    library.setError(null);
    try {
      let importedCount = 0;
      const songs = await loader((song) => {
        const known = useLibraryStore.getState().songs.some(
          (item) => item.path === song.path,
        );
        if (known) return;
        useLibraryStore.getState().addSongs([song]);
        importedCount += 1;
      });
      if (songs.length === 0) return;
      if (importedCount > 0) {
        showToast(`已导入 ${importedCount} 首歌曲`, "success");
      } else {
        showToast("所选歌曲已经在音乐库中", "info");
      }
    } catch (error) {
      const message = importErrorMessage(error);
      library.setError(message);
      showToast(message, "error");
    } finally {
      library.setImporting(false);
    }
  }

  return (
    <main className="library-page page-enter">
      <header className="page-header">
        <div>
          <span className="eyebrow">LOCAL COLLECTION</span>
          <h1>音乐库</h1>
          <p>{library.songs.length} 首歌曲 · 保留在你的设备上</p>
        </div>
        <div className="page-actions">
          <button
            className="secondary-button"
            onClick={() => void importWith(chooseMusicFolder)}
            disabled={library.isImporting}
          >
            <FolderOpen />
            导入文件夹
          </button>
          <button
            className="primary-button"
            onClick={() => void importWith(chooseAudioFiles)}
            disabled={library.isImporting}
          >
            <Plus />
            添加音乐
          </button>
        </div>
      </header>

      {library.error && <div className="notice notice--error">{library.error}</div>}
      {library.isImporting && (
        <div className="library-loading">
          <span className="spinner" />
          <span>正在扫描并整理本地音乐…</span>
        </div>
      )}

      {library.songs.length > 0 ? (
        <SongList songs={library.songs} />
      ) : (
        <EmptyState
          icon={Music}
          title={library.isImporting ? "正在读取音乐…" : "把你的音乐放进来"}
          description="支持 MP3、FLAC、WAV 与 M4A，本地播放，不上传。"
          action={!library.isImporting && (
            <button className="primary-button" onClick={() => void importWith(chooseAudioFiles)}>
              <Plus />
              选择音乐文件
            </button>
          )}
        />
      )}
    </main>
  );
}
