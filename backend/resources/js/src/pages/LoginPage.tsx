import { Link, useForm } from "@inertiajs/react";
import type { FormEvent } from "react";

export function LoginPage() {
  const form = useForm({ email: "", password: "", remember: false });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    form.post("/login", { onFinish: () => form.reset("password") });
  }

  return <div className="auth"><section className="card auth-card">
    <Link className="brand" href="/login"><span className="brand-mark">CT</span>CodeTrail</Link>
    <p className="section-eyebrow">YOUR C LEARNING PATH</p><h1>Welcome back</h1><p className="muted">Sign in to continue learning.</p>
    <form onSubmit={submit}>
      <div className="field"><label htmlFor="login-email">Email</label><input id="login-email" type="email" autoComplete="username" required placeholder="you@example.com" value={form.data.email} onChange={(event) => form.setData("email", event.target.value)} />{form.errors.email && <p className="inline-alert alert-error" role="alert">{form.errors.email}</p>}</div>
      <div className="field"><label htmlFor="login-password">Password</label><input id="login-password" type="password" autoComplete="current-password" required placeholder="Enter your password" value={form.data.password} onChange={(event) => form.setData("password", event.target.value)} />{form.errors.password && <p className="inline-alert alert-error" role="alert">{form.errors.password}</p>}</div>
      <label className="check-row"><input type="checkbox" checked={form.data.remember} onChange={(event) => form.setData("remember", event.target.checked)} /> Remember me</label>
      <button className="btn btn-primary btn-block" type="submit" disabled={form.processing}>{form.processing ? "Signing in…" : "Sign in"}</button>
    </form>
    <p className="small muted mt">New to CodeTrail? <Link href="/dashboard">Explore learning</Link></p>
  </section></div>;
}

export default LoginPage;
