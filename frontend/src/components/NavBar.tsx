import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const location = useLocation();
  const isNewPage = location.pathname === "/new";

  return (
    <header
      style={{
        background: "#0f172a",
        color: "#e2e8f0",
        padding: "0.9rem 1.5rem"
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem"
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #38bdf8, #6366f1)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "0.95rem",
              color: "#0b1224"
            }}
          >
            ✈
          </span>
          <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>PlaneSpotter Hub</span>
        </Link>

        <Link className="btn secondary" to={isNewPage ? "/" : "/new"}>
          {isNewPage ? "Back to feed" : "+ New sighting"}
        </Link>
      </div>
    </header>
  );
}

export default NavBar;
