import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import SightingsFeed from "./pages/SightingsFeed";
import NewSighting from "./pages/NewSighting";

function App() {
  return (
    <>
      <NavBar />
      <main className="page">
        <Routes>
          <Route path="/" element={<SightingsFeed />} />
          <Route path="/new" element={<NewSighting />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
