import { useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import { Badge, Card, PageHeader } from "../components/UI";

const challengeItems = [
  { id: "sum-function", title: "Return a sum from a function", summary: "Accept two integers and return their sum.", topic: "Functions", level: "Beginner", minutes: 10 },
  { id: "array-even", title: "Count even values in an array", summary: "Loop through an array and count values divisible by two.", topic: "Arrays and loops", level: "Beginner", minutes: 8 },
  { id: "largest-value", title: "Find the largest array element", summary: "Scan an integer array and return the position of its largest value.", topic: "Arrays", level: "Intermediate", minutes: 12 },
  { id: "formatted-score", title: "Print a formatted score", summary: "Use printf format specifiers to display a name and score.", topic: "Input and output", level: "Beginner", minutes: 7 },
  { id: "swap-pointers", title: "Swap two values with pointers", summary: "Write a function that swaps two integers using addresses.", topic: "Pointers", level: "Advanced", minutes: 15 },
  { id: "string-length", title: "Measure a string", summary: "Count characters in a C string without using strlen.", topic: "Strings", level: "Intermediate", minutes: 10 },
];

export function ChallengesPage() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("");
  const filtered = useMemo(() => challengeItems.filter((item) =>
    (!level || item.level === level) &&
    `${item.title} ${item.summary} ${item.topic}`.toLowerCase().includes(query.toLowerCase()),
  ), [query, level]);

  return (
    <>
      <PageHeader title="Daily challenges" description="One small C exercise a day." />
      <Card className="challenge-feature panel-coral">
        <div><p className="eyebrow">TODAY · 10 MIN</p><h2>Return a sum from a function</h2><p>Write a function that adds two numbers and returns the result.</p><div className="row"><Badge tone="beginner">Beginner</Badge><Badge>C</Badge><span className="small muted">Functions · Return values</span></div></div>
        <Link className="btn btn-primary" href="/courses/c-fundamentals/lessons/functions">Start challenge</Link>
      </Card>
      <section className="grid g-3 challenge-summary mt" aria-label="Challenge progress">
        <div className="card stat"><span className="stat-label">Ready to try</span><strong className="stat-value">{filtered.length}</strong><span className="stat-note">Pick any prompt</span></div>
        <div className="card stat panel-cyan"><span className="stat-label">Completed</span><strong className="stat-value">2</strong><span className="stat-note">Nice work</span></div>
        <div className="card stat panel-sage"><span className="stat-label">Streak</span><strong className="stat-value">5 days</strong><span className="stat-note">Keep going</span></div>
      </section>
      <section className="mt">
        <div className="section-head"><div><h2>Challenge library</h2><p className="muted mb-0">Choose a C topic to practice.</p></div><span className="small muted">{filtered.length} challenges</span></div>
        <div className="toolbar">
          <label className="sr-only" htmlFor="challenge-search">Search challenges</label>
          <input id="challenge-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by topic or title" />
          <label className="sr-only" htmlFor="challenge-level">Filter difficulty</label>
          <select id="challenge-level" value={level} onChange={(event) => setLevel(event.target.value)}><option value="">All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>
        </div>
        {filtered.length ? <div className="grid g-3">
          {filtered.map((item) => <Card className="challenge-card" key={item.id}>
            <div className="row between"><Badge tone={item.level.toLowerCase() as "beginner" | "intermediate" | "advanced"}>{item.level}</Badge><Badge tone="warning">Available</Badge></div>
            <h3>{item.title}</h3><p>{item.summary}</p>
            <div className="challenge-meta"><span>C · {item.topic}</span><span>{item.minutes} min</span></div>
            <Link className="btn btn-outline btn-sm" href="/courses/c-fundamentals/lessons/functions">Start challenge</Link>
          </Card>)}
        </div> : <Card className="empty"><h2>No matching challenges</h2><p>Try a different topic or difficulty.</p></Card>}
      </section>
    </>
  );
}

export default ChallengesPage;
