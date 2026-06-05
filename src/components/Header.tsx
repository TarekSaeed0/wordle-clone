import { HeaderConfiguration } from "../types/header";

function Header({ configuration }: { configuration: HeaderConfiguration }) {
  return (
    <header className="flex-0 p-2 pt-[calc(env(safe-area-inset-top,0)+(--spacing(2)))] flex items-center justify-between font-bold border-b border-(--border-color)">
      <div>{configuration.leftContent}</div>
      <h1 className="absolute left-0 right-0 text-center text-3xl select-none pointer-events-none">
        {configuration.title}
      </h1>
      <div>{configuration.rightContent}</div>
    </header>
  );
}

export default Header;
