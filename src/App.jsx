import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateCountdown from "./pages/CreateCountdown";
import EventPage from "./pages/EventPage";
import NotFoundPage from "./pages/NotFoundPage"; // Página para exibir o evento

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateCountdown />} />
        <Route path="/evento/:idUrl/:urlPersonalizada" element={<EventPage />} />
        <Route path="*" element={<NotFoundPage />} /> {/* Página para URL errada */}
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
