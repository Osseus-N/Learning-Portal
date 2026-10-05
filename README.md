# CodeTrail React learning portal

## Run locally

```sh
npm install
npm run dev
```

Run `npm run build` to type-check and create a production build in `dist/`.

## Data boundaries

- Course definitions, lessons, and nested quiz documents are served through `CourseService` (`src/services/courseService.ts`). The document shape supports an extensible, discriminated set of question types without fixed relational columns for each quiz format.
- Learner profile, course progress, and achievement records are served through `RelationalService` (`src/services/relationalService.ts`). These records have stable IDs and profile/course foreign-key relationships, suitable for a relational database.
- Current adapters provide in-memory sample data so the UI and quiz interactions run without a backend. Replace these adapters with API-backed implementations; keep page components and hooks on the service interfaces.
- Quiz question types are declared as a discriminated union in `src/types.ts`. `QuizPlayer` renders choice, multi-select, code-output, and fill-in-the-blank interactions from the document.

## Application structure

- `src/components/`: shared layout, visual primitives, and quiz renderer.
- `src/pages/`: route-level learner, learning, and admin screens.
- `src/hooks/`: reusable asynchronous loading state.
- `src/services/`: data access contracts and demo adapters.
- `style.css` and `src/styles/app.css`: shared prototype design system and React-specific components.

This is a UI prototype: authentication and C compilation/execution are not connected. Persisting quiz attempts, XP, and achievements requires backend services.
