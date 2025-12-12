from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    sightings = relationship("Sighting", back_populates="user")


class Aircraft(Base):
    __tablename__ = "aircraft"

    id = Column(Integer, primary_key=True, index=True)
    model = Column(String(100), nullable=False)
    airline = Column(String(100), nullable=False)
    iata_code = Column(String(10), nullable=True)
    icao_code = Column(String(10), nullable=True)

    sightings = relationship("Sighting", back_populates="aircraft")


class Sighting(Base):
    __tablename__ = "sightings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    aircraft_id = Column(Integer, ForeignKey("aircraft.id"), nullable=True, index=True)
    title = Column(String(200), nullable=False)
    location = Column(String(255), nullable=False)
    spotted_at = Column(DateTime, nullable=False)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="sightings")
    aircraft = relationship("Aircraft", back_populates="sightings")
