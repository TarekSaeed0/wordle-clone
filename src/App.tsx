import "./App.css";
import { ToastProvider } from "./providers/ToastProvider";
import Header from "./components/Header";
import Game from "./components/Game";

function App() {
  return (
    <div className="h-screen pb-[env(safe-area-inset-bottom,0px)] flex flex-col bg-(--bg-color)">
      <ToastProvider>
        <Header />
        <Game />
      </ToastProvider>
    </div>
  );
}

export default App;
