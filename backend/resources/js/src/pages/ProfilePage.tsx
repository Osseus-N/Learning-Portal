import { useForm, usePage } from "@inertiajs/react";
import { Card, PageHeader } from "../components/UI";

export function ProfilePage() {
  const { auth, flash } = usePage().props as {
    auth: { user: { name: string; email: string } };
    flash: { success?: string };
  };
  const form = useForm({ name: auth.user.name, email: auth.user.email });

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    form.put("/user/profile-information", { preserveScroll: true });
  }

  const initials = auth.user.name.split(/\s+/).map((part) => part[0]).join("");

  return <>
    <PageHeader title="Profile & settings" description="Update your learner details." />
    <div className="grid g-2 profile-grid">
      <Card className="profile-summary panel-periwinkle"><div className="player-avatar">{initials}</div><h2>{auth.user.name}</h2><p>CodeTrail learner</p><strong>{auth.user.email}</strong></Card>
      <Card><p className="section-eyebrow">PERSONAL DETAILS</p><h2>Account information</h2>
        <form onSubmit={save}>
          <div className="field"><label htmlFor="profile-name">Full name</label><input id="profile-name" name="name" value={form.data.name} onChange={(event) => form.setData("name", event.target.value)} required minLength={2} />{form.errors.name && <p className="inline-alert alert-error" role="alert">{form.errors.name}</p>}</div>
          <div className="field"><label htmlFor="profile-email">Email</label><input id="profile-email" name="email" type="email" value={form.data.email} onChange={(event) => form.setData("email", event.target.value)} required />{form.errors.email && <p className="inline-alert alert-error" role="alert">{form.errors.email}</p>}</div>
          {flash.success && <p className="inline-alert alert-success" role="status">{flash.success}</p>}
          <button className="btn btn-primary" type="submit" disabled={form.processing}>{form.processing ? "Saving…" : "Save profile"}</button>
        </form>
      </Card>
    </div>
    <Card className="mt"><div className="row between"><div><p className="section-eyebrow">LEARNING PREFERENCES</p><h2>Practice reminders</h2><p className="muted mb-0">Reminder settings will sync when your account service is connected.</p></div><label className="check-row"><input type="checkbox" defaultChecked /> Daily reminder</label></div></Card>
  </>;
}

export default ProfilePage;
