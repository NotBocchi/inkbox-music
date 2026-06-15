#[tauri::command]
fn reveal_in_file_manager(path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    std::process::Command::new("explorer")
        .args(["/select,", &path])
        .spawn()
        .map_err(|error| error.to_string())?;

    #[cfg(target_os = "macos")]
    std::process::Command::new("open")
        .args(["-R", &path])
        .spawn()
        .map_err(|error| error.to_string())?;

    #[cfg(target_os = "linux")]
    std::process::Command::new("xdg-open")
        .arg(
            std::path::Path::new(&path)
                .parent()
                .unwrap_or(std::path::Path::new(&path)),
        )
        .spawn()
        .map_err(|error| error.to_string())?;

    Ok(())
}

#[tauri::command]
fn open_external(url: String) -> Result<(), String> {
    if !url.starts_with("https://") && !url.starts_with("http://") {
        return Err("Only HTTP and HTTPS links are allowed".into());
    }

    #[cfg(target_os = "windows")]
    std::process::Command::new("cmd")
        .args(["/C", "start", "", &url])
        .spawn()
        .map_err(|error| error.to_string())?;

    #[cfg(target_os = "macos")]
    std::process::Command::new("open")
        .arg(&url)
        .spawn()
        .map_err(|error| error.to_string())?;

    #[cfg(target_os = "linux")]
    std::process::Command::new("xdg-open")
        .arg(&url)
        .spawn()
        .map_err(|error| error.to_string())?;

    Ok(())
}

#[tauri::command]
fn read_audio_file(path: String) -> Result<tauri::ipc::Response, String> {
    let bytes = std::fs::read(&path).map_err(|error| {
        format!(
            "Failed to read audio file '{}': {}",
            std::path::Path::new(&path)
                .file_name()
                .and_then(|name| name.to_str())
                .unwrap_or("unknown"),
            error
        )
    })?;
    Ok(tauri::ipc::Response::new(bytes))
}

#[tauri::command]
fn read_text_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(path).map_err(|error| error.to_string())
}

#[tauri::command]
fn get_example_song_paths(app: tauri::AppHandle) -> Result<ExampleSongPaths, String> {
    let directory = app
        .path()
        .resource_dir()
        .map_err(|error| error.to_string())?
        .join("example_song");
    let audio_path = directory.join("Don Toliver - After Party.mp3");
    let lyric_path = directory.join("Don Toliver - After Party.lrc");

    if !audio_path.is_file() || !lyric_path.is_file() {
        return Err("Bundled example song resources are missing".into());
    }

    Ok(ExampleSongPaths {
        audio_path: audio_path.to_string_lossy().into_owned(),
        lyric_path: lyric_path.to_string_lossy().into_owned(),
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            reveal_in_file_manager,
            open_external,
            read_audio_file,
            read_text_file,
            get_example_song_paths
        ])
        .run(tauri::generate_context!())
        .expect("error while running Inkbox Music");
}
use tauri::Manager;

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct ExampleSongPaths {
    audio_path: String,
    lyric_path: String,
}
