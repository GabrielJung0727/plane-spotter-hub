from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime

    class Config:
        orm_mode = True


class AircraftBase(BaseModel):
    model: str
    airline: str
    iata_code: Optional[str] = None
    icao_code: Optional[str] = None


class AircraftCreate(AircraftBase):
    pass


class AircraftRead(AircraftBase):
    id: int

    class Config:
        orm_mode = True


class SightingBase(BaseModel):
    title: str
    location: str
    spotted_at: datetime
    note: Optional[str] = None
    aircraft_id: Optional[int] = None


class SightingCreate(SightingBase):
    user_id: Optional[int] = 1


class SightingRead(SightingBase):
    id: int
    user_id: int
    created_at: datetime
    aircraft: Optional[AircraftRead] = None

    class Config:
        orm_mode = True
