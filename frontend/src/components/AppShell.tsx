import { useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";

const learnerItems = [
  { to: "/", label: "Dashboard", icon: "⌂", end: true },
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

function navClass({ isActive }: { isActive: boolean }) {
  return `nav${isActive ? " active" : ""}`;
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const items = isAdmin ? adminItems : learnerItems;
  const [collapsed, setCollapsed] = useState(false);
  const title = isAdmin ? "Administrator" : "Learner";

  return (
    <div className={`app${collapsed ? " sidebar-collapsed" : ""}`}>
      <aside className="sidebar" aria-label={`${title} navigation`}>
        <NavLink className="brand" to="/"><span className="brand-mark" aria-hidden="true">CT</span><span>CodeTrail</span></NavLink>
        <nav aria-label={`${title} menu`}>
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navClass} title={collapsed ? item.label : undefined}>
              <span className="nav-icon" aria-hidden="true">{item.icon}</span><span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        {!isAdmin && (
          <>
            <h2>Account</h2>
            <nav aria-label="Account menu">
              <NavLink to="/profile" className={navClass}><span className="nav-icon" aria-hidden="true">◎</span><span className="nav-label">Profile &amp; settings</span></NavLink>
              <NavLink to="/admin" className={navClass}><span className="nav-icon" aria-hidden="true">⚙</span><span className="nav-label">Admin preview</span></NavLink>
            </nav>
          </>
        )}
      </aside>
      <div className="main-wrap">
        <header className="topbar">
          <button className="btn btn-outline menu-btn" type="button" aria-label={collapsed ? "Expand navigation" : "Collapse navigation"} aria-expanded={!collapsed} onClick={() => setCollapsed((value) => !value)}>
            <span aria-hidden="true" />
          </button>
          <NavLink className="user" to={isAdmin ? "/admin/users" : "/profile"} aria-label="Open profile">
            <span className="avatar" aria-hidden="true">{isAdmin ? "AD" : "NJ"}</span>
          </NavLink>
        </header>
        <main className="content" id="main">{children}</main>
        <nav className={`mobile-nav${isAdmin ? " admin-mobile-nav" : ""}`} aria-label={`${title} navigation`}>
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} title={item.label}>
              <span className="mobile-nav-icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
