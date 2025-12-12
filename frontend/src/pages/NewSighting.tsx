import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Aircraft, createSighting, fetchAircraft } from "../api/client";
import { useAuth } from "../auth";

function NewSighting() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [spottedAt, setSpottedAt] = useState<string>(new Date().toISOString().slice(0, 16));
  const [note, setNote] = useState("");
  const [aircraftId, setAircraftId] = useState<string>("");
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAircraft()
      .then(setAircraft)
      .catch(() => setAircraft([]));
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setError("로그인이 필요합니다.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      await createSighting({
        title,
        location,
        spotted_at: new Date(spottedAt).toISOString(),
        note: note || undefined,
        aircraft_id: aircraftId ? Number(aircraftId) : null
      }, token);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create sighting");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <section className="auth-card">
        <div className="auth-header">
          <h2>로그인이 필요합니다</h2>
          <p>목격 기록을 등록하려면 계정으로 로그인하세요.</p>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <Link className="btn" to="/login">
            Log in
          </Link>
          <Link className="btn ghost" to="/signup">
            Sign up
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section style={{ maxWidth: "640px" }}>
      <h2 style={{ margin: "0 0 0.5rem 0" }}>New Sighting</h2>
      <p style={{ margin: "0 0 1rem 0", color: "#475569" }}>
        Share your latest aircraft spot with the community.
      </p>

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Golden hour approach of A350"
          />
        </div>

        <div>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Haneda Airport observation deck"
          />
        </div>

        <div>
          <label htmlFor="spotted_at">Spotted at</label>
          <input
            id="spotted_at"
            name="spotted_at"
            type="datetime-local"
            required
            value={spottedAt}
            onChange={(e) => setSpottedAt(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="aircraft_id">Aircraft (optional)</label>
          <select
            id="aircraft_id"
            name="aircraft_id"
            value={aircraftId}
            onChange={(e) => setAircraftId(e.target.value)}
          >
            <option value="">Select from list (optional)</option>
            {aircraft.map((a) => (
              <option key={a.id} value={a.id}>
                {a.airline} — {a.model}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="note">Note</label>
          <textarea
            id="note"
            name="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Camera, weather, or anything noteworthy."
          />
        </div>

        {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? "Posting..." : "Submit sighting"}
        </button>
      </form>
    </section>
  );
}

export default NewSighting;
