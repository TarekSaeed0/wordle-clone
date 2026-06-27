use super::models::{CreateLanguage, Keyboard, Language, LanguageDirection, LanguageSummary};
use anyhow::{Context, Result};
use sqlx::{query, query_scalar, types::Json, SqliteConnection};
use std::collections::{HashMap, HashSet};

pub async fn create_language(conn: &mut SqliteConnection, language: CreateLanguage) -> Result<()> {
    let language_id: i64 = query_scalar!(
        r#"
            INSERT INTO language (name, direction, letters, keyboard, normalizations)
            VALUES (?, ?, ?, ?, ?)
            RETURNING id
        "#,
        language.name,
        language.direction,
        Json(language.letters),
        Json(language.keyboard),
        Json(language.normalizations),
    )
    .fetch_one(&mut *conn)
    .await
    .with_context(|| format!("Failed to insert language {}", language.name))?;

    let answers: HashSet<_> = language.answers.into_iter().collect();

    for guess in language.guesses {
        let is_answer = answers.contains(&guess);

        query!(
            r#"
                INSERT INTO word (language_id, word, is_answer)
                VALUES (?, ?, ?)
            "#,
            language_id,
            guess,
            is_answer,
        )
        .execute(&mut *conn)
        .await
        .with_context(|| format!("Failed to insert word {}", guess))?;
    }

    Ok(())
}

pub async fn get_language(conn: &mut SqliteConnection, language_id: u64) -> Result<Language> {
    let language_row = query!(
        r#"
            SELECT 
            id, 
            name, direction AS "direction: LanguageDirection", 
            letters AS "letters: Json<Vec<String>>", 
            keyboard AS "keyboard: Json<Keyboard>", 
            normalizations AS "normalizations: Json<HashMap<String, String>>"
            FROM language
            WHERE id = ?
        "#,
        language_id as i64,
    )
    .fetch_one(&mut *conn)
    .await
    .with_context(|| format!("Failed to fetch language {}", language_id))?;

    let language = Language {
        id: language_row.id as u64,
        name: language_row.name,
        direction: language_row.direction,
        letters: language_row.letters.0,
        keyboard: language_row.keyboard.0,
        normalizations: language_row.normalizations.0,
    };

    Ok(language)
}

pub async fn get_language_summaries(conn: &mut SqliteConnection) -> Result<Vec<LanguageSummary>> {
    let languages_rows = query!(
        r#"
            SELECT id, name
            FROM language
        "#
    )
    .fetch_all(&mut *conn)
    .await
    .context("Failed to fetch languages")?;

    let mut language_summaries = Vec::new();

    for language_row in languages_rows {
        let word_lengths_rows = query!(
            r#"
                SELECT DISTINCT length
                FROM word
            WHERE language_id = ?
        "#,
            language_row.id,
        )
        .fetch_all(&mut *conn)
        .await
        .with_context(|| {
            format!(
                "Failed to fetch word lengths for language {}",
                language_row.id
            )
        })?;

        let word_lengths: Vec<u32> = word_lengths_rows
            .into_iter()
            .map(|r| r.length as u32)
            .collect();

        let language_summary = LanguageSummary {
            id: language_row.id as u64,
            name: language_row.name,
            word_lengths,
        };

        language_summaries.push(language_summary);
    }

    Ok(language_summaries)
}
