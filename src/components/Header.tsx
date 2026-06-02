import { HiMenu } from "react-icons/hi";

function Header() {
  return (
    <header className="flex-0 p-2 pt-[calc(env(safe-area-inset-top,0)+(--spacing(2)))] flex items-center justify-between font-bold text-(--text-color) border-b border-(--border-color)">
      <button className="p-1 rounded-full cursor-pointer transition-colors duration-100 hover:bg-(--text-color)/15 hover:border-(--text-color) active:bg-(--text-color)/30 ">
        <HiMenu size={32} />
      </button>
      <h1 className="absolute left-0 right-0 text-center text-3xl select-none pointer-events-none">
        Wordle
      </h1>
    </header>
  );
}

export default Header;
