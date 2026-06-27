use crate::language::{models::CreateLanguage, queries::create_language};
use anyhow::{Context, Result};
use sqlx::{sqlite::SqliteConnectOptions, SqlitePool};
use tauri::{AppHandle, Manager};

pub async fn setup_database(app_handle: &AppHandle) -> Result<SqlitePool> {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .context("Failed to get app data directory")?;

    std::fs::create_dir_all(&app_dir).context("Failed to create app data directory")?;

    let db_path = app_dir.join("app.db");

    let options = SqliteConnectOptions::new()
        .filename(&db_path)
        .create_if_missing(true);

    let pool = SqlitePool::connect_with(options)
        .await
        .context("Failed to connect to database")?;

    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .context("Failed to run migrations")?;

    Ok(pool)
}

pub async fn seed_database(pool: &SqlitePool) -> Result<()> {
    let count: i64 = sqlx::query_scalar!("SELECT COUNT(*) FROM language")
        .fetch_one(pool)
        .await
        .context("Failed to count languages")?;

    if count > 0 {
        return Ok(());
    }

    let languages_json = [
        include_str!("../assets/languages/english.json"),
        include_str!("../assets/languages/arabic.json"),
    ];

    let languages: Vec<CreateLanguage> = languages_json
        .iter()
        .map(|json| serde_json::from_str(json).context("Failed to parse language JSON"))
        .collect::<Result<_>>()?;

    let mut tx = pool.begin().await?;

    for language in languages {
        create_language(&mut tx, language).await?;
    }

    tx.commit().await.context("Failed to commit transaction")?;

    Ok(())
}
