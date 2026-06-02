import type { Toast } from "../types/toast";

function Toast({ toast }: { toast: Toast }) {
  return (
    <div
      className="w-max px-3.5 py-3 bg-(--toast-bg-color) text-(--toast-text-color) rounded text-sm font-bold animate-fade-out pointer-events-none select-none"
      style={{
        animationDuration: `${toast.duration}ms`,
      }}
    >
      {toast.message}
    </div>
  );
}

export default Toast;
