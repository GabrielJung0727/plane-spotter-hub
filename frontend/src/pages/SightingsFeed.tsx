import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sighting, fetchSightings } from "../api/client";
import SightingCard from "../components/SightingCard";

function SightingsFeed() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSightings();
        setSightings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load sightings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <p className="page">Loading sightings...</p>;
  }

  if (error) {
    return <p className="page">Error: {error}</p>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h2 style={{ margin: 0 }}>Latest Sightings</h2>
          <p style={{ margin: "0.25rem 0", color: "#475569" }}>
            Real-time notes from spotters around the world.
          </p>
        </div>
        <Link className="btn" to="/new">
          + 새 기록 등록
        </Link>
      </div>

      {sightings.length === 0 && <p>No sightings yet. Be the first to post!</p>}

      {sightings.map((sighting) => (
        <SightingCard key={sighting.id} sighting={sighting} />
      ))}
    </div>
  );
}

export default SightingsFeed;
