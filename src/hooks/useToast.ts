import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext";

export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return toast;
}
