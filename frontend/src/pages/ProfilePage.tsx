import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAsync } from "../hooks/useAsync";
import { relationalService } from "../services/relationalService";
import type { LearnerProfileRow } from "../types";
import { Card, LoadState, PageHeader } from "../components/UI";

export function ProfilePage() {
  const state = useAsync(() => relationalService.getProfile("learner-noor"), []);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [savedProfile, setSavedProfile] = useState<LearnerProfileRow | null>(null);
  const navigate = useNavigate();

  function signOut() {
    authService.signOut();
    navigate("/login", { replace: true });
  }

  if (state.status !== "success") return <LoadState state={state.status} error={state.status === "error" ? state.error : undefined} />;
  const profile = savedProfile ?? state.data;
  if (!profile) return <Card className="inline-alert alert-error">Your profile could not be found.</Card>;
  const currentProfile = profile;

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("fullName") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    try {
      const updatedProfile = await relationalService.updateProfile(currentProfile.id, { fullName, email });
      setSavedProfile(updatedProfile);
      setMessage("Profile saved.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save profile.");
    }
  }

  return <>
    <PageHeader title="Profile & settings" description="Update your learner details." />
    <div className="grid g-2 profile-grid">
      <Card className="profile-summary panel-periwinkle"><div className="player-avatar">{profile.fullName.split(" ").map((word) => word[0]).join("")}</div><h2>{profile.fullName}</h2><p>{profile.title} · Level {profile.level}</p><strong>{profile.email}</strong></Card>
      <Card><p className="section-eyebrow">PERSONAL DETAILS</p><h2>Account information</h2>
        <form onSubmit={save}>
          <div className="field"><label htmlFor="profile-name">Full name</label><input id="profile-name" name="fullName" defaultValue={profile.fullName} required minLength={2} /></div>
          <div className="field"><label htmlFor="profile-email">Email</label><input id="profile-email" name="email" type="email" defaultValue={profile.email} required /></div>
          {message && <p className="inline-alert alert-success" role="status">{message}</p>}
          {error && <p className="inline-alert alert-error" role="alert">{error}</p>}
          <button className="btn btn-primary" type="submit">Save profile</button>
        </form>
      </Card>
    </div>
    <Card className="mt"><div className="row between"><div><p className="section-eyebrow">LEARNING PREFERENCES</p><h2>Practice reminders</h2><p className="muted mb-0">Reminder settings will sync when your account service is connected.</p></div><label className="check-row"><input type="checkbox" defaultChecked /> Daily reminder</label></div></Card>
    <Card className="mt"><div className="row between"><div><p className="section-eyebrow">SESSION</p><h2>Sign out</h2><p className="muted mb-0">Sign out of CodeTrail on this device.</p></div><button className="btn btn-danger" type="button" onClick={signOut}>Sign out</button></div></Card>
  </>;
}
