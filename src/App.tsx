import "./App.css";
import { ToastProvider } from "./providers/ToastProvider";
import Header from "./components/Header";
import Game from "./components/Game";
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen pb-[env(safe-area-inset-bottom,0px)] flex flex-col">
        <ToastProvider>
          <Header />
          <main className="flex-1 min-h-0 p-2">
            <Routes>
              <Route path="/" element={<Game />} />
              <Route path="/settings" element={<div>Settings</div>} />
            </Routes>
          </main>
        </ToastProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
