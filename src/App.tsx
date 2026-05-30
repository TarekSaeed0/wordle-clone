import "./App.css";
import { ToastProvider } from "./providers/ToastProvider";
import Header from "./components/Header";
import Game from "./components/Game";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-(--bg-color)">
      <ToastProvider>
        <Header />
        <main className="flex-1 flex flex-col items-center px-2">
          <Game />
        </main>
      </ToastProvider>
    </div>
  );
}

export default App;
