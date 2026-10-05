import { useState } from "react";
import { Link } from "react-router-dom";

export function LoginPage() {
  const [submitted, setSubmitted] = useState(false);
  return <div className="auth"><section className="card auth-card">
    <a className="brand" href="/"><span className="brand-mark">CT</span>CodeTrail</a>
    <p className="section-eyebrow">YOUR C LEARNING PATH</p><h1>Welcome back</h1><p className="muted">Sign in to continue learning.</p>
    <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
      <div className="field"><label htmlFor="login-email">Email</label><input id="login-email" type="email" required placeholder="you@example.com" /></div>
      <div className="field"><label htmlFor="login-password">Password</label><input id="login-password" type="password" required minLength={6} placeholder="Enter your password" /></div>
      {submitted && <p className="inline-alert alert-warn" role="status">Authentication is a demo. Continue to the dashboard.</p>}
      <button className="btn btn-primary btn-block" type="submit">Sign in</button>
    </form>
    <p className="small muted mt">New to CodeTrail? <Link to="/">Explore learning</Link></p>
  </section></div>;
}
