export interface Aircraft {
  id: number;
  model: string;
  airline: string;
  iata_code?: string | null;
  icao_code?: string | null;
}

export interface Sighting {
  id: number;
  aircraft_id?: number | null;
  title: string;
  location: string;
  spotted_at: string;
  note?: string | null;
  created_at: string;
  aircraft?: Aircraft | null;
  user?: {
    id: number;
    username: string;
  } | null;
}

export interface SightingPayload {
  title: string;
  location: string;
  spotted_at: string;
  note?: string;
  aircraft_id?: number | null;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface Stats {
  users: number;
  aircraft: number;
  sightings: number;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Request failed");
  }
  return response.json() as Promise<T>;
}

export async function fetchSightings(params?: {
  q?: string;
  aircraft_id?: number;
  mine?: boolean;
  token?: string;
}): Promise<Sighting[]> {
  const { q, aircraft_id, mine, token } = params || {};
  const search = new URLSearchParams();
  if (q) search.set("q", q);
  if (aircraft_id) search.set("aircraft_id", String(aircraft_id));
  const path = mine ? "/sightings/mine" : "/sightings/";
  const res = await fetch(`${API_BASE}${path}?${search.toString()}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });
  return handleResponse<Sighting[]>(res);
}

export async function createSighting(payload: SightingPayload, token: string): Promise<Sighting> {
  const res = await fetch(`${API_BASE}/sightings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  return handleResponse<Sighting>(res);
}

export async function login(username: string, password: string): Promise<AuthTokens> {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form
  });
  return handleResponse<AuthTokens>(res);
}

export async function signup(username: string, email: string, password: string): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });
  return handleResponse<UserProfile>(res);
}

export async function fetchAircraft(): Promise<Aircraft[]> {
  const res = await fetch(`${API_BASE}/aircraft/`);
  return handleResponse<Aircraft[]>(res);
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/stats/`);
  return handleResponse<Stats>(res);
}
