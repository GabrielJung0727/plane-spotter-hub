import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import SightingsFeed from "./pages/SightingsFeed";
import NewSighting from "./pages/NewSighting";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./auth";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <main className="page">
        <Routes>
          <Route path="/" element={<SightingsFeed />} />
          <Route path="/new" element={<NewSighting />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;
