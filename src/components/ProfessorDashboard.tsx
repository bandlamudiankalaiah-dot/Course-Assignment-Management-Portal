import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Users,
  CheckCircle2,
  Clock,
  FileText,
  BarChart3,
  Edit,
  Trash2,
  Eye,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Layers,
} from 'lucide-react';
import type { Course, Assignment, DashboardAnalytics } from '../types.ts';

interface ProfessorDashboardProps {
  courses: Course[];
  assignments: Assignment[];
  analytics: DashboardAnalytics | null;
  onSelectCourse: (course: Course) => void;
  onOpenCreateModal: (courseId?: string) => void;
  onOpenSubmissions: (assignmentId: string) => void;
  onOpenAssignment: (assignmentId: string) => void;
  onDeleteAssignment: (assignmentId: string) => void;
}

export const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({
  courses,
  assignments,
  analytics,
  onSelectCourse,
  onOpenCreateModal,
  onOpenSubmissions,
  onOpenAssignment,
  onDeleteAssignment,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');

  const filteredAssignments = assignments.filter((a) => {
    if (selectedCourseId === 'all') return true;
    return a.courseId === selectedCourseId;
  });

  const totalStudentsEnrolled = courses.reduce((acc, c) => acc + (c.studentCount || 0), 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium backdrop-blur-xs mb-3 border border-indigo-400/30">
              <BookOpen className="w-3.5 h-3.5" />
              Faculty Portal & Instruction Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Professor Curriculum & Submissions Overview
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Manage course syllabi, design individual & group assignments, monitor student progress, and evaluate submissions.
            </p>
          </div>

          <button
            id="btn-create-assignment-header"
            onClick={() => onOpenCreateModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Assignment</span>
          </button>
        </div>

        {/* Analytics row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Courses Taught
            </span>
            <span className="text-2xl font-bold text-white">{courses.length}</span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Enrolled Students
            </span>
            <span className="text-2xl font-bold text-white">{totalStudentsEnrolled}</span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold block">
              Acknowledged Submissions
            </span>
            <span className="text-2xl font-bold text-emerald-400">
              {analytics ? analytics.acknowledgedSubmissions : 4}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-indigo-300 font-semibold block">
              Graded Submissions
            </span>
            <span className="text-2xl font-bold text-indigo-300">
              {analytics ? analytics.gradedSubmissions : 2}
            </span>
          </div>
        </div>
      </div>

      {/* Courses Being Taught Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Courses Being Taught
            </h2>
            <p className="text-xs text-slate-500">
              Overview of active sections, total student counts, and course management.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => {
            const courseAssignments = assignments.filter((a) => a.courseId === course.id);

            return (
              <div
                key={course.id}
                id={`prof-course-card-${course.id}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 flex flex-col justify-between hover:border-indigo-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-mono text-xs font-bold border border-indigo-200">
                      {course.code}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {course.term}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold">{course.studentCount}</span> Students
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold">{courseAssignments.length}</span> Assignments
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    id={`btn-course-create-asg-${course.id}`}
                    onClick={() => onOpenCreateModal(course.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Assignment</span>
                  </button>
                  <button
                    id={`btn-course-view-${course.id}`}
                    onClick={() => onSelectCourse(course)}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    View Syllabus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Assignment Management & Submission Tracking (Section 3.2) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Coursework & Submissions Monitor
            </h2>
            <p className="text-xs text-slate-500">
              Track student & group submissions, verify group leader acknowledgments, and award grades.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-indigo-500"
            >
              <option value="all">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.title.slice(0, 25)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredAssignments.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              No assignments found for the selected course filter.
            </div>
          ) : (
            filteredAssignments.map((assignment) => {
              const deadlineDate = new Date(assignment.deadline);
              const formattedDeadline = deadlineDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={assignment.id}
                  id={`prof-assignment-card-${assignment.id}`}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-indigo-200 transition-all"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {assignment.courseCode}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                          assignment.submissionType === 'group'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {assignment.submissionType === 'group'
                          ? 'Group Assignment (Leader Acknowledged)'
                          : 'Individual Submission'}
                      </span>
                      <span className="text-xs text-slate-500">
                        Max Score: {assignment.totalPoints} pts
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {assignment.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        Due: {formattedDeadline}
                      </span>
                      <span>•</span>
                      <span>Rubric items: {assignment.rubric.length}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    <button
                      id={`btn-monitor-submissions-${assignment.id}`}
                      onClick={() => onOpenSubmissions(assignment.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Track Submissions & Grade</span>
                    </button>

                    <button
                      id={`btn-view-asg-${assignment.id}`}
                      onClick={() => onOpenAssignment(assignment.id)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                      title="View Student Assignment View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      id={`btn-delete-asg-${assignment.id}`}
                      onClick={() => onDeleteAssignment(assignment.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
