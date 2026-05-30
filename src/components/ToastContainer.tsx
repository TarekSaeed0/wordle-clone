import Toast from "./Toast";

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed top-14 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3.5 z-10">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

export default ToastContainer;
