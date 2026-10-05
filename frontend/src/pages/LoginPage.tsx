import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout, EMAIL_PATTERN } from "../components/AuthLayout";
import { authService } from "../services/authService";

type FieldErrors = { email?: string; password?: string };

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Enter a valid email, like you@example.com.";
  if (!password) errors.password = "Enter your password.";
  else if (password.length < 6) errors.password = "Password must be at least 6 characters.";
  return errors;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(email, password);
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;
    setSubmitting(true);
    // Demo auth: replace with a real auth service call when the backend is ready.
    await new Promise((resolve) => setTimeout(resolve, 600));
    authService.signIn(email.trim(), remember);
    navigate("/", { replace: true });
  }

  return (
    <AuthLayout eyebrow="WELCOME BACK" title="Sign in" description="Continue where you left off." titleId="login-title">
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "login-email-error" : undefined}
          />
          {errors.email && <p className="error-text" id="login-email-error">{errors.email}</p>}
        </div>

        <div className="field">
          <div className="row between login-label-row">
            <label htmlFor="login-password">Password</label>
            <a className="small" href="#" onClick={(event) => event.preventDefault()}>Forgot password?</a>
          </div>
          <div className="password-input">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? "login-password-error" : undefined}
            />
            <button className="password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} aria-pressed={showPassword} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <p className="error-text" id="login-password-error">{errors.password}</p>}
        </div>

        <label className="check-row login-remember">
          <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
          <span className="small">Keep me signed in</span>
        </label>

        <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="small muted mt mb-0 login-footnote">New to CodeTrail? <Link to="/register">Create an account</Link></p>
    </AuthLayout>
  );
}
