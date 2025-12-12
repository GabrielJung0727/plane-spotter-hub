import { Sighting } from "../api/client";

interface Props {
  sighting: Sighting;
}

function formatDate(value: string): string {
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function SightingCard({ sighting }: Props) {
  const aircraftLabel = sighting.aircraft
    ? `${sighting.aircraft.airline} • ${sighting.aircraft.model}`
    : "Unknown aircraft";

  return (
    <article className="card">
      <h3 className="title">{sighting.title}</h3>
      <div className="meta">
        <span>{aircraftLabel}</span>
        <span>📍 {sighting.location}</span>
        <span>🕒 {formatDate(sighting.spotted_at)}</span>
      </div>
      {sighting.note && <p style={{ marginTop: "0.6rem", color: "#334155" }}>{sighting.note}</p>}
    </article>
  );
}

export default SightingCard;
