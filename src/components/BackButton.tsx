import { useCallback } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router";

function BackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    if (location.key === "default") {
      navigate("/", { replace: true });
    } else {
      navigate(-1);
    }
  }, []);

  return (
    <button
      className="p-1 rounded-full cursor-pointer transition-colors duration-100 hover:bg-(--text-color)/15 hover:border-(--text-color) active:bg-(--text-color)/30 "
      onClick={handleBack}
    >
      <HiArrowLeft size={32} />
    </button>
  );
}

export default BackButton;
