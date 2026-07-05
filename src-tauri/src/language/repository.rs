use super::models::{
    Keyboard, Language, LanguageDirection, LanguageId, LanguageOption, Letter, Word, WordEntry,
};
use anyhow::{Context, Result};
use async_trait::async_trait;
use sqlx::{SqlitePool, query, query_as, query_scalar, types::Json};
use std::{collections::HashMap, num::NonZeroU32};

#[async_trait]
pub trait LanguageRepository: Sync + Send {
    async fn save_with_words(&self, language: &Language, words: &[WordEntry]) -> Result<()>;
    async fn find_by_id(&self, id: LanguageId) -> Result<Option<Language>>;
    async fn exists_by_id(&self, id: LanguageId) -> Result<bool>;
    async fn find_all_options(&self) -> Result<Vec<LanguageOption>>;
}

#[async_trait]
pub trait WordRepository: Sync + Send {
    async fn exists_by_word(&self, language_id: LanguageId, word: &Word) -> Result<bool>;
    async fn find_random_answer(&self, language_id: LanguageId) -> Result<WordEntry>;
}

pub struct SqliteLanguageRepository {
    pool: SqlitePool,
}

impl SqliteLanguageRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl LanguageRepository for SqliteLanguageRepository {
    async fn save_with_words(&self, language: &Language, words: &[WordEntry]) -> Result<()> {
        let mut tx = self.pool.begin().await?;

        query!(
            r#"
                INSERT INTO language (id, name, direction, letters, keyboard, normalizations)
                VALUES (?, ?, ?, ?, ?, ?)
            "#,
            language.id,
            language.name,
            language.direction,
            Json(&language.letters),
            Json(&language.keyboard),
            Json(&language.normalizations),
        )
        .execute(&mut *tx)
        .await
        .with_context(|| format!("Failed to insert language {}", language.name))?;

        for word in words {
            query!(
                r#"
                    INSERT INTO word (language_id, word, is_answer)
                    VALUES (?, ?, ?)
                "#,
                language.id,
                word.word,
                word.is_answer,
            )
            .execute(&mut *tx)
            .await
            .with_context(|| {
                format!(
                    "Failed to insert word {} for language {}",
                    word.word, language.id
                )
            })?;
        }

        tx.commit().await?;

        Ok(())
    }

    async fn find_by_id(&self, id: LanguageId) -> Result<Option<Language>> {
        let row = query!(
            r#"
                SELECT 
                id AS "id: LanguageId", 
                name, 
                direction AS "direction: LanguageDirection", 
                letters AS "letters: Json<Vec<Letter>>", 
                keyboard AS "keyboard: Json<Keyboard>", 
                normalizations AS "normalizations: Json<HashMap<Letter, Letter>>"
                FROM language
                WHERE id = ?
            "#,
            id,
        )
        .fetch_optional(&self.pool)
        .await
        .with_context(|| format!("Failed to fetch language {}", id))?;

        let language = row.map(|r| Language {
            id: r.id,
            name: r.name,
            direction: r.direction,
            letters: r.letters.0,
            keyboard: r.keyboard.0,
            normalizations: r.normalizations.0,
        });

        Ok(language)
    }

    async fn exists_by_id(&self, id: LanguageId) -> Result<bool> {
        let exists = query_scalar!(
            r#"
                SELECT TRUE
                FROM language
                WHERE id = ?
            "#,
            id,
        )
        .fetch_optional(&self.pool)
        .await
        .with_context(|| format!("Failed to fetch language {}", id))?;

        Ok(exists.is_some())
    }

    async fn find_all_options(&self) -> Result<Vec<LanguageOption>> {
        let rows = query!(
            r#"
                SELECT 
                l.id AS "id: LanguageId", 
                l.name,
                COALESCE(
                    json_group_array(DISTINCT w.length),
                    '[]'
                ) AS "word_lengths: Json<Vec<NonZeroU32>>"
                FROM language AS l
                LEFT JOIN word AS w
                ON l.id = w.language_id
                GROUP BY l.id
            "#
        )
        .fetch_all(&self.pool)
        .await
        .context("Failed to fetch language options")?;

        let options = rows
            .into_iter()
            .map(|r| LanguageOption {
                id: r.id,
                name: r.name,
                word_lengths: r.word_lengths.0,
            })
            .collect();

        Ok(options)
    }
}

pub struct SqliteWordRepository {
    pool: SqlitePool,
}

impl SqliteWordRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl WordRepository for SqliteWordRepository {
    async fn exists_by_word(&self, language_id: LanguageId, word: &Word) -> Result<bool> {
        let exists = query_scalar!(
            r#"
                SELECT TRUE
                FROM word
                WHERE language_id = ?
                AND word = ?
            "#,
            language_id,
            word,
        )
        .fetch_optional(&self.pool)
        .await
        .with_context(|| format!("Failed to fetch word for language {}", language_id))?;

        Ok(exists.is_some())
    }

    async fn find_random_answer(&self, language_id: LanguageId) -> Result<WordEntry> {
        let answer = query_as!(
            WordEntry,
            r#"
                SELECT 
                word AS "word: Word",
                is_answer
                FROM word
                WHERE language_id = ? AND is_answer = TRUE
                ORDER BY RANDOM()
                LIMIT 1
            "#,
            language_id
        )
        .fetch_one(&self.pool)
        .await
        .with_context(|| format!("Failed to fetch random answer for language {}", language_id))?;

        Ok(answer)
    }
}
