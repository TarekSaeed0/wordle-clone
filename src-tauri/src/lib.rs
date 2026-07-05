use crate::{
    db::{seed_database, setup_database},
    language::{
        commands::{get_language, get_language_options},
        repository::{SqliteLanguageRepository},
        service::RepositoryLanguageService,
    },
};
use tauri::Manager;

pub mod db;
pub mod game;
pub mod language;

pub struct AppState {
    pub language_service: RepositoryLanguageService<SqliteLanguageRepository>,
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

                let language_repository = SqliteLanguageRepository::new(pool.clone());

                let language_service =
                    RepositoryLanguageService::new(language_repository);

                let state = AppState { language_service };

                seed_database(&state).await
                .expect("Failed to seed database");

                handle.manage(state);
            });
            Ok(())
        })
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_language, get_language_options])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
