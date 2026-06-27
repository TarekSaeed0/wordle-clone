use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::num::NonZeroU32;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum Key {
    Letter { width: NonZeroU32, letter: String },
    Enter { width: NonZeroU32 },
    Backspace { width: NonZeroU32 },
}

impl Key {
    pub fn width(&self) -> NonZeroU32 {
        match self {
            Key::Letter { width, .. } => *width,
            Key::Enter { width } => *width,
            Key::Backspace { width } => *width,
        }
    }

    pub fn letter(&self) -> Option<&str> {
        match self {
            Key::Letter { letter, .. } => Some(letter),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Keyboard(pub Vec<Vec<Key>>);

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
pub enum LanguageDirection {
    #[serde(rename = "ltr")]
    #[sqlx(rename = "ltr")]
    LeftToRight,
    #[serde(rename = "rtl")]
    #[sqlx(rename = "rtl")]
    RightToLeft,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Language {
    pub id: u64,
    pub name: String,
    pub direction: LanguageDirection,
    pub letters: Vec<String>,
    pub keyboard: Keyboard,
    pub normalizations: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateLanguage {
    pub name: String,
    pub direction: LanguageDirection,
    pub letters: Vec<String>,
    pub keyboard: Keyboard,
    pub normalizations: HashMap<String, String>,
    pub guesses: Vec<String>,
    pub answers: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LanguageSummary {
    pub id: u64,
    pub name: String,
    pub word_lengths: Vec<u32>,
}
