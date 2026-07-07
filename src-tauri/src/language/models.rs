use anyhow::{Error, Result, anyhow};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fmt::{self, Display, Formatter};
use std::num::{NonZeroU32, NonZeroUsize};
use uuid::Uuid;

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, sqlx::Type)]
#[serde(try_from = "String")]
#[sqlx(transparent)]
pub struct Letter(String);

impl Letter {
    pub fn new(value: String) -> Result<Self, Error> {
        Self::try_from(value)
    }

    /// # Safety
    ///
    /// `value` must be a valid letter.
    #[must_use]
    pub unsafe fn new_unchecked(value: String) -> Self {
        Self(value)
    }

    #[must_use]
    pub fn as_str(&self) -> &str {
        self.as_ref()
    }

    #[must_use]
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

    /// # Safety
    ///
    /// `value` must be a valid word.
    #[must_use]
    pub unsafe fn new_unchecked(value: String) -> Self {
        Self(value)
    }

    #[must_use]
    pub fn as_str(&self) -> &str {
        self.as_ref()
    }

    #[must_use]
    pub fn into_string(self) -> String {
        self.into()
    }

    #[must_use]
    pub fn len(&self) -> NonZeroUsize {
        unsafe { NonZeroUsize::new_unchecked(self.0.chars().count()) }
    }

    pub fn letters(&self) -> impl Iterator<Item = Letter> + use<'_> {
        self.0
            .chars()
            .map(|c| unsafe { Letter::new_unchecked(String::from(c)) })
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

impl Display for Word {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

// TODO: think of a better name for this,
// maybe change the Word struct name as well
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WordEntry {
    pub word: Word,
    pub is_answer: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum Key {
    Letter { width: NonZeroU32, letter: Letter },
    Enter { width: NonZeroU32 },
    Backspace { width: NonZeroU32 },
}

impl Key {
    #[must_use]
    pub fn width(&self) -> NonZeroU32 {
        match self {
            Key::Letter { width, .. } => *width,
            Key::Enter { width } => *width,
            Key::Backspace { width } => *width,
        }
    }

    #[must_use]
    pub fn letter(&self) -> Option<&Letter> {
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

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, sqlx::Type)]
#[serde(transparent)]
#[sqlx(transparent)]
pub struct LanguageId(Uuid);

impl LanguageId {
    #[must_use]
    pub fn new() -> LanguageId {
        Self::default()
    }
}

impl Default for LanguageId {
    fn default() -> Self {
        Self(Uuid::new_v4())
    }
}

impl Display for LanguageId {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Language {
    pub id: LanguageId,
    pub name: String,
    pub direction: LanguageDirection,
    pub letters: Vec<Letter>,
    pub keyboard: Keyboard,
    pub normalizations: HashMap<Letter, Letter>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImportLanguage {
    #[serde(flatten)]
    pub language: Language,
    pub guesses: Vec<Word>,
    pub answers: Vec<Word>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LanguageOption {
    pub id: LanguageId,
    pub name: String,
    pub word_lengths: Vec<NonZeroU32>,
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::assert_matches;

    mod letter {
        use super::*;

        mod try_from {
            use super::*;

            #[test]
            fn returns_error_given_string_with_whitespace() {
                let test_cases: [&str; _] = [" ", "A ", "A\n"];

                for letter in test_cases {
                    assert_matches!(Letter::try_from(letter.to_string()), Err(_));
                }
            }

            #[test]
            fn returns_error_given_empty_string() {
                assert_matches!(Letter::try_from("".to_string()), Err(_));
            }

            #[test]
            fn returns_ok_given_valid_string() {
                let test_cases: [&str; _] = ["A", "ß", "ج"];

                for letter in test_cases {
                    assert_matches!(Letter::try_from(letter.to_string()), Ok(Letter(_)));
                }
            }
        }
    }

    mod word {
        use super::*;

        mod try_from {
            use super::*;

            #[test]
            fn returns_error_given_string_with_whitespace() {
                let test_cases: [String; _] = [
                    " ".to_string(),
                    "Ice Cream".to_string(),
                    "Electric\nKettle".to_string(),
                ];

                for string in test_cases {
                    assert_matches!(Word::try_from(string), Err(_));
                }
            }

            #[test]
            fn returns_error_given_empty_string() {
                let string = "".to_string();

                assert_matches!(Word::try_from(string), Err(_));
            }

            #[test]
            fn returns_ok_given_valid_string() {
                let test_cases: [String; _] = [
                    "Apple".to_string(),
                    "Shlüssel".to_string(),
                    "مروحة".to_string(),
                ];

                for string in test_cases {
                    assert_matches!(Word::try_from(string), Ok(Word(_)));
                }
            }
        }

        mod len {
            use super::*;

            #[test]
            fn returns_the_number_of_letters() {
                let test_cases: [(Word, NonZeroUsize); _] = [
                    (
                        Word::new("Apple".to_string()).unwrap(),
                        NonZeroUsize::new(5).unwrap(),
                    ),
                    (
                        Word::new("Shlüssel".to_string()).unwrap(),
                        NonZeroUsize::new(8).unwrap(),
                    ),
                    (
                        Word::new("مروحة".to_string()).unwrap(),
                        NonZeroUsize::new(5).unwrap(),
                    ),
                ];

                for (word, expected_len) in test_cases {
                    assert_eq!(word.len(), expected_len);
                }
            }
        }

        mod letters {
            use super::*;

            #[test]
            fn returns_iterator_over_all_letters() {
                let test_cases: [(Word, Vec<Letter>); _] = [
                    (
                        Word::new("Apple".to_string()).unwrap(),
                        vec![
                            Letter::new("A".to_string()).unwrap(),
                            Letter::new("p".to_string()).unwrap(),
                            Letter::new("p".to_string()).unwrap(),
                            Letter::new("l".to_string()).unwrap(),
                            Letter::new("e".to_string()).unwrap(),
                        ],
                    ),
                    (
                        Word::new("Shlüssel".to_string()).unwrap(),
                        vec![
                            Letter::new("S".to_string()).unwrap(),
                            Letter::new("h".to_string()).unwrap(),
                            Letter::new("l".to_string()).unwrap(),
                            Letter::new("ü".to_string()).unwrap(),
                            Letter::new("s".to_string()).unwrap(),
                            Letter::new("s".to_string()).unwrap(),
                            Letter::new("e".to_string()).unwrap(),
                            Letter::new("l".to_string()).unwrap(),
                        ],
                    ),
                    (
                        Word::new("مروحة".to_string()).unwrap(),
                        vec![
                            Letter::new("م".to_string()).unwrap(),
                            Letter::new("ر".to_string()).unwrap(),
                            Letter::new("و".to_string()).unwrap(),
                            Letter::new("ح".to_string()).unwrap(),
                            Letter::new("ة".to_string()).unwrap(),
                        ],
                    ),
                ];

                for (word, expected_letters) in test_cases {
                    assert_eq!(
                        Word::new(word.to_string())
                            .unwrap()
                            .letters()
                            .collect::<Vec<_>>(),
                        expected_letters
                    );
                }
            }
        }
    }

    mod key {
        use super::*;

        mod width {
            use super::*;

            #[test]
            fn returns_width() {
                let test_cases: [(Key, NonZeroU32); _] = [
                    (
                        Key::Letter {
                            width: NonZeroU32::new(4).unwrap(),
                            letter: Letter::new("A".to_string()).unwrap(),
                        },
                        NonZeroU32::new(4).unwrap(),
                    ),
                    (
                        Key::Enter {
                            width: NonZeroU32::new(5).unwrap(),
                        },
                        NonZeroU32::new(5).unwrap(),
                    ),
                    (
                        Key::Backspace {
                            width: NonZeroU32::new(6).unwrap(),
                        },
                        NonZeroU32::new(6).unwrap(),
                    ),
                ];

                for (key, expected_width) in test_cases {
                    assert_eq!(key.width(), expected_width);
                }
            }
        }

        mod letter {
            use super::*;

            #[test]
            fn returns_some_given_letter_key() {
                let key = Key::Letter {
                    width: NonZeroU32::new(4).unwrap(),
                    letter: Letter::new("A".to_string()).unwrap(),
                };

                assert_matches!(key.letter(), Some(_));
            }

            #[test]
            fn returns_none_given_non_letter_key() {
                let test_cases: [Key; _] = [
                    Key::Enter {
                        width: NonZeroU32::new(5).unwrap(),
                    },
                    Key::Backspace {
                        width: NonZeroU32::new(5).unwrap(),
                    },
                ];

                for key in test_cases {
                    assert_matches!(key.letter(), None);
                }
            }
        }
    }
}
