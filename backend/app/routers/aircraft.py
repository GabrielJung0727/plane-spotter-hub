from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..deps import get_db


router = APIRouter(prefix="/aircraft", tags=["aircraft"])


@router.get("/", response_model=list[schemas.AircraftRead])
def list_aircraft(db: Session = Depends(get_db)):
    aircraft = db.query(models.Aircraft).order_by(models.Aircraft.airline.asc()).all()
    return aircraft


@router.post("/", response_model=schemas.AircraftRead, status_code=status.HTTP_201_CREATED)
def create_aircraft(payload: schemas.AircraftCreate, db: Session = Depends(get_db)):
    duplicate = (
        db.query(models.Aircraft)
        .filter(
            models.Aircraft.model == payload.model,
            models.Aircraft.airline == payload.airline,
        )
        .first()
    )
    if duplicate:
        raise HTTPException(status_code=400, detail="Aircraft already exists")

    aircraft = models.Aircraft(
        model=payload.model,
        airline=payload.airline,
        iata_code=payload.iata_code,
        icao_code=payload.icao_code,
    )
    db.add(aircraft)
    db.commit()
    db.refresh(aircraft)
    return aircraft
