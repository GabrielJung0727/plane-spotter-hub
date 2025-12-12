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
        │   └── NewSighting.tsx
        └── components/
            ├── NavBar.tsx
            └── SightingCard.tsx
```

## 실행 방법

### 1) PostgreSQL 준비
예시 연결 문자열:  
`postgresql://USER:PASSWORD@localhost:5432/plane_spotter`

환경변수 `DATABASE_URL` 로 설정하거나 `app/database.py` 기본값을 수정하세요.

### 2) 백엔드
```
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

엔드포인트
- `GET /health`
- `GET /sightings/` · `POST /sightings/`
- `GET /aircraft/` · `POST /aircraft/`

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
