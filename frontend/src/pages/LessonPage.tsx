import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QuizPlayer } from "../components/QuizPlayer";
import { Card, LoadState, PageHeader, ProgressBar } from "../components/UI";
import { useAsync } from "../hooks/useAsync";
import { courseService } from "../services/courseService";
import { relationalService } from "../services/relationalService";

export function LessonPage() {
  const { courseId = "c-fundamentals", lessonId = "functions" } = useParams();
  const state = useAsync(() => courseService.getCourse(courseId), [courseId]);
  const [notice, setNotice] = useState("");

  if (state.status !== "success") return <LoadState state={state.status} error={state.status === "error" ? state.error : undefined} />;
  const course = state.data;
  const lesson = course?.lessons.find((item) => item.id === lessonId);
  if (!course || !lesson) return <Card className="empty"><h2>Lesson not found</h2><Link to={`/courses/${courseId}`}>Return to course</Link></Card>;
  const selectedCourse = course;
  const selectedLesson = lesson;

  async function completeLesson() {
    try {
      await relationalService.completeLesson("learner-noor", selectedCourse.id, selectedLesson.id);
      setNotice("Lesson progress saved.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save lesson progress.");
    }
  }

  return (
    <>
      <div className="crumbs"><Link to="/courses">Courses</Link> / <Link to={`/courses/${course.id}`}>{course.title}</Link></div>
      <PageHeader eyebrow={`${course.title} · ${lesson.durationMinutes} min`} title={lesson.title} description={lesson.summary} />
      <div className="lesson-progress lesson-page-progress"><ProgressBar value={40} label={`${course.title} course progress`} /><span className="small muted">4 / 10 lessons</span></div>
      <div className="lesson-layout mt">
        <div className="lesson-stack">
          <Card className="lesson-content">
            <p className="section-eyebrow">THE CONCEPT</p>
            {lesson.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {lesson.code && <pre className="quiz-code"><code>{lesson.code}</code></pre>}
          </Card>
          {lesson.quiz && <QuizPlayer quiz={lesson.quiz} onComplete={() => { void completeLesson(); }} />}
        </div>
        <aside className="lesson-aside">
          <Card className="practice-editor">
            <div className="editor-bar"><strong>main.c</strong><span>C practice</span></div>
            <pre className="quiz-code"><code>{lesson.code ?? "#include <stdio.h>\n\nint main(void) {\n  return 0;\n}"}</code></pre>
            <p className="small muted">Practice preview. Connect a C runner to compile and execute code.</p>
            <button className="btn btn-accent btn-block" type="button" onClick={() => setNotice("C execution needs a connected runner.")}>Run code</button>
          </Card>
          {notice && <p className="inline-alert alert-success mt" role="status">{notice}</p>}
          <Card className="lesson-next mt"><p className="section-eyebrow">UP NEXT</p><h2>Keep your streak going</h2><Link to="/challenges">Try a daily challenge</Link></Card>
        </aside>
      </div>
      <div className="row between mt"><Link className="btn btn-outline" to={`/courses/${course.id}`}>Course lessons</Link><button className="btn btn-primary" type="button" onClick={() => void completeLesson()}>Complete lesson</button></div>
      {notice && <p className="inline-alert alert-success mt" role="status">{notice}</p>}
    </>
  );
}
