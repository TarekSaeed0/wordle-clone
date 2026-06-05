import "./App.css";
import { ToastProvider } from "./providers/ToastProvider";
import Game from "./pages/Game";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useOutlet,
} from "react-router";
import { HeaderProvider } from "./providers/HeaderProvider";
import Settings from "./pages/Settings";
import { AnimatePresence, motion } from "motion/react";

function PageTransition() {
  const loction = useLocation();
  const outlet = useOutlet();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={loction.pathname}
        className="size-full"
        initial={{ opacity: 0, x: "-10%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "50%" }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen pb-[env(safe-area-inset-bottom,0px)] flex flex-col">
        <ToastProvider>
          <HeaderProvider>
            <main className="flex-1 min-h-0 p-2">
              <Routes>
                <Route element={<PageTransition />}>
                  <Route path="/" element={<Game />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Routes>
            </main>
          </HeaderProvider>
        </ToastProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
