import React, { useState, useEffect } from 'react';
import {
  Navbar,
} from './components/Navbar.tsx';
import {
  AuthModal,
} from './components/AuthModal.tsx';
import {
  StudentDashboard,
} from './components/StudentDashboard.tsx';
import {
  ProfessorDashboard,
} from './components/ProfessorDashboard.tsx';
import {
  CourseDetailView,
} from './components/CourseDetailView.tsx';
import {
  AssignmentDetail,
} from './components/AssignmentDetail.tsx';
import {
  ProfessorSubmissionsView,
} from './components/ProfessorSubmissionsView.tsx';
import {
  CreateAssignmentModal,
} from './components/CreateAssignmentModal.tsx';
import {
  DocumentationModal,
} from './components/DocumentationModal.tsx';
import {
  api,
  getStoredToken,
  getStoredUser,
  clearAuthSession,
  setAuthSession,
} from './lib/api.ts';
import type {
  User,
  Course,
  Assignment,
  DashboardAnalytics,
} from './types.ts';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Navigation and View State
  const [currentView, setCurrentView] = useState<'dashboard' | 'course' | 'assignment' | 'submissions'>('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalCourseId, setCreateModalCourseId] = useState<string | undefined>(undefined);
  const [showDocsModal, setShowDocsModal] = useState(false);

  // Data
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);

  // Initialize session
  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();
      if (!token) {
        // Auto-login with default student leader for instantaneous live preview
        try {
          const res = await api.demoLogin('student-leader');
          setAuthSession(res.token, res.user);
          setCurrentUser(res.user);
        } catch {
          setCurrentUser(null);
        }
        setLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        setCurrentUser(res.user);
      } catch (err) {
        clearAuthSession();
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Fetch app data when currentUser changes
  const refreshData = async () => {
    if (!currentUser) return;
    try {
      const [coursesRes, assignmentsRes, analyticsRes] = await Promise.all([
        api.getCourses(),
        api.getAssignments(),
        api.getAnalytics(),
      ]);

      setCourses(coursesRes.courses);
      setAssignments(assignmentsRes.assignments);
      setAnalytics(analyticsRes.analytics);

      // Keep selectedCourse updated if currently viewing it
      if (selectedCourse) {
        const updatedCourse = coursesRes.courses.find((c) => c.id === selectedCourse.id);
        if (updatedCourse) setSelectedCourse(updatedCourse);
      }
    } catch (err) {
      console.error('Failed to load application data', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser?.id, currentUser?.role]);

  const handleLogout = () => {
    clearAuthSession();
    setCurrentUser(null);
    setCurrentView('dashboard');
    setSelectedCourse(null);
    setSelectedAssignmentId(null);
  };

  const handleSwitchDemo = async (roleKey: string) => {
    try {
      setLoading(true);
      const res = await api.demoLogin(roleKey);
      setAuthSession(res.token, res.user);
      setCurrentUser(res.user);
      setCurrentView('dashboard');
      setSelectedCourse(null);
      setSelectedAssignmentId(null);
    } catch (err) {
      console.error('Failed to switch demo user', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
    setSelectedCourse(null);
    setSelectedAssignmentId(null);
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setCurrentView('course');
  };

  const handleSelectAssignment = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    setCurrentView('assignment');
  };

  const handleOpenSubmissions = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    setCurrentView('submissions');
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await api.deleteAssignment(assignmentId);
      refreshData();
      if (selectedAssignmentId === assignmentId) {
        setCurrentView('dashboard');
        setSelectedAssignmentId(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete assignment');
    }
  };

  const handleCreateAssignmentSuccess = (newAssignment: Assignment) => {
    setShowCreateModal(false);
    refreshData();
    setSelectedAssignmentId(newAssignment.id);
    setCurrentView('assignment');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-xs font-semibold text-slate-600">Initializing Academic Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Bar */}
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        onSwitchDemo={handleSwitchDemo}
        onOpenDocs={() => setShowDocsModal(true)}
        currentView={currentView}
        onNavigateHome={() => {
          setCurrentView('dashboard');
          setSelectedCourse(null);
          setSelectedAssignmentId(null);
        }}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!currentUser ? (
          <AuthModal
            onSuccess={handleAuthSuccess}
            onOpenDocs={() => setShowDocsModal(true)}
          />
        ) : (
          <>
            {/* View 1: Dashboard (Student or Professor) */}
            {currentView === 'dashboard' && (
              currentUser.role === 'professor' ? (
                <ProfessorDashboard
                  courses={courses}
                  assignments={assignments}
                  analytics={analytics}
                  onSelectCourse={handleSelectCourse}
                  onOpenCreateModal={(courseId) => {
                    setCreateModalCourseId(courseId);
                    setShowCreateModal(true);
                  }}
                  onOpenSubmissions={handleOpenSubmissions}
                  onOpenAssignment={handleSelectAssignment}
                  onDeleteAssignment={handleDeleteAssignment}
                />
              ) : (
                <StudentDashboard
                  courses={courses}
                  assignments={assignments}
                  analytics={analytics}
                  onSelectCourse={handleSelectCourse}
                  onSelectAssignment={handleSelectAssignment}
                  currentUserId={currentUser.id}
                />
              )
            )}

            {/* View 2: Course Assignment / Syllabus Page */}
            {currentView === 'course' && selectedCourse && (
              <CourseDetailView
                course={selectedCourse}
                assignments={assignments.filter((a) => a.courseId === selectedCourse.id)}
                currentUser={currentUser}
                onBack={() => {
                  setCurrentView('dashboard');
                  setSelectedCourse(null);
                }}
                onSelectAssignment={handleSelectAssignment}
                onOpenCreateAssignment={() => {
                  setCreateModalCourseId(selectedCourse.id);
                  setShowCreateModal(true);
                }}
                onOpenSubmissions={handleOpenSubmissions}
              />
            )}

            {/* View 3: Assignment Detail & Submission Page (Section 1.3 & 1.4) */}
            {currentView === 'assignment' && selectedAssignmentId && (
              <AssignmentDetail
                assignmentId={selectedAssignmentId}
                currentUser={currentUser}
                onBack={() => {
                  if (selectedCourse) {
                    setCurrentView('course');
                  } else {
                    setCurrentView('dashboard');
                  }
                  setSelectedAssignmentId(null);
                }}
              />
            )}

            {/* View 4: Professor Submissions & Grading View (Section 3.2) */}
            {currentView === 'submissions' && selectedAssignmentId && (
              <ProfessorSubmissionsView
                assignmentId={selectedAssignmentId}
                currentUser={currentUser}
                onBack={() => {
                  if (selectedCourse) {
                    setCurrentView('course');
                  } else {
                    setCurrentView('dashboard');
                  }
                  setSelectedAssignmentId(null);
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            AcademiaFlow &bull; Academic Course &amp; Assignment Portal (Task -2 Solution)
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowDocsModal(true)}
              className="hover:text-indigo-600 font-medium transition-colors"
            >
              Architecture &amp; Documentation (README)
            </button>
            <span>&bull;</span>
            <span className="font-mono text-[11px] text-slate-400">React 19 &bull; Express &bull; JWT</span>
          </div>
        </div>
      </footer>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <CreateAssignmentModal
          courses={courses}
          defaultCourseId={createModalCourseId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateAssignmentSuccess}
        />
      )}

      {/* Documentation & Architecture Modal */}
      {showDocsModal && (
        <DocumentationModal onClose={() => setShowDocsModal(false)} />
      )}
    </div>
  );
}
