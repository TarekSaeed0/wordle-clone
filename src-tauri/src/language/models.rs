use anyhow::{anyhow, Error};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fmt::{self, Display, Formatter};
use std::num::NonZeroU32;
use std::ops::Deref;

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, sqlx::Type)]
#[serde(try_from = "String")]
#[sqlx(transparent)]
pub struct Letter(String);

impl Letter {
    pub fn new(value: String) -> Result<Self, Error> {
        Self::try_from(value)
    }

    pub fn as_str(&self) -> &str {
        self.as_ref()
    }

    pub fn into_string(self) -> String {
        self.into()
    }
}

impl TryFrom<String> for Letter {
    type Error = Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        if value.contains(char::is_whitespace) {
            return Err(anyhow!("Letter can't contain whitespace"));
        }

        if value.is_empty() {
            return Err(anyhow!("Letter can't be empty"));
        }

        Ok(Self(value))
    }
}

impl From<Letter> for String {
    fn from(value: Letter) -> Self {
        value.0
    }
}

impl AsRef<str> for Letter {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

impl Deref for Letter {
    type Target = str;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl Display for Letter {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, sqlx::Type)]
#[serde(try_from = "String")]
#[sqlx(transparent)]
pub struct Word(String);

impl Word {
    pub fn new(value: String) -> Result<Self, Error> {
        Self::try_from(value)
    }

    pub fn as_str(&self) -> &str {
        self.as_ref()
    }

    pub fn into_string(self) -> String {
        self.into()
    }
}

impl TryFrom<String> for Word {
    type Error = Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        if value.contains(char::is_whitespace) {
            return Err(anyhow!("Word can't contain whitespace"));
        }

        if value.is_empty() {
            return Err(anyhow!("Word can't be empty"));
        }

        Ok(Self(value))
    }
}

impl From<Word> for String {
    fn from(value: Word) -> Self {
        value.0
    }
}

impl AsRef<str> for Word {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

impl Deref for Word {
    type Target = str;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl Display for Word {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

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
    pub letters: Vec<Letter>,
    pub keyboard: Keyboard,
    pub normalizations: HashMap<Letter, Letter>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateLanguage {
    pub name: String,
    pub direction: LanguageDirection,
    pub letters: Vec<Letter>,
    pub keyboard: Keyboard,
    pub normalizations: HashMap<Letter, Letter>,
    pub guesses: Vec<Word>,
    pub answers: Vec<Word>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LanguageSummary {
    pub id: u64,
    pub name: String,
    pub word_lengths: Vec<NonZeroU32>,
}
