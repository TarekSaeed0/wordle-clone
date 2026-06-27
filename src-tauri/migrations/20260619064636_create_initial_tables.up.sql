CREATE TABLE language (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('ltr', 'rtl')),
		letters TEXT NOT NULL,
		keyboard TEXT NOT NULL,
		normalizations TEXT NOT NULL
);

CREATE TABLE word (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
    language_id BIGINT NOT NULL,
    word TEXT NOT NULL,
    length INT GENERATED ALWAYS AS (LENGTH(word)),
    is_answer BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (language_id) REFERENCES language(id) ON DELETE CASCADE
);

CREATE INDEX language_word_length ON word(language_id, length);

CREATE UNIQUE INDEX language_word ON word(language_id, word);
