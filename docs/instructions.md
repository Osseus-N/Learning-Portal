# Initial Docker Setup

This project uses Docker for:

* Laravel (Backend)
* React + Vite (Frontend)
* MySQL
* MongoDB

## 1. Prerequisites

Install and open **Docker Desktop**.

Verify:

```bash
docker --version
docker compose version
```

## 2. Clone the Repository

```bash
git clone <REPOSITORY_URL>
cd <PROJECT_FOLDER>
```

The project should contain:

```text
project/
├── backend/
├── frontend/
├── docker/
│   └── php/
│       └── Dockerfile
└── docker-compose.yml
```

## 3. Configure Laravel

Create the Laravel environment file.

### Windows PowerShell

```powershell
Copy-Item backend/.env.example backend/.env
```

### macOS / Linux

```bash
cp backend/.env.example backend/.env
```

## 4. Build the Containers

From the project root:

```bash
docker compose build
```

## 5. Start the Containers

```bash
docker compose up -d
```

Check that all containers are running:

```bash
docker compose ps
```

You should see:

```text
Laravel Backend
React Frontend
MySQL
MongoDB
```

## 6. Generate Laravel Key

```bash
docker compose exec backend php artisan key:generate
```

## 7. Run Database Migrations

Each developer has their own local database.

Run:

```bash
docker compose exec backend php artisan migrate
```

If the project has seed data:

```bash
docker compose exec backend php artisan migrate --seed
```

## 8. Access the Application

React:

```text
http://localhost:5173
```

Laravel:

```text
http://localhost:8000
```

## 9. Important

Do **not** commit:

```text
backend/.env
backend/vendor/
frontend/node_modules/
```

The database data is stored locally in Docker volumes and is **not shared through Git**.

When another developer clones the repository, they only need to perform this initial setup on their own machine.
