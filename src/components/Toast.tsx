import type { Toast } from "../types/toast";
import { motion } from "motion/react";

function Toast({ toast }: { toast: Toast }) {
  return (
    <motion.div
      className="w-max px-3.5 py-3 bg-(--toast-bg-color) text-(--toast-text-color) rounded text-sm font-bold pointer-events-none select-none"
      animate={{ opacity: [1, 1, 0] }}
      transition={{
        duration: toast.duration,
        times: [0, 0.8, 1],
        ease: "easeInOut",
      }}
    >
      {toast.message}
    </motion.div>
  );
}

export default Toast;
