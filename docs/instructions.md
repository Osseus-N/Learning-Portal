# Local Development Setup

This project runs as a Laravel application with React pages rendered through
Inertia.js. Laravel handles HTTP routes and authentication; Vite serves and
builds the React client. MySQL and MongoDB run as separate Docker services.

## Prerequisites

Install and start Docker Desktop, then verify Docker Compose is available:

```bash
docker --version
docker compose version
```

## Clone and configure

```bash
git clone <REPOSITORY_URL>
cd <PROJECT_FOLDER>
```

Create the Laravel environment file if it does not already exist.

### Windows PowerShell

```powershell
Copy-Item backend/.env.example backend/.env
```

### macOS / Linux

```bash
cp backend/.env.example backend/.env
```

## Install and start the application

Start the database services:

```bash
docker compose up -d mysql mongodb
```

Install PHP dependencies, create the application key, and migrate the database:

```bash
docker compose run --rm backend composer install
docker compose run --rm backend php artisan key:generate
docker compose run --rm backend php artisan migrate
```

If local seed data is available, run `php artisan migrate --seed` in place of
the migration command above.

Start Laravel and the Vite development server:

```bash
docker compose up -d backend vite
docker compose ps
```

The Vite service installs the Node dependencies from `backend/package-lock.json`
when it starts. To create a production asset build while the service is running:

```bash
docker compose exec vite npm run build
```

## Open the application

Open the Laravel application at:

```text
http://localhost:8000
```

The Vite server runs at `http://localhost:5173` and supplies development assets;
it is not a separate frontend application to open directly.

## Frontend and routing conventions

- Define page routes in `backend/routes/web.php` and render Inertia pages with
  `Inertia::render('PageName', $props)`.
- Put React page components in `backend/resources/js/src/pages/`. The Inertia
  page name must match the filename, without its `.tsx` extension.
- Put shared components, hooks, services, types, and styles under
  `backend/resources/js/src/`.
- Use Inertia's `Link`, `useForm`, and `usePage` APIs for navigation, form
  submissions, and shared page props. Do not add a separate client-side router.
- Register frontend dependencies in `backend/package.json`; the Vite and React
  entry point is `backend/resources/js/src/app.tsx`.
- The Laravel root view is `backend/resources/views/welcome.blade.php`.

Learning pages currently use sample data in the frontend services. Add Laravel
routes/controllers and persistence before treating course progress, profiles,
or achievements as database-backed features.

## Tests and shutdown

Run the Laravel test suite with:

```bash
docker compose exec backend php artisan test
```

Stop the services when finished:

```bash
docker compose down
```

Docker volumes preserve the local database data. To remove the database volumes
as well, use `docker compose down -v`.

## Keep local files out of Git

Do not commit local environment files or installed dependencies:

```text
backend/.env
backend/vendor/
backend/node_modules/
```
