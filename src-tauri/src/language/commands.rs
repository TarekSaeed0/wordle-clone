use super::{
    models::{Language, LanguageSummary},
    queries,
};
use crate::AppState;
use anyhow::Result;
use tauri::State;

#[tauri::command]
pub async fn get_language(
    state: State<'_, AppState>,
    language_id: u64,
) -> Result<Language, String> {
    let pool = &state.pool;
    let conn = &mut pool.acquire().await.map_err(|e| e.to_string())?;

    queries::get_language(conn, language_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_language_summaries(
    state: State<'_, AppState>,
) -> Result<Vec<LanguageSummary>, String> {
    let pool = &state.pool;
    let conn = &mut pool.acquire().await.map_err(|e| e.to_string())?;

    queries::get_language_summaries(conn)
        .await
        .map_err(|e| e.to_string())
}
