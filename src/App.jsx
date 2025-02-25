import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateCountdown from "./pages/CreateCountdown";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateCountdown />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
