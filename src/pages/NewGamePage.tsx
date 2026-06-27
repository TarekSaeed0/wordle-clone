import { useNavigate } from "react-router";
import { useHeader } from "../hooks/useHeader";
import { useCallback, useEffect, useState } from "react";
import { LanguageSummary } from "../types/language";
import SettingsButton from "../components/SettingsButton";
import { invoke } from "@tauri-apps/api/core";

function NewGamePage() {
  useHeader({
    title: "New Game",
    rightContent: <SettingsButton />,
  });

  const [languages, setLanguages] = useState<LanguageSummary[]>([]);

  useEffect(() => {
    invoke("get_language_summaries").then((languages) => {
      setLanguages(languages as LanguageSummary[]);
    });
  }, []);

  const [languageId, setLanguageId] = useState<number>();
  const [wordLength, setWordLength] = useState<number>();
  const [maximumGuesses, setMaximumGuesses] = useState<number>(6);

  useEffect(() => {
    if (languages.length > 0) {
      setLanguageId(languages[0].id);
    }
  }, [languages]);

  useEffect(() => {
    const language = languages.find((language) => language.id === languageId);
    if (language && language.wordLengths.length > 0) {
      setWordLength(language.wordLengths[0]);
    }
  }, [languageId]);

  const navigate = useNavigate();

  const handleStart = useCallback(() => {
    navigate("/game", {
      state: { languageId, wordLength, maximumGuesses },
    });
  }, [languageId, wordLength, maximumGuesses]);

  return (
    <div className="size-full flex flex-col items-center justify-center">
      <div className="px-6 py-4 flex flex-col items-center justify-center gap-4 rounded-lg">
        {languages.length > 0 ? (
          <>
            <div className="grid grid-cols-[repeat(2,auto)] items-center justify-center gap-x-4 gap-y-2">
              <span className="font-bold">Language</span>
              <select
                value={languageId}
                onChange={(event) => {
                  setLanguageId(parseInt(event.target.value, 10));
                }}
              >
                {languages.map((language) => (
                  <option key={language.id} value={language.id}>
                    {language.name}
                  </option>
                ))}
              </select>

              <span className="font-bold">Word Length</span>
              <select
                value={wordLength}
                onChange={(event) => {
                  setWordLength(parseInt(event.target.value, 10));
                }}
              >
                {languages
                  .find((language) => language.id === languageId)
                  ?.wordLengths.map((wordLength) => (
                    <option key={wordLength} value={wordLength}>
                      {wordLength}
                    </option>
                  ))}
              </select>

              <span className="font-bold">Maximum Guesses</span>
              <input
                type="number"
                className="px-4 py-2 rounded border border-(--border-color)"
                min={1}
                max={10}
                value={maximumGuesses ?? ""}
                onChange={(event) => {
                  setMaximumGuesses(parseInt(event.target.value, 10));
                }}
              />
            </div>

            <button
              className="px-6 py-3 rounded-full flex items-center justify-center font-semibold cursor-pointer transition-colors duration-100 bg-(--correct-color) text-(--key-evaluated-text-color) hover:bg-(--correct-color)/80 active:bg-(--correct-color)/60 select-none"
              onClick={handleStart}
            >
              Start Game
            </button>
          </>
        ) : (
          <p>There aren't any languages installed</p>
        )}
      </div>
    </div>
  );
}

export default NewGamePage;
