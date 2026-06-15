import { Heart } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState } from "../components/EmptyState";
import { SongList } from "../components/SongList";
import { useLibraryStore } from "../stores/libraryStore";
import { usePlayerStore } from "../stores/playerStore";
import { useUiStore } from "../stores/uiStore";

export function FavoritePage() {
  const songs = useLibraryStore((state) => state.songs);
  const updateSong = useLibraryStore((state) => state.updateSong);
  const showToast = useUiStore((state) => state.showToast);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const favorites = songs.filter((song) => song.liked);

  function clearFavorites() {
    const favoriteIds = new Set(favorites.map((song) => song.id));
    favorites.forEach((song) => updateSong(song.id, { liked: false }));
    usePlayerStore.setState((state) => ({
      currentSong: state.currentSong && favoriteIds.has(state.currentSong.id)
        ? { ...state.currentSong, liked: false }
        : state.currentSong,
      playlist: state.playlist.map((song) =>
        favoriteIds.has(song.id) ? { ...song, liked: false } : song
      ),
    }));
    setConfirmOpen(false);
    showToast("已清空喜欢列表", "success");
  }

  return (
    <main className="library-page page-enter">
      <header className="page-header">
        <div>
          <span className="eyebrow">FAVORITES</span>
          <h1>喜欢</h1>
          <p>{favorites.length} 首歌曲 · 收藏在此设备上</p>
        </div>
        {favorites.length > 0 && (
          <button className="secondary-button" onClick={() => setConfirmOpen(true)}>
            清空喜欢
          </button>
        )}
      </header>
      {favorites.length > 0 ? (
        <SongList songs={favorites} />
      ) : (
        <EmptyState
          icon={Heart}
          title="还没有喜欢的歌曲"
          description="点击歌曲菜单或爱心按钮，将歌曲加入喜欢列表。"
        />
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="确认清空喜欢列表？"
        description="歌曲仍会保留在音乐库中，只会移除所有喜欢标记。"
        confirmLabel="确认清空"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={clearFavorites}
      />
    </main>
  );
}
