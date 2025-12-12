export interface Aircraft {
  id: number;
  model: string;
  airline: string;
  iata_code?: string | null;
  icao_code?: string | null;
}

export interface Sighting {
  id: number;
  user_id: number;
  aircraft_id?: number | null;
  title: string;
  location: string;
  spotted_at: string;
  note?: string | null;
  created_at: string;
  aircraft?: Aircraft | null;
}

export interface SightingPayload {
  title: string;
  location: string;
  spotted_at: string;
  note?: string;
  aircraft_id?: number | null;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Request failed");
  }
  return response.json() as Promise<T>;
}

export async function fetchSightings(): Promise<Sighting[]> {
  const res = await fetch(`${API_BASE}/sightings/`);
  return handleResponse<Sighting[]>(res);
}

export async function createSighting(payload: SightingPayload): Promise<Sighting> {
  const res = await fetch(`${API_BASE}/sightings/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return handleResponse<Sighting>(res);
}
