import os
from datetime import timedelta


SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
ALGORITHM = "HS256"

_env_db_url = os.getenv("DATABASE_URL")
_default_pg = "postgresql://USER:PASSWORD@localhost:5432/plane_spotter"
DATABASE_URL = _env_db_url or _default_pg

# Fallback to SQLite for quick local runs if placeholder was not replaced
if DATABASE_URL == _default_pg:
    DATABASE_URL = "sqlite:///./planes.db"


def access_token_expires_delta() -> timedelta:
    return timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
