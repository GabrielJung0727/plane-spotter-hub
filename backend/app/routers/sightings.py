from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, selectinload

from .. import models, schemas
from ..deps import get_current_user, get_db


router = APIRouter(prefix="/sightings", tags=["sightings"])


@router.get("/", response_model=list[schemas.SightingRead])
def list_sightings(
    db: Session = Depends(get_db),
    q: str | None = Query(default=None, description="Search title or location"),
    aircraft_id: int | None = Query(default=None, description="Filter by aircraft id"),
    limit: int = Query(default=100, le=200),
):
    query = db.query(models.Sighting).options(
        selectinload(models.Sighting.aircraft),
        selectinload(models.Sighting.user),
    )

    if q:
        like = f"%{q}%"
        query = query.filter(
            (models.Sighting.title.ilike(like)) | (models.Sighting.location.ilike(like))
        )

    if aircraft_id:
        query = query.filter(models.Sighting.aircraft_id == aircraft_id)

    return query.order_by(models.Sighting.spotted_at.desc()).limit(limit).all()


@router.post("/", response_model=schemas.SightingRead, status_code=status.HTTP_201_CREATED)
def create_sighting(
    payload: schemas.SightingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if payload.aircraft_id:
        aircraft = db.get(models.Aircraft, payload.aircraft_id)
        if not aircraft:
            raise HTTPException(status_code=404, detail="Aircraft not found")

    sighting = models.Sighting(
        user_id=current_user.id,
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


@router.get("/mine", response_model=list[schemas.SightingRead])
def my_sightings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Sighting)
        .options(selectinload(models.Sighting.aircraft), selectinload(models.Sighting.user))
        .filter(models.Sighting.user_id == current_user.id)
        .order_by(models.Sighting.spotted_at.desc())
        .all()
    )
