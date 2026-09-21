import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Award,
  Users,
  User,
  Shield,
  Loader2,
  FileText,
  AlertCircle,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { api } from '../lib/api.ts';
import type { Assignment, AssignmentGroup, Submission, User as UserType } from '../types.ts';

interface ProfessorSubmissionsViewProps {
  assignmentId: string;
  currentUser: UserType;
  onBack: () => void;
}

export const ProfessorSubmissionsView: React.FC<ProfessorSubmissionsViewProps> = ({
  assignmentId,
  currentUser,
  onBack,
}) => {
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [groups, setGroups] = useState<AssignmentGroup[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'acknowledged' | 'graded'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Grading Modal
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradePoints, setGradePoints] = useState<number>(90);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [savingGrade, setSavingGrade] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const details = await api.getAssignmentDetails(assignmentId);
      setAssignment(details.assignment);

      const subsData = await api.getSubmissionsForAssignment(assignmentId);
      setSubmissions(subsData.submissions);
      setGroups(subsData.groups);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [assignmentId]);

  const handleOpenGradeModal = (sub: Submission) => {
    setGradingSubmission(sub);
    setGradePoints(sub.gradePoints ?? (assignment?.totalPoints ? Math.round(assignment.totalPoints * 0.9) : 90));
    setFeedbackNotes(sub.feedbackNotes || '');
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    setSavingGrade(true);
    setError(null);
    try {
      const res = await api.gradeSubmission(gradingSubmission.id, {
        gradePoints: Number(gradePoints),
        feedbackNotes: feedbackNotes.trim(),
      });

      // Update in local state
      setSubmissions((prev) =>
        prev.map((s) => (s.id === res.submission.id ? res.submission : s))
      );
      setGradingSubmission(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save grade.');
    } finally {
      setSavingGrade(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-500 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-xs font-medium">Loading submissions and group rosters...</p>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-600 text-xs">
        Assignment not found.
        <button onClick={onBack} className="mt-3 block mx-auto text-indigo-600 font-semibold">
          Back
        </button>
      </div>
    );
  }

  const isGroup = assignment.submissionType === 'group';

  // Filter submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const nameToMatch = (sub.groupName || sub.studentName || '').toLowerCase();
    const matchesSearch = nameToMatch.includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const acknowledgedCount = submissions.filter((s) => s.status === 'acknowledged').length;
  const gradedCount = submissions.filter((s) => s.status === 'graded').length;
  const pendingCount = submissions.filter((s) => s.status === 'submitted').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Back button & Assignment Meta */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-from-submissions"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Curriculum Dashboard</span>
        </button>

        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
          {assignment.courseCode}
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-indigo-600">
                {assignment.courseTitle}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                {isGroup ? 'Group Evaluation' : 'Individual Evaluation'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Submissions Tracker: {assignment.title}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor individual & group submissions, verify group leader acknowledgments, and input grading evaluations.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 text-xs">
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
              <span className="font-bold text-slate-800">{submissions.length}</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-amber-500 block">Unacknowledged</span>
              <span className="font-bold text-amber-700">{pendingCount}</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-emerald-500 block">Acknowledged</span>
              <span className="font-bold text-emerald-700">{acknowledgedCount}</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-indigo-500 block">Graded</span>
              <span className="font-bold text-indigo-700">{gradedCount}</span>
            </div>
          </div>
        </div>

        {/* Filter controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isGroup ? 'Search group name...' : 'Search student...'}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl w-56 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex rounded-xl bg-slate-100 p-1 text-xs">
            <button
              id="filter-all"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'all' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500'
              }`}
            >
              All ({submissions.length})
            </button>
            <button
              id="filter-submitted"
              onClick={() => setStatusFilter('submitted')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'submitted' ? 'bg-white shadow-xs text-amber-800 font-bold' : 'text-slate-500'
              }`}
            >
              Unconfirmed ({pendingCount})
            </button>
            <button
              id="filter-acknowledged"
              onClick={() => setStatusFilter('acknowledged')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'acknowledged' ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'text-slate-500'
              }`}
            >
              Acknowledged ({acknowledgedCount})
            </button>
            <button
              id="filter-graded"
              onClick={() => setStatusFilter('graded')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'graded' ? 'bg-white shadow-xs text-indigo-800 font-bold' : 'text-slate-500'
              }`}
            >
              Graded ({gradedCount})
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Submissions Cards */}
      <div className="space-y-3">
        {filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No submissions found matching the criteria.
          </div>
        ) : (
          filteredSubmissions.map((sub) => {
            const isAcknowledged = sub.status === 'acknowledged' || sub.status === 'graded';
            const isGraded = sub.status === 'graded';

            return (
              <div
                key={sub.id}
                id={`submission-row-${sub.id}`}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-200 transition-all space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      {isGroup ? <Users className="w-5 h-5 text-purple-600" /> : <User className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {isGroup ? sub.groupName : sub.studentName}
                        </h3>
                        {isGroup && sub.leaderName && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                            Leader: {sub.leaderName}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        Submitted by <span className="font-medium text-slate-700">{sub.submittedByUserName}</span> on{' '}
                        {new Date(sub.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className="flex items-center gap-3 justify-between md:justify-end">
                    <div className="text-right">
                      {sub.status === 'submitted' && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Awaiting Leader Acknowledgment
                        </span>
                      )}
                      {sub.status === 'acknowledged' && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Leader Acknowledged
                        </span>
                      )}
                      {sub.status === 'graded' && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 inline-flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-indigo-600" />
                          Graded: {sub.gradePoints} / {assignment.totalPoints}
                        </span>
                      )}
                    </div>

                    <button
                      id={`btn-grade-${sub.id}`}
                      onClick={() => handleOpenGradeModal(sub)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      {isGraded ? 'Update Grade' : 'Grade & Feedback'}
                    </button>
                  </div>
                </div>

                {/* Submission Content & Links */}
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 text-xs space-y-2">
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {sub.submissionText}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {sub.repositoryUrl && (
                      <a
                        href={sub.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-semibold"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Source Repository</span>
                      </a>
                    )}
                    {sub.fileAttachmentName && (
                      <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                        <FileText className="w-3 h-3 text-slate-400" />
                        <span>{sub.fileAttachmentName}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Acknowledgment metadata indicator */}
                {isAcknowledged && (
                  <div className="text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Confirmed by {sub.acknowledgedByUserName} on{' '}
                      {sub.acknowledgedAt ? new Date(sub.acknowledgedAt).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                )}

                {/* Existing Grade Note */}
                {isGraded && sub.feedbackNotes && (
                  <div className="p-3 rounded-xl bg-indigo-50/40 border border-indigo-100 text-xs text-indigo-900">
                    <span className="font-bold text-[11px] block text-indigo-700">Professor Feedback:</span>
                    <p className="mt-0.5 leading-relaxed">{sub.feedbackNotes}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Grading Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Evaluation Form
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Grade Submission: {isGroup ? gradingSubmission.groupName : gradingSubmission.studentName}
                </h3>
              </div>
              <button
                onClick={() => setGradingSubmission(null)}
                className="text-slate-400 hover:text-slate-600 p-1 text-base font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Grade Awarded (Max: {assignment.totalPoints} pts)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="input-grade-points"
                    type="number"
                    min="0"
                    max={assignment.totalPoints}
                    required
                    value={gradePoints}
                    onChange={(e) => setGradePoints(Number(e.target.value))}
                    className="w-32 px-3 py-2 text-sm font-bold border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                  <span className="text-xs font-semibold text-slate-500">
                    / {assignment.totalPoints} points ({Math.round((gradePoints / assignment.totalPoints) * 100)}%)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Constructive Feedback & Notes
                </label>
                <textarea
                  id="input-feedback-notes"
                  rows={4}
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="Detail strengths, technical precision, code architecture, and areas for improvement..."
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-grade"
                  type="submit"
                  disabled={savingGrade}
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {savingGrade ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-3.5 h-3.5" />
                      <span>Finalize & Publish Grade</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
