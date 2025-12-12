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


class UserPublic(BaseModel):
    id: int
    username: str
    created_at: datetime

    class Config:
        orm_mode = True


class SightingBase(BaseModel):
    title: str
    location: str
    spotted_at: datetime
    note: Optional[str] = None
    aircraft_id: Optional[int] = None


class SightingCreate(SightingBase):
    pass


class SightingRead(SightingBase):
    id: int
    created_at: datetime
    aircraft: Optional[AircraftRead] = None
    user: Optional[UserPublic] = None

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str
    exp: int


class LoginRequest(BaseModel):
    username: str
    password: str


class StatsRead(BaseModel):
    users: int
    aircraft: int
    sightings: int
