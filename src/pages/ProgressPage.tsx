import { Link } from "react-router-dom";
import { Card, LoadState, PageHeader, ProgressBar, StatCard } from "../components/UI";
import { useAsync } from "../hooks/useAsync";
import { courseService } from "../services/courseService";
import { relationalService } from "../services/relationalService";

export function ProgressPage() {
  const state = useAsync(async () => {
    const [profile, courses, progress] = await Promise.all([
      relationalService.getProfile("learner-noor"),
      courseService.listCourses(),
      relationalService.getCourseProgress("learner-noor"),
    ]);
    if (!profile) throw new Error("Your learner profile could not be found.");
    return { profile, courses, progress };
  }, []);

  if (state.status !== "success") return <LoadState state={state.status} error={state.status === "error" ? state.error : undefined} />;
  const { profile, courses, progress } = state.data;

  return (
    <>
      <PageHeader title="My progress" description="Your C learning, at a glance." action={<Link className="btn btn-outline" to="/achievements">Achievements</Link>} />
      <div className="grid g-2 level-panel">
        <Card className="level-hero panel-periwinkle"><p className="section-eyebrow">CURRENT RANK</p><h2>{profile.title} · LEVEL {profile.level}</h2><ProgressBar value={profile.xp} max={profile.xpToNextLevel} label="Level experience progress" /><div className="row between mt"><span className="small">1,240 / 1,500 XP</span><span className="badge">260 XP TO NEXT LEVEL</span></div></Card>
        <Card className="panel-cyan"><p className="section-eyebrow">THIS WEEK</p><h2>Practice momentum</h2><div className="row between"><span>Daily goal</span><strong>5 of 7 days</strong></div><ProgressBar className="mt" value={5} max={7} label="Weekly practice goal" /><div className="row between mt"><span>Current streak</span><strong>{profile.practiceStreak} days</strong></div><Link className="btn btn-primary btn-sm mt" to="/challenges">Practice a challenge</Link></Card>
      </div>
      <section className="grid g-3 mt"><StatCard label="XP this week" value="+320" color="panel-coral" /><StatCard label="Practice days" value="5 / 7" color="panel-sage" /><StatCard label="Quizzes passed" value="7" color="panel-cyan" /></section>
      <Card className="mt"><div className="section-head"><div><p className="section-eyebrow">CONSISTENCY</p><h2>This week's practice</h2></div><span className="small muted">5 days active · 320 XP</span></div>
        <div className="day-grid" aria-label="Practice activity by day this week">
          {[["MON", "2 tasks", "+60 XP"], ["TUE", "1 task", "+40 XP"], ["WED", "3 tasks", "+80 XP"], ["THU", "No practice", ""], ["FRI", "2 tasks", "+60 XP"], ["SAT", "1 task", "+40 XP"], ["SUN", "2 tasks", "+40 XP"]].map(([day, tasks, xp]) => <div className={`day-cell${xp ? " active" : ""}`} key={day}><span className="day-name">{day}</span><span className="day-count">{tasks}</span>{xp && <span className="small gold-text">{xp}</span>}</div>)}
        </div>
      </Card>
      <Card className="mt"><div className="section-head"><h2>Course progress</h2><Link to="/courses">Browse courses</Link></div>
        <div className="progress-course-list">{courses.map((course) => {
          const courseRow = progress.find((row) => row.courseId === course.id);
          const done = courseRow?.completedLessonIds.length ?? 0;
          const total = course.lessons.length || (course.id === "c-arrays" ? 12 : 8);
          const percent = Math.round(done / total * 100);
          return <div className="progress-course" key={course.id}><div className="row between"><strong>{course.title}</strong><span className="small muted">{done} / {total} lessons</span></div><ProgressBar className="mt" value={percent} label={`${course.title} ${percent}% complete`} /><span className="small muted">{percent ? "In progress" : "Ready to start"}</span></div>;
        })}</div>
      </Card>
    </>
  );
}
