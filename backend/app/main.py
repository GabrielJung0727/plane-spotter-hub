from datetime import datetime, timedelta

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, SessionLocal, engine
from .models import Aircraft, Sighting, User
from .routers import aircraft, auth, sightings, stats
from .security import hash_password


app = FastAPI(title="PlaneSpotter Hub")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    _seed_data()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(sightings.router)
app.include_router(aircraft.router)
app.include_router(auth.router)
app.include_router(stats.router)


def _seed_data() -> None:
    db = SessionLocal()
    try:
        user = db.query(User).first()
        if not user:
            user = User(username="demo", email="demo@example.com", password_hash=hash_password("demo"))
            db.add(user)
            db.commit()
            db.refresh(user)

        aircraft_rows = db.query(Aircraft).all()
        if not aircraft_rows:
            sample_aircraft = [
                Aircraft(model="A320", airline="Air France", iata_code="AF", icao_code="AFR"),
                Aircraft(model="B737-800", airline="Southwest", iata_code="WN", icao_code="SWA"),
            ]
            db.add_all(sample_aircraft)
            db.commit()
            aircraft_rows = sample_aircraft

        if not db.query(Sighting).first():
            first_aircraft_id = aircraft_rows[0].id if aircraft_rows else None
            demo_sighting = Sighting(
                user_id=user.id,
                aircraft_id=first_aircraft_id,
                title="Evening approach over the city",
                location="LAX Spotting Deck",
                spotted_at=datetime.utcnow() - timedelta(hours=2),
                note="Clear sky, great light.",
            )
            db.add(demo_sighting)
            db.commit()
    finally:
        db.close()
