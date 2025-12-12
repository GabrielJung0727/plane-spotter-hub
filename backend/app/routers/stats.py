from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..deps import get_db

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/", response_model=schemas.StatsRead)
def get_stats(db: Session = Depends(get_db)):
    return schemas.StatsRead(
        users=db.query(models.User).count(),
        aircraft=db.query(models.Aircraft).count(),
        sightings=db.query(models.Sighting).count(),
    )
