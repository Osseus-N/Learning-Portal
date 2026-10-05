import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, PageHeader, StatCard } from "../components/UI";

export function AdminPage() {
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const users = pathname.endsWith("/users");
  const courses = pathname.endsWith("/courses");
  if (users || courses) {
    const title = users ? "User management" : "Course management";
    const rows = users
      ? [["Ana Rivera", "ana@example.com", "Learner"], ["Ben Tran", "ben@example.com", "Learner"], ["Noor James", "noor@example.com", "Learner"]]
      : [["C Programming Fundamentals", "Beginner", "Published"], ["Arrays and Data Structures in C", "Intermediate", "Published"], ["Pointers and Memory in C", "Advanced", "Draft"]];
    const filteredRows = rows.filter((row) => row.join(" ").toLowerCase().includes(query.toLowerCase()));
    return <>
      <PageHeader title={title} description={users ? "Review learner accounts." : "Manage C course publishing."} action={courses ? <button className="btn btn-primary" type="button" disabled title="Course authoring is not connected in this demo.">Create course</button> : undefined} />
      <Card><div className="toolbar"><label className="sr-only" htmlFor="admin-search">Search {title.toLowerCase()}</label><input id="admin-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${users ? "learners" : "courses"}`} /></div>{filteredRows.length ? <div className="table-wrap"><table><thead><tr>{(users ? ["Name", "Email", "Role"] : ["Course", "Level", "Status"]).map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{filteredRows.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div> : <div className="empty">No matching records.</div>}</Card>
    </>;
  }

  return <>
    <PageHeader title="Admin overview" description="A quick view of learning activity." action={<Link className="btn btn-primary" to="/admin/courses">Manage courses</Link>} />
    <section className="grid g-4 admin-stats">
      <StatCard label="Active learners" value="248" note="Across C courses" color="panel-coral" />
      <StatCard label="Published courses" value="12" note="3 drafts to review" color="panel-cyan" />
      <StatCard label="Average quiz score" value="81%" color="panel-periwinkle" />
      <StatCard label="Course completion" value="46%" color="panel-sage" />
    </section>
    <div className="grid g-2 mt">
      <Card><div className="section-head"><h2>Recent learner activity</h2><Link to="/admin/users">View learners</Link></div><div className="activity-list"><div className="activity-item"><span className="activity-dot" /><div><p>Ana Rivera passed C functions</p><span className="small muted">Today</span></div></div><div className="activity-item"><span className="activity-dot" /><div><p>Ben Tran started a daily challenge</p><span className="small muted">Today</span></div></div><div className="activity-item"><span className="activity-dot" /><div><p>Cy Lee needs another quiz attempt</p><span className="small muted">Yesterday</span></div></div></div></Card>
      <Card className="panel-coral"><p className="section-eyebrow">NEEDS ATTENTION</p><h2>3 courses are drafts</h2><p>Review lessons before publishing them to learners.</p><Link className="btn btn-outline btn-sm" to="/admin/courses">Review drafts</Link></Card>
    </div>
  </>;
}
