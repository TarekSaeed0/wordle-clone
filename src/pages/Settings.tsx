import { Link } from "react-router";
import { useHeader } from "../hooks/useHeader";
import { HiArrowLeft } from "react-icons/hi";

function Settings() {
  useHeader({
    title: "Settings",
    leftContent: (
      <button className="p-1 rounded-full cursor-pointer transition-colors duration-100 hover:bg-(--text-color)/15 hover:border-(--text-color) active:bg-(--text-color)/30 ">
        <Link to="/">
          <HiArrowLeft size={32} />
        </Link>
      </button>
    ),
  });

  return <p>Settings</p>;
}

export default Settings;
