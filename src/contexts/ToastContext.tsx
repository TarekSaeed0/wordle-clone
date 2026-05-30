import { createContext } from "react";
import Toast from "../components/Toast";

type ToastContextValue = {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
