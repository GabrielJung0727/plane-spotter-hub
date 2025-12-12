# PlaneSpotter Hub

비행기 팬들이 전 세계에서 목격한 항공기를 기록하고 공유하는 풀스택 데모입니다.

## 기술 스택
- Frontend: React + TypeScript + Vite
- Backend: FastAPI (Python)
- Database: PostgreSQL

## 구조
```
plane-spotter-hub/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   ├── deps.py
│   │   └── routers/
│   │       ├── sightings.py
│   │       └── aircraft.py
│   └── requirements.txt
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── main.css
        ├── api/client.ts
        ├── pages/
        │   ├── SightingsFeed.tsx
        │   ├── NewSighting.tsx
        │   ├── Login.tsx
        │   └── Signup.tsx
        └── components/
            ├── NavBar.tsx
            └── SightingCard.tsx
```

## 실행 방법

### 1) PostgreSQL 준비
예시 연결 문자열:  
`postgresql://USER:PASSWORD@localhost:5432/plane_spotter`

환경변수 `DATABASE_URL` 로 설정하거나 `app/config.py` 기본값을 수정하세요.  
`DATABASE_URL` 미설정 시 로컬 SQLite(`planes.db`)로 자동 폴백합니다.

#### PostgreSQL 18 기본 명령어 예시
```bash
# 서버 접속 (관리자 계정)
psql -U postgres

# 데이터베이스와 계정 생성
CREATE DATABASE plane_spotter;
CREATE USER plane_user WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE plane_spotter TO plane_user;

# 서비스 확인/시작 (예: systemd)
sudo systemctl status postgresql
sudo systemctl start postgresql

# 연결 문자열 예시
export DATABASE_URL="postgresql://plane_user:strong_password@localhost:5432/plane_spotter"
```

### 2) 백엔드
```
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

엔드포인트
- `GET /health`
- `POST /auth/signup` · `POST /auth/login`
- `GET /sightings/` (q, aircraft_id 검색 지원)
- `GET /sightings/mine` (Bearer token 필요)
- `POST /sightings/` (Bearer token 필요)
- `GET /aircraft/` · `POST /aircraft/`
- `GET /stats/` (전체 카운트)

### 3) 프론트엔드
```
cd frontend
npm install
npm run dev
```
브라우저에서 `http://localhost:5173` 접속.

## 기타
- 서버 시작 시 데모 사용자/항공기/목격 1건이 자동 삽입됩니다.
- 간단한 CORS 허용이 켜져 있으므로 로컬에서 바로 호출 가능합니다.
