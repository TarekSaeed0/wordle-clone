import { useCallback, useMemo, useState } from "react";
import ToastContainer from "../components/ToastContainer";
import { ToastContext } from "../contexts/ToastContext";
import Toast from "../components/Toast";
import { DEFAULT_TOAST_DURATION } from "../constants/toast";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const newToast = {
      ...toast,
      id: crypto.randomUUID(),
      duration: toast.duration ?? DEFAULT_TOAST_DURATION,
    };

    setToasts((toasts) => [...toasts, newToast]);

    setTimeout(() => {
      setToasts((toasts) => toasts.filter((toast) => toast.id !== newToast.id));
    }, newToast.duration);
  }, []);

  const value = useMemo(() => ({ toasts, showToast }), [toasts, showToast]);

  return (
    <ToastContext.Provider value={value}>
      <ToastContainer toasts={toasts} />
      {children}
    </ToastContext.Provider>
  );
}
