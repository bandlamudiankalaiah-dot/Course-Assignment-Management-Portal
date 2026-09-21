import React from 'react';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Users,
  User,
  Plus,
  FileText,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';
import type { Course, Assignment, User as UserType } from '../types.ts';

interface CourseDetailViewProps {
  course: Course;
  assignments: Assignment[];
  currentUser: UserType;
  onBack: () => void;
  onSelectAssignment: (assignmentId: string) => void;
  onOpenCreateAssignment: () => void;
  onOpenSubmissions: (assignmentId: string) => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  course,
  assignments,
  currentUser,
  onBack,
  onSelectAssignment,
  onOpenCreateAssignment,
  onOpenSubmissions,
}) => {
  const isProfessor = currentUser.role === 'professor';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Back button */}
      <div>
        <button
          id="btn-back-from-course"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Course Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                {course.code}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {course.term} • {course.credits} Credits • {course.department}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {course.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {course.description}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 shrink-0 space-y-2 text-xs min-w-[220px]">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Instructor</span>
                <span className="font-bold text-slate-900">{course.professorName}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-slate-600">
              <span>Class Size:</span>
              <span className="font-bold text-slate-900">{course.studentCount} Enrolled</span>
            </div>
          </div>
        </div>

        {/* Action Row for Professor */}
        {isProfessor && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              You are the designated instructor for this course.
            </span>
            <button
              id="btn-course-create-new-asg"
              onClick={onOpenCreateAssignment}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Assignment for {course.code}</span>
            </button>
          </div>
        )}
      </div>

      {/* Course Assignments List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Course Assignments ({assignments.length})
            </h2>
            <p className="text-xs text-slate-500">
              {isProfessor
                ? 'Select an assignment to monitor submissions, verify group leader acknowledgments, or award grades.'
                : 'Click an assignment to view full instructions, submit code, or check group progress.'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {assignments.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              No assignments posted for this course yet.
            </div>
          ) : (
            assignments.map((assignment) => {
              const isGroup = assignment.submissionType === 'group';
              const formattedDeadline = new Date(assignment.deadline).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={assignment.id}
                  id={`course-asg-row-${assignment.id}`}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
                >
                  <div
                    onClick={() => onSelectAssignment(assignment.id)}
                    className="space-y-1.5 flex-1 cursor-pointer"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                          isGroup
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {isGroup ? 'Group Deliverable' : 'Individual Task'}
                      </span>
                      <span className="text-xs text-slate-500">
                        {assignment.totalPoints} Points
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {assignment.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {assignment.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Due Date
                      </span>
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 md:justify-end">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        {formattedDeadline}
                      </span>
                    </div>

                    {isProfessor ? (
                      <button
                        id={`btn-course-asg-track-${assignment.id}`}
                        onClick={() => onOpenSubmissions(assignment.id)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors"
                      >
                        Track & Grade
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectAssignment(assignment.id)}
                        className="p-2 rounded-xl bg-slate-50 group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-600 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
