function FunctionKey({
  width,
  onClick,
  children,
}: {
  width: number;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`px-3 py-2 rounded h-14 flex items-center justify-center text-sm font-semibold cursor-pointer transition-colors duration-100 bg-(--key-bg-color) text-(--key-text-color) hover:bg-(--key-bg-color)/80 active:bg-(--key-bg-color)/60 select-none`}
      style={{ gridColumn: `span ${width}` }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default FunctionKey;
