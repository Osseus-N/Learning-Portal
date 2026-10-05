import { useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import { useAsync } from "../hooks/useAsync";
import { courseService } from "../services/courseService";
import type { Difficulty } from "../types";
import { Card, DifficultyBadge, LoadState, PageHeader } from "../components/UI";

export function CoursesPage() {
  const state = useAsync(() => courseService.listCourses(), []);
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const filtered = useMemo(() => state.status === "success" ? state.data.filter((course) =>
    (!difficulty || course.difficulty === difficulty) &&
    `${course.title} ${course.description} ${course.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()),
  ) : [], [state, query, difficulty]);

  if (state.status !== "success") return <LoadState state={state.status} error={state.status === "error" ? state.error : undefined} />;

  return (
    <>
      <PageHeader title="Course catalog" description="Pick your next C skill to build." />
      <div className="toolbar course-filters" role="search">
        <label className="sr-only" htmlFor="course-search">Search courses</label>
        <input id="course-search" type="search" placeholder="Search courses or topics" value={query} onChange={(event) => setQuery(event.target.value)} />
        <label className="sr-only" htmlFor="course-level">Filter by difficulty</label>
        <select id="course-level" value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty | "")}>
          <option value="">All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option>
        </select>
        <span className="small muted">{filtered.length} courses</span>
      </div>
      {filtered.length ? (
        <div className="grid g-3 course-grid">
          {filtered.map((course, index) => (
            <Card className={`course-card course-tone-${index % 3}`} key={course.id}>
              <div className="course-mark">{["< C >", "{ C }", "C*"][index % 3]}</div>
              <div className="row between"><DifficultyBadge level={course.difficulty} /><span className="small muted">{course.duration}</span></div>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <div className="tag-list">{course.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
              <Link className="btn btn-outline btn-sm mt" href={`/courses/${course.id}`}>Explore course</Link>
            </Card>
          ))}
        </div>
      ) : <Card className="empty"><h2>No courses found</h2><p>Try another keyword or difficulty.</p></Card>}
    </>
  );
}

export default CoursesPage;
