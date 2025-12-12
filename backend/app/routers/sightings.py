from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from .. import models, schemas
from ..deps import get_db


router = APIRouter(prefix="/sightings", tags=["sightings"])


def _ensure_default_user(db: Session) -> models.User:
    user = db.query(models.User).first()
    if not user:
        user = models.User(
            username="demo",
            email="demo@example.com",
            password_hash="demo",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


@router.get("/", response_model=list[schemas.SightingRead])
def list_sightings(db: Session = Depends(get_db)):
    sightings = (
        db.query(models.Sighting)
        .options(selectinload(models.Sighting.aircraft))
        .order_by(models.Sighting.created_at.desc())
        .all()
    )
    return sightings


@router.post("/", response_model=schemas.SightingRead, status_code=status.HTTP_201_CREATED)
def create_sighting(payload: schemas.SightingCreate, db: Session = Depends(get_db)):
    user_id = payload.user_id
    if not user_id:
        user_id = _ensure_default_user(db).id

    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.aircraft_id:
        aircraft = db.get(models.Aircraft, payload.aircraft_id)
        if not aircraft:
            raise HTTPException(status_code=404, detail="Aircraft not found")

    sighting = models.Sighting(
        user_id=user_id,
        aircraft_id=payload.aircraft_id,
        title=payload.title,
        location=payload.location,
        spotted_at=payload.spotted_at,
        note=payload.note,
    )
    db.add(sighting)
    db.commit()
    db.refresh(sighting)
    return sighting
