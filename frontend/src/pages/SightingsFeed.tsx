import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Aircraft, Sighting, Stats, fetchAircraft, fetchSightings, fetchStats } from "../api/client";
import SightingCard from "../components/SightingCard";
import { useAuth } from "../auth";

function SightingsFeed() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedAircraft, setSelectedAircraft] = useState<number | undefined>(undefined);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showMine, setShowMine] = useState(false);
  const { token } = useAuth();

  const filters = useMemo(
    () => ({
      q: query.trim() || undefined,
      aircraft_id: selectedAircraft,
      mine: showMine,
      token: token || undefined
    }),
    [query, selectedAircraft, showMine, token]
  );

  useEffect(() => {
    if (!token && showMine) {
      setShowMine(false);
    }
  }, [token, showMine]);

  useEffect(() => {
    const load = async () => {
      try {
        const [sightingData, aircraftData, statsData] = await Promise.all([
          fetchSightings(filters),
          fetchAircraft(),
          fetchStats()
        ]);
        setSightings(sightingData);
        setAircraft(aircraftData);
        setStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load sightings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  if (loading) {
    return <p className="page">Loading sightings...</p>;
  }

  if (error) {
    return <p className="page">Error: {error}</p>;
  }

  return (
    <div>
      <div className="hero">
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <div className="chip">Live feed</div>
          <strong>Track the sky in real-time</strong>
        </div>
        <h2 style={{ margin: "0.35rem 0 0.25rem 0" }}>Latest aircraft sightings</h2>
        <p style={{ margin: 0, color: "#334155" }}>
          Fresh notes from spotters around the world. Add yours to the stream.
        </p>
        <div style={{ marginTop: "0.8rem", display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <Link className="btn" to="/new">
            + 새 기록 등록
          </Link>
          {!token && (
            <Link className="btn ghost" to="/login">
              Log in to post
            </Link>
          )}
        </div>
        {stats && (
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "0.9rem" }}>
            <div className="chip">Sightings: {stats.sightings}</div>
            <div className="chip">Aircraft: {stats.aircraft}</div>
            <div className="chip">Spotters: {stats.users}</div>
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: "1.2rem" }}>
        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
          <input
            style={{ flex: "1 1 260px", marginBottom: 0 }}
            placeholder="Search title or location"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            style={{ flex: "1 1 180px", marginBottom: 0 }}
            value={selectedAircraft ?? ""}
            onChange={(e) => setSelectedAircraft(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">All aircraft</option>
            {aircraft.map((a) => (
              <option key={a.id} value={a.id}>
                {a.airline} — {a.model}
              </option>
            ))}
          </select>
          {token && (
            <label style={{ marginBottom: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={showMine}
                onChange={(e) => setShowMine(e.target.checked)}
                style={{ width: "18px" }}
              />
              My sightings only
            </label>
          )}
        </div>
      </div>

      {sightings.length === 0 && <p>No sightings yet. Be the first to post!</p>}

      {sightings.map((sighting) => (
        <SightingCard key={sighting.id} sighting={sighting} />
      ))}
    </div>
  );
}

export default SightingsFeed;
