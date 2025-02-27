import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateCountdown from "./pages/CreateCountdown";
import MainPage from "./components/MainPage";
import EventPage from "./pages/EventPage"; // Página para exibir o evento

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateCountdown />} />
        <Route path="/evento/:idUrl/:urlPersonalizada" element={<EventPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
