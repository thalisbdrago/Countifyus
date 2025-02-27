import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateCountdown from "./pages/CreateCountdown";
import EventPage from "./pages/EventPage"; // Página para exibir o evento

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateCountdown />} />
        <Route path="/evento/:idUrl/:urlPersonalizada" element={<EventPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
