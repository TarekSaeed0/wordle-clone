use super::{
    models::{Language, LanguageId, LanguageOption},
    service::LanguageService,
};
use crate::AppState;
use anyhow::Result;
use tauri::State;

#[tauri::command]
pub async fn get_language(
    state: State<'_, AppState>,
    language_id: LanguageId,
) -> Result<Language, String> {
    state
        .language_service
        .get_language(language_id)
        .await
        .map_err(|e| {
            e.chain()
                .map(|e| e.to_string())
                .collect::<Vec<_>>()
                .join("\n")
        })
}

#[tauri::command]
pub async fn get_language_options(
    state: State<'_, AppState>,
) -> Result<Vec<LanguageOption>, String> {
    state
        .language_service
        .get_language_options()
        .await
        .map_err(|e| {
            e.chain()
                .map(|e| e.to_string())
                .collect::<Vec<_>>()
                .join("\n")
        })
}
