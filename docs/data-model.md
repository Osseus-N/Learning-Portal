# CodeTrail data model

Keep course authoring documents and learner-owned records in separate persistence services. The current service implementations use sample data; these shapes define the backend integration boundary.

## Document database: courses, lessons, and quizzes

Store a course as one document or as a course document with embedded lesson/quiz documents, depending on document size and authoring/versioning needs. Quiz questions are a discriminated union so adding a new interaction does not require widening a fixed SQL row.

```json
{
  "_id": "c-fundamentals",
  "title": "C Programming Fundamentals",
  "difficulty": "Beginner",
  "lessons": [
    {
      "_id": "functions",
      "title": "Functions and return values",
      "content": ["Lesson text ..."],
      "quiz": {
        "_id": "functions-check",
        "questions": [
          {
            "id": "entry-point",
            "type": "multiple-choice",
            "prompt": "Which function is the standard entry point?",
            "options": ["printf()", "main()"],
            "answer": 1,
            "explanation": "Execution starts in main()."
          },
          {
            "id": "return-type",
            "type": "fill-blank",
            "prompt": "Return a result from a function.",
            "codeBefore": "int add(int a, int b) { ",
            "codeAfter": " a + b; }",
            "answer": "return",
            "explanation": "return sends the value back to the caller."
          }
        ]
      }
    }
  ]
}
```

Supported demo question types are `multiple-choice`, `multi-select`, `code-output`, and `fill-blank`. Add question renderers and validators in `QuizPlayer` when introducing another type. Keep answer keys server-side for a production app; the demo includes them in browser data only to illustrate rendering.

## Relational database: profiles, progress, attempts, and achievements

Example PostgreSQL schema:

```sql
CREATE TABLE learner_profiles (
  id UUID PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  level INTEGER NOT NULL DEFAULT 1 CHECK (level > 0),
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  practice_streak INTEGER NOT NULL DEFAULT 0 CHECK (practice_streak >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE enrollments (
  profile_id UUID NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  current_lesson_id TEXT,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, course_id)
);

CREATE TABLE lesson_completions (
  profile_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, course_id, lesson_id),
  FOREIGN KEY (profile_id, course_id)
    REFERENCES enrollments(profile_id, course_id) ON DELETE CASCADE
);

CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  quiz_id TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0),
  question_count INTEGER NOT NULL CHECK (question_count > 0),
  passed BOOLEAN NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX quiz_attempts_profile_date_idx
  ON quiz_attempts (profile_id, submitted_at DESC);

CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0 CHECK (xp_reward >= 0),
  rarity TEXT NOT NULL,
  target INTEGER NOT NULL CHECK (target > 0)
);

CREATE TABLE profile_achievements (
  profile_id UUID NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0),
  unlocked_at TIMESTAMPTZ,
  PRIMARY KEY (profile_id, achievement_id)
);
```

Course progress is derived from `enrollments` and `lesson_completions`; no delimited lists or document content need to be copied into relational rows. `course_id`, `lesson_id`, and `quiz_id` reference document identifiers; the relational store should not duplicate course lesson/quiz content. If course identifiers become UUIDs, use the same identifier format in both persistence services.
