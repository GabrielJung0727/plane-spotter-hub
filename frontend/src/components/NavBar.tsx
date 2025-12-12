import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, username, logout } = useAuth();
  const isNewPage = location.pathname === "/new";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">✈</span>
          <span className="brand-name">PlaneSpotter Hub</span>
        </Link>

        <div className="nav-actions">
          {token ? (
            <>
              <span className="chip">Signed in as {username}</span>
              <Link className="btn secondary" to={isNewPage ? "/" : "/new"}>
                {isNewPage ? "Back to feed" : "+ New sighting"}
              </Link>
              <button className="btn ghost" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn ghost" to="/login">
                Log in
              </Link>
              <Link className="btn" to="/signup">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default NavBar;
