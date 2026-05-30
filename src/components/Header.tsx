function Header() {
  return (
    <header className="flex-0 px-4 pt-[calc(env(safe-area-inset-top,0)+(--spacing(2)))] pb-2 flex items-center justify-center font-bold text-(--header-text-color) border-b border-(--header-border-color)">
      <h1 className="text-3xl">Wordle Clone</h1>
    </header>
  );
}

export default Header;
