import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute, AdminRoute } from './components/layout/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { FeaturesPage } from './pages/FeaturesPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LearnPage } from './pages/LearnPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { TrainingPage } from './pages/TrainingPage';
import { MentorsPage } from './pages/MentorsPage';
import { SchemesPage } from './pages/SchemesPage';
import { CommunityPage } from './pages/CommunityPage';
import { AssistantPage } from './pages/AssistantPage';

// Authenticated Pages
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { NotificationsPage } from './pages/NotificationsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminMentorsPage } from './pages/admin/AdminMentorsPage';
import { AdminTrainingPage } from './pages/admin/AdminTrainingPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminLessonsPage } from './pages/admin/AdminLessonsPage';
import { AdminSchemesPage } from './pages/admin/AdminSchemesPage';
import { AdminKnowledgeBasePage } from './pages/admin/AdminKnowledgeBasePage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-amber-50/20 text-slate-800 selection:bg-brand-100 selection:text-brand-900">
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/mentors" element={<MentorsPage />} />
            <Route path="/schemes" element={<SchemesPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificates"
              element={
                <ProtectedRoute>
                  <CertificatesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificates/:id"
              element={
                <ProtectedRoute>
                  <CertificatesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsersPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/mentors"
              element={
                <AdminRoute>
                  <AdminMentorsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/training"
              element={
                <AdminRoute>
                  <AdminTrainingPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <AdminRoute>
                  <AdminCoursesPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/lessons"
              element={
                <AdminRoute>
                  <AdminLessonsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/videos"
              element={
                <AdminRoute>
                  <AdminLessonsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/schemes"
              element={
                <AdminRoute>
                  <AdminSchemesPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/knowledge-base"
              element={
                <AdminRoute>
                  <AdminKnowledgeBasePage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <AdminRoute>
                  <AdminNotificationsPage />
                </AdminRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
