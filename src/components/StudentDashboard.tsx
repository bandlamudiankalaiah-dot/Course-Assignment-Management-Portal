import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  User,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Search,
  Filter,
  Layers,
  ChevronRight,
  Award,
} from 'lucide-react';
import type { Course, Assignment, Submission, DashboardAnalytics } from '../types.ts';

interface StudentDashboardProps {
  courses: Course[];
  assignments: Assignment[];
  analytics: DashboardAnalytics | null;
  onSelectCourse: (course: Course) => void;
  onSelectAssignment: (assignmentId: string) => void;
  currentUserId: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  courses,
  assignments,
  analytics,
  onSelectCourse,
  onSelectAssignment,
  currentUserId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'individual' | 'group'>('all');

  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || a.submissionType === selectedType;
    return matchesSearch && matchesType;
  });

  const getThemeClasses = (color: string) => {
    switch (color) {
      case 'indigo':
        return {
          banner: 'from-indigo-600 to-indigo-800',
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          bar: 'bg-indigo-600',
          border: 'hover:border-indigo-300',
        };
      case 'emerald':
        return {
          banner: 'from-emerald-600 to-teal-800',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          bar: 'bg-emerald-600',
          border: 'hover:border-emerald-300',
        };
      case 'amber':
        return {
          banner: 'from-amber-600 to-orange-800',
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
          bar: 'bg-amber-600',
          border: 'hover:border-amber-300',
        };
      default:
        return {
          banner: 'from-slate-700 to-slate-900',
          badge: 'bg-slate-50 text-slate-700 border-slate-200',
          bar: 'bg-slate-700',
          border: 'hover:border-slate-300',
        };
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner & Metrics Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Abstract background graphics */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-medium backdrop-blur-xs mb-3 border border-white/10">
              <GraduationCap className="w-3.5 h-3.5" />
              Student Academic Overview
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              My Enrolled Courses & Assignments
            </h1>
            <p className="text-sm text-indigo-200 mt-1 max-w-xl">
              Track course deliverables, collaborate in group tasks, and manage leader acknowledgments.
            </p>
          </div>

          {/* KPI Mini Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] uppercase tracking-wider text-indigo-200 font-semibold block">
                Courses
              </span>
              <span className="text-xl font-bold text-white">
                {analytics ? analytics.totalCourses : courses.length}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] uppercase tracking-wider text-indigo-200 font-semibold block">
                Active Tasks
              </span>
              <span className="text-xl font-bold text-white">
                {analytics ? analytics.totalAssignments : assignments.length}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold block">
                Acknowledged
              </span>
              <span className="text-xl font-bold text-emerald-300">
                {analytics ? analytics.acknowledgedSubmissions : 2}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold block">
                Completion
              </span>
              <span className="text-xl font-bold text-amber-300">
                {analytics ? `${analytics.completionRate}%` : '67%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Section (Section 1.2: clickable cards in grid) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Enrolled Courses
            </h2>
            <p className="text-xs text-slate-500">
              Click on any course card to inspect its syllabus and specific assignments.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
            {courses.length} Active Courses
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => {
            const theme = getThemeClasses(course.colorTheme);
            const courseAssignments = assignments.filter((a) => a.courseId === course.id);
            const groupAssignmentsCount = courseAssignments.filter((a) => a.submissionType === 'group').length;

            return (
              <div
                key={course.id}
                id={`course-card-${course.id}`}
                onClick={() => onSelectCourse(course)}
                className={`bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden group ${theme.border}`}
              >
                <div>
                  {/* Card Header Banner */}
                  <div className={`h-24 bg-gradient-to-tr ${theme.banner} p-4 flex flex-col justify-between relative`}>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-white/20 text-white font-mono text-xs font-bold backdrop-blur-xs">
                        {course.code}
                      </span>
                      <span className="text-[11px] text-white/90 font-medium bg-black/20 px-2 py-0.5 rounded">
                        {course.term} • {course.credits} Credits
                      </span>
                    </div>
                    <div className="text-white font-bold text-base line-clamp-1 group-hover:translate-x-0.5 transition-transform">
                      {course.title}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[140px] font-medium text-slate-700">
                          {course.professorName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.studentCount} Students</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer & Action */}
                <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">
                      {courseAssignments.length} Assignments
                    </span>
                    {groupAssignmentsCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {groupAssignmentsCount} Group
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Open Course</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Assignments & Submissions Feed */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              All Assigned Coursework
            </h2>
            <p className="text-xs text-slate-500">
              Select any assignment to review guidelines, submit work, or check leader acknowledgment.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search assignments..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl w-48 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/70 text-xs">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedType === 'all' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedType('individual')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedType === 'individual' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                }`}
              >
                Individual
              </button>
              <button
                onClick={() => setSelectedType('group')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedType === 'group' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                }`}
              >
                Group
              </button>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-3">
          {filteredAssignments.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              No assignments found matching the criteria.
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

              // Check if group assignment
              const isGroup = assignment.submissionType === 'group';

              return (
                <div
                  key={assignment.id}
                  id={`assignment-row-${assignment.id}`}
                  onClick={() => onSelectAssignment(assignment.id)}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {assignment.courseCode}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                          isGroup
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {isGroup ? 'Group Assignment' : 'Individual Submission'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {assignment.totalPoints} Points Max
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {assignment.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {assignment.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Deadline
                      </span>
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 sm:justify-end">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        {formattedDeadline}
                      </span>
                    </div>

                    <button className="p-2 rounded-xl bg-slate-50 group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-600 transition-colors">
                      <ChevronRight className="w-4 h-4" />
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
