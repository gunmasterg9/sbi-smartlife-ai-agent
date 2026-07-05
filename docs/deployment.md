# 🚀 Deployment Guide: SBI SmartLife Platform

This document describes how to deploy the SBI SmartLife AI Agent Platform in development and production environments.

---

## 📦 Container Services (Docker Compose)

The environment consists of 4 Docker containers:

1. **`postgres` (Port `5432`)**: Relational storage (using Postgres 16 Alpine). Holds customer profiles, banking transactions, audit logs, and compliance.
2. **`chromadb` (Port `8100`)**: Vector database for customer behavioral embeddings.
3. **`backend` (Port `8000`)**: FastAPI server containing API controllers, SQLAlchemy queries, and LangGraph agent pipelines.
4. **`frontend` (Port `3000`)**: Next.js Node application compiling TypeScript pages and hosting the user interface.

---

## 🛠️ Step-by-Step Installation

### 1. Configure Environment Variables
Create a `.env` file at the root. You can start by copying the example:
```bash
cp .env.example .env
```
Ensure you set the configuration parameters:
- `AI_MODE`: Set to `simulated` (works out of the box without keys) or `live` (requires OpenAI/Gemini keys).
- `GEMINI_API_KEY` or `OPENAI_API_KEY`: Required if `AI_MODE=live`.

### 2. Launch Services
Run the following command to build the Docker images and start the containers in detached mode:
```bash
docker-compose up --build -d
```

Confirm that all containers are running successfully:
```bash
docker-compose ps
```

### 3. Initialize the Schema & Seed Data
To populate the database with 500 realistic customer profiles, transaction histories, life events, and scores, run the Python seeder inside the backend container:
```bash
docker-compose exec backend python -m seeds.seed_data
```

---

## 🧑‍💻 Local Development Setup (Without Docker)

If you prefer running services directly on your host machine:

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux/macOS:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server using Uvicorn:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Boot the Next.js dev server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

---

## 🚨 Troubleshooting

### 1. Backend Database Connection Errors
If the backend fails to boot because it cannot connect to PostgreSQL:
- Ensure the `postgres` container is healthy: `docker-compose ps`
- Check postgres logs: `docker logs sbi_postgres`
- If you are running locally without Docker, verify that you have PostgreSQL installed and the service is running, and check that `DATABASE_URL` in `.env` matches your local credentials.

### 2. Next.js Hydration Errors
If you see React hydration warnings in the browser console:
- This is usually caused by mismatching local dates or times in SSR. The dashboard pages use `useEffect` and `useState` with a `mounted` check (`const [mounted, setMounted] = useState(false)`) to guarantee identical initial server and client markup, resolving hydration bugs.
