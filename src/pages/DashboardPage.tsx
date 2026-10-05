import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { courseService } from "../services/courseService";
import { relationalService } from "../services/relationalService";
import { Badge, Card, LoadState, PageHeader, ProgressBar, StatCard } from "../components/UI";

export function DashboardPage() {
  const state = useAsync(async () => {
    const [profile, courses, progress, achievements] = await Promise.all([
      relationalService.getProfile("learner-noor"),
      courseService.listCourses(),
      relationalService.getCourseProgress("learner-noor"),
      relationalService.getAchievements("learner-noor"),
    ]);
    if (!profile) throw new Error("Your learner profile could not be found.");
    return { profile, courses, progress, achievements };
  }, []);

  if (state.status !== "success") return <LoadState state={state.status} error={state.status === "error" ? state.error : undefined} />;

  const { profile, courses, progress, achievements } = state.data;
  const currentCourse = courses.find((course) => course.id === "c-fundamentals");
  const currentLesson = currentCourse?.lessons.find((lesson) => lesson.id === "functions");
  const courseRow = progress.find((row) => row.courseId === currentCourse?.id);
  const completed = courseRow?.completedLessonIds.length ?? 0;
  const totalLessons = currentCourse?.lessons.length ?? 0;

  return (
    <div className="dashboard-page">
      <PageHeader title={`Welcome, ${profile.fullName.split(" ")[0]}`} description="Ready for today's practice?" action={<Link className="btn btn-primary" to={`/courses/${currentCourse?.id}/lessons/${currentLesson?.id}`}>Continue lesson</Link>} />
      <Card className="player-card panel-periwinkle" aria-label="Learner level and progression">
        <div className="player-avatar" aria-hidden="true">{profile.fullName.split(" ").map((part) => part[0]).join("")}</div>
        <div className="player-identity">
          <div className="player-name">{profile.fullName} <span className="player-title">{profile.title}</span></div>
          <span className="level-number">LEVEL {profile.level}</span>
          <div className="xp-track"><ProgressBar value={profile.xp} max={profile.xpToNextLevel} label={`Level ${profile.level} XP progress`} /><span className="xp-copy">{profile.xp.toLocaleString()} / {profile.xpToNextLevel.toLocaleString()} XP</span></div>
        </div>
        <div className="player-stats">
          <div className="player-stat"><strong>{achievements.filter((item) => item.unlockedAt).length}</strong><Link to="/achievements">Achievements</Link></div>
          <div className="player-stat"><strong className="gold-text">{profile.practiceStreak} days</strong><span>Practice streak</span></div>
          <Link className="btn btn-outline btn-sm" to="/progress">View progress</Link>
        </div>
      </Card>
      <div className="grid g-2">
        <Card className="panel-cyan" aria-labelledby="resume-title">
          <div className="row between"><div><p className="small muted">PICK UP WHERE YOU LEFT OFF</p><h2 id="resume-title">{currentCourse?.title}</h2></div><Badge tone="info">In progress</Badge></div>
          <p className="muted">Lesson 4 · Functions</p>
          <div className="lesson-progress"><ProgressBar value={completed} max={totalLessons || 10} label="C Programming Fundamentals course progress" /><span className="small muted">{completed + 1} / {totalLessons || 10}</span></div>
          <p className="small muted mt">Next: return a value from a function.</p>
          <Link className="btn btn-primary btn-sm" to={`/courses/${currentCourse?.id}/lessons/${currentLesson?.id}`}>Resume lesson</Link>
        </Card>
        <Card className="panel-coral" aria-labelledby="daily-title">
          <div className="row between"><h2 id="daily-title">Today's practice</h2><Badge tone="warning">Ready</Badge></div>
          <p>Write a C function that adds two numbers.</p>
          <p className="muted small">10 min · Functions</p>
          <Link className="btn btn-accent btn-sm" to="/challenges">Start challenge</Link>
        </Card>
      </div>
      <section className="grid g-3" aria-label="Learning summary">
        <StatCard label="Courses" value={profile.enrolledCourseIds.length} note="2 active" color="panel-coral" />
        <StatCard label="Quizzes passed" value="7" note="Keep it up" color="panel-cyan" />
        <StatCard label="Practice streak" value={`${profile.practiceStreak} days`} note="Best: 8 days" color="panel-sage" />
      </section>
      <div className="grid g-2">
        <Card className="panel-sage" id="my-courses">
          <div className="section-head"><div><h2>My courses</h2><p className="muted mb-0">Your learning path</p></div><Link to="/courses">Find a course</Link></div>
          <div className="course-list">
            {courses.map((course) => {
              const row = progress.find((item) => item.courseId === course.id);
              const percentage = course.lessons.length ? Math.round(((row?.completedLessonIds.length ?? 0) / course.lessons.length) * 100) : 0;
              return (
                <Link className="course-row" key={course.id} to={`/courses/${course.id}`}>
                  <span className="course-row-icon" aria-hidden="true">C</span>
                  <span className="course-row-main"><strong>{course.title}</strong><span className="small muted">{course.lessons.length || 8} lessons · {percentage}% complete</span></span>
                  <ProgressBar value={percentage} label={`${course.title} progress`} />
                  <span className="course-row-arrow" aria-hidden="true">↗</span>
                </Link>
              );
            })}
          </div>
        </Card>
        <Card aria-labelledby="activity-title">
          <div className="section-head"><h2 id="activity-title">Recent activity</h2><Badge tone="success">Today</Badge></div>
          <div className="activity-list">
            <div className="activity-item"><span className="activity-dot" aria-hidden="true" /><div><p>Passed “C functions” quick check</p><span className="small muted">Yesterday</span></div></div>
            <div className="activity-item"><span className="activity-dot" aria-hidden="true" /><div><p>Completed “Loops and conditions”</p><span className="small muted">2 days ago</span></div></div>
            <div className="activity-item"><span className="activity-dot" aria-hidden="true" /><div><p>Started Arrays and Data Structures in C</p><span className="small muted">4 days ago</span></div></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
