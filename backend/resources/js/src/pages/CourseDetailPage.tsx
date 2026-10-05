import { Link } from "@inertiajs/react";
import { Card, LoadState, PageHeader } from "../components/UI";
import { useAsync } from "../hooks/useAsync";
import { courseService } from "../services/courseService";

export function CourseDetailPage({ courseId }: { courseId: string }) {
  const state = useAsync(() => courseService.getCourse(courseId), [courseId]);
  if (state.status !== "success") return <LoadState state={state.status} error={state.status === "error" ? state.error : undefined} />;
  const course = state.data;
  if (!course) return <Card className="empty"><h2>Course not found</h2><Link href="/courses">Back to catalog</Link></Card>;

  return (
    <>
      <PageHeader eyebrow={course.difficulty} title={course.title} description={course.description} action={<Link className="btn btn-outline" href="/courses">All courses</Link>} />
      <Card className="course-detail-hero panel-periwinkle">
        <div><p className="section-eyebrow">YOUR NEXT LEARNING PATH</p><h2>{course.lessons.length} guided lessons</h2><p>{course.duration} · interactive checks · C practice</p></div>
        <Link className="btn btn-primary" href={`/courses/${course.id}/lessons/${course.lessons[0]?.id ?? "functions"}`}>Start learning</Link>
      </Card>
      <section className="lesson-list mt" aria-label="Course lessons">
        <div className="section-head"><h2>Course lessons</h2><span className="small muted">{course.lessons.length} available</span></div>
        {course.lessons.length ? course.lessons.map((lesson, index) => (
          <Link className="lesson-row" key={lesson.id} href={`/courses/${course.id}/lessons/${lesson.id}`}>
            <span className="lesson-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="course-row-main"><strong>{lesson.title}</strong><span className="small muted">{lesson.summary}</span></span>
            <span className="small muted">{lesson.durationMinutes} min</span><span aria-hidden="true">↗</span>
          </Link>
        )) : <Card className="empty">Lessons are being prepared for this course.</Card>}
      </section>
    </>
  );
}

export default CourseDetailPage;
