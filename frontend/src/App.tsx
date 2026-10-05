import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { AchievementsPage } from "./pages/AchievementsPage";
import { AdminPage } from "./pages/AdminPage";
import { ChallengesPage } from "./pages/ChallengesPage";
import { CourseDetailPage, CoursesPage } from "./pages/CoursesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LessonPage } from "./pages/LessonPage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProgressPage } from "./pages/ProgressPage";
import { RegisterPage } from "./pages/RegisterPage";
import { authService } from "./services/authService";
import { Card } from "./components/UI";

function NotFoundPage() {
  return <Card className="empty"><h1>Page not found</h1><p>That learning page is not available.</p><a className="btn btn-primary" href="/">Go to dashboard</a></Card>;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
        <Route path="*" element={<RequireAuth><ShellRoutes /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}
function RequireAuth({ children }: { children: ReactNode }) {
  return authService.isSignedIn() ? children : <Navigate to="/login" replace />;
}

function GuestOnly({ children }: { children: ReactNode }) {
  return authService.isSignedIn() ? <Navigate to="/" replace /> : children;
}

function ShellRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/courses" element={<AdminPage />} />
        <Route path="/admin/users" element={<AdminPage />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}
