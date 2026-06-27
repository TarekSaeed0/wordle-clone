import { useEffect, useState } from "react";
import { useHeader } from "../hooks/useHeader";
import { useLocation } from "react-router";
import SettingsButton from "../components/SettingsButton";
import { Language } from "../types/language";
import { invoke } from "@tauri-apps/api/core";
import Game from "../components/Game";

const WIN_MESSAGES = [
  "Genius",
  "Magnificent",
  "Impressive",
  "Splendid",
  "Great",
  "Phew",
];

function GamePage() {
  useHeader({
    title: "Wordle",
    rightContent: <SettingsButton />,
  });

  const location = useLocation();

  const languageId = location.state.languageId;

  const [language, setLanguage] = useState<Language | null>(null);

  useEffect(() => {
    invoke("get_language", { language_id: languageId }).then((language) => {
      setLanguage(language as Language);
    });
  }, [languageId]);

  if (!language) {
    return <p>Loading...</p>;
  }

  const options = {
    language,
    wordLength: location.state.wordLength,
    maximumGuesses: location.state.maximumGuesses,
  };

  return <Game options={options} />;
}

export default GamePage;
