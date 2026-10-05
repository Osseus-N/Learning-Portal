import { useState, type ReactNode } from "react";
import { Link, usePage } from "@inertiajs/react";

const learnerItems = [
  { to: "/dashboard", label: "Dashboard", icon: "⌂", end: true },
  { to: "/courses", label: "Course catalog", icon: "▤" },
  { to: "/challenges", label: "Daily challenges", icon: "✦" },
  { to: "/progress", label: "My progress", icon: "◌" },
  { to: "/achievements", label: "Achievements", icon: "★" },
];

const adminItems = [
  { to: "/admin", label: "Overview", icon: "⌂", end: true },
  { to: "/admin/courses", label: "Course management", icon: "▤" },
  { to: "/admin/users", label: "User management", icon: "◎" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { url } = usePage();
  const pathname = url.split(/[?#]/, 1)[0];
  const isAdmin = pathname.startsWith("/admin");
  const items = isAdmin ? adminItems : learnerItems;
  const [collapsed, setCollapsed] = useState(false);
  const title = isAdmin ? "Administrator" : "Learner";
  const isActive = (to: string, end = false) =>
    end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  if (pathname === "/login") return children;

  return (
    <div className={`app${collapsed ? " sidebar-collapsed" : ""}`}>
      <aside className="sidebar" aria-label={`${title} navigation`}>
        <Link className="brand" href="/dashboard"><span className="brand-mark" aria-hidden="true">CT</span><span>CodeTrail</span></Link>
        <nav aria-label={`${title} menu`}>
          {items.map((item) => (
            <Link key={item.to} href={item.to} className={`nav${isActive(item.to, item.end) ? " active" : ""}`} aria-current={isActive(item.to, item.end) ? "page" : undefined} title={collapsed ? item.label : undefined}>
              <span className="nav-icon" aria-hidden="true">{item.icon}</span><span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        {!isAdmin && (
          <>
            <h2>Account</h2>
            <nav aria-label="Account menu">
              <Link href="/profile" className={`nav${isActive("/profile") ? " active" : ""}`} aria-current={isActive("/profile") ? "page" : undefined}><span className="nav-icon" aria-hidden="true">◎</span><span className="nav-label">Profile &amp; settings</span></Link>
              <Link href="/admin" className={`nav${isActive("/admin") ? " active" : ""}`} aria-current={isActive("/admin") ? "page" : undefined}><span className="nav-icon" aria-hidden="true">⚙</span><span className="nav-label">Admin preview</span></Link>
            </nav>
          </>
        )}
      </aside>
      <div className="main-wrap">
        <header className="topbar">
          <button className="btn btn-outline menu-btn" type="button" aria-label={collapsed ? "Expand navigation" : "Collapse navigation"} aria-expanded={!collapsed} onClick={() => setCollapsed((value) => !value)}>
            <span aria-hidden="true" />
          </button>
          <Link className="user" href={isAdmin ? "/admin/users" : "/profile"} aria-label="Open profile">
            <span className="avatar" aria-hidden="true">{isAdmin ? "AD" : "NJ"}</span>
          </Link>
        </header>
        <main className="content" id="main">{children}</main>
        <nav className={`mobile-nav${isAdmin ? " admin-mobile-nav" : ""}`} aria-label={`${title} navigation`}>
          {items.map((item) => (
            <Link key={item.to} href={item.to} aria-current={isActive(item.to, item.end) ? "page" : undefined} title={item.label}>
              <span className="mobile-nav-icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
