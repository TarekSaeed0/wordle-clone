use crate::{
    db::{seed_database, setup_database},
    language::commands::{get_language, get_language_summaries},
};
use tauri::Manager;

pub mod db;
pub mod game;
pub mod language;

pub struct AppState {
    pub pool: sqlx::SqlitePool,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();

            tauri::async_runtime::block_on(async move {
                let pool = setup_database(handle)
                    .await
                    .expect("Failed to set up database");

                seed_database(&pool).await.expect("Failed to seed database");

                let state = AppState { pool };

                handle.manage(state);
            });
            Ok(())
        })
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_language,
            get_language_summaries
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
