use super::{
    models::{ImportLanguage, Language, LanguageOption, LanguageId, WordEntry},
    repository::LanguageRepository,
};
use anyhow::{Result, anyhow};
use async_trait::async_trait;
use std::collections::HashSet;

#[async_trait]
pub trait LanguageService: Sync + Send {
    async fn import_language(&self, language: &ImportLanguage) -> Result<()>;
    async fn get_language(&self, id: LanguageId) -> Result<Language>;
    async fn get_language_options(&self) -> Result<Vec<LanguageOption>>;
}

pub struct RepositoryLanguageService<LR>
where
    LR: LanguageRepository,
{
    language_repository: LR,
}

impl<LR> RepositoryLanguageService<LR>
where
    LR: LanguageRepository,
{
    pub fn new(language_repository: LR) -> Self {
        Self {
            language_repository,
        }
    }
}

#[async_trait]
impl<LR> LanguageService for RepositoryLanguageService<LR>
where
    LR: LanguageRepository,
{
    async fn import_language(&self, language: &ImportLanguage) -> Result<()> {
        if self.language_repository.exists_by_id(language.language.id).await? {
            return Err(anyhow!("Language already exists"));
        }

        let answers: HashSet<_> = language.answers.iter().collect();

        let words: Vec<_> = language
            .guesses
            .iter()
            .map(|w| WordEntry {
                word: w.clone(),
                is_answer: answers.contains(&w),
            })
            .collect();

        self.language_repository
            .save_with_words(&language.language, &words)
            .await
    }

    async fn get_language(&self, id: LanguageId) -> Result<Language> {
        self.language_repository
            .find_by_id(id)
            .await
            .and_then(|o| o.map_or_else(|| Err(anyhow!("Language not found")), Ok))
    }

    async fn get_language_options(&self) -> Result<Vec<LanguageOption>> {
        self.language_repository.find_all_options().await
    }
}
