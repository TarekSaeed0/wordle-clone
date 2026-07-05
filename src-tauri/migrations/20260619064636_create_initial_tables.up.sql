CREATE TABLE language (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('ltr', 'rtl')),
		letters TEXT NOT NULL,
		keyboard TEXT NOT NULL,
		normalizations TEXT NOT NULL
);

CREATE TABLE word (
    language_id TEXT NOT NULL,
    word TEXT NOT NULL,
    length INT GENERATED ALWAYS AS (LENGTH(word)),
    is_answer BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (language_id) REFERENCES language(id) ON DELETE CASCADE,
		PRIMARY KEY (language_id, word)
);

CREATE INDEX language_word_length ON word(language_id, length);
