import { Link } from "react-router-dom";
import { Badge, Card, LoadState, PageHeader, ProgressBar } from "../components/UI";
import { useAsync } from "../hooks/useAsync";
import { relationalService } from "../services/relationalService";

export function AchievementsPage() {
  const state = useAsync(() => relationalService.getAchievements("learner-noor"), []);
  if (state.status !== "success") return <LoadState state={state.status} error={state.status === "error" ? state.error : undefined} />;
  const unlocked = state.data.filter((item) => item.unlockedAt);
  const locked = state.data.filter((item) => !item.unlockedAt);
  return <>
    <PageHeader title="Achievements" description={`${unlocked.length} milestones earned so far.`} action={<Link className="btn btn-outline" to="/progress">View progress</Link>} />
    <section className="grid g-3 achievement-grid">
      {state.data.map((item) => <Card className={`achievement-card ${item.unlockedAt ? "unlocked panel-sage" : "locked"}`} key={item.id}>
        <div className="achievement-head"><span className="achievement-icon" aria-hidden="true">{item.unlockedAt ? "✦" : "◇"}</span><div><h2 className="achievement-title">{item.title}</h2><p className="achievement-description">{item.description}</p></div></div>
        <Badge tone={item.unlockedAt ? "success" : "info"}>{item.rarity}</Badge>
        {item.unlockedAt ? <span className="achievement-unlocked-date">Unlocked {item.unlockedAt} · +{item.xpReward} XP</span> : <div className="achievement-progress"><ProgressBar value={item.progress} max={item.target} label={`${item.title} progress`} /><div className="achievement-progress-label"><span>{item.progress} of {item.target}</span><span>{Math.round(item.progress / item.target * 100)}%</span></div></div>}
      </Card>)}
    </section>
    {locked.length === 0 && <Card className="empty mt">You've unlocked all available milestones.</Card>}
  </>;
}
