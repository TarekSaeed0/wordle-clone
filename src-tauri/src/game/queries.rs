use anyhow::{Context, Result};
use sqlx::{query_scalar, SqliteConnection};

pub async fn validate_guess(
    conn: &mut SqliteConnection,
    language_id: u64,
    guess: String,
) -> Result<bool> {
    let valid = query_scalar!(
        r#"
        SELECT TRUE
        FROM word
        WHERE language_id = ?
        AND word = ?
    "#,
        language_id as i64,
        guess,
    )
    .fetch_optional(conn)
    .await
    .with_context(|| format!("Failed to fetch word for language {}", language_id))?;

    Ok(valid.is_some())
}

pub async fn generate_answer(conn: &mut SqliteConnection, language_id: u64) -> Result<String> {
    let answer = query_scalar!(
        r#"
        SELECT word
        FROM word
        WHERE language_id = ? AND is_answer = TRUE
        ORDER BY RANDOM()
        LIMIT 1
    "#,
        language_id as i64
    )
    .fetch_one(conn)
    .await
    .with_context(|| format!("Failed to fetch random answer for language {}", language_id))?;

    Ok(answer)
}
