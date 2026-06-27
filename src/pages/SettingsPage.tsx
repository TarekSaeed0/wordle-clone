import { useHeader } from "../hooks/useHeader";
import BackButton from "../components/BackButton";

function SettingsPage() {
  useHeader({
    title: "Settings",
    leftContent: <BackButton />,
  });

  return <p>Settings</p>;
}

export default SettingsPage;
