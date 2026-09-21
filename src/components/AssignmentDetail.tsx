import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  Shield,
  Crown,
  ExternalLink,
  Upload,
  Sparkles,
  Send,
  Loader2,
  Award,
  BookOpen,
  Info,
  Check,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../lib/api.ts';
import type { Assignment, AssignmentGroup, Submission, User } from '../types.ts';

interface AssignmentDetailProps {
  assignmentId: string;
  currentUser: User;
  onBack: () => void;
}

export const AssignmentDetail: React.FC<AssignmentDetailProps> = ({
  assignmentId,
  currentUser,
  onBack,
}) => {
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [group, setGroup] = useState<AssignmentGroup | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Submission form fields
  const [submissionText, setSubmissionText] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [fileAttachmentName, setFileAttachmentName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [acknowledging, setAcknowledging] = useState(false);
  const [isEditingSubmission, setIsEditingSubmission] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAssignmentDetails(assignmentId);
      setAssignment(res.assignment);
      setGroup(res.group || null);
      setSubmission(res.submission || null);

      if (res.submission) {
        setSubmissionText(res.submission.submissionText || '');
        setRepositoryUrl(res.submission.repositoryUrl || '');
        setFileAttachmentName(res.submission.fileAttachmentName || '');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load assignment details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [assignmentId, currentUser.id]);

  // Trigger celebratory confetti on acknowledgment or completion
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch {
      // safe fallback if canvas is restricted
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim() && !repositoryUrl.trim() && !fileAttachmentName.trim()) {
      setError('Please provide project notes, repository URL, or a deliverable name.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await api.submitAssignment(assignmentId, {
        submissionText: submissionText.trim(),
        repositoryUrl: repositoryUrl.trim() || undefined,
        fileAttachmentName: fileAttachmentName.trim() || 'Project_Deliverables.pdf',
        fileAttachmentSize: '2.4 MB',
      });
      setSubmission(res.submission);
      setIsEditingSubmission(false);
      setSuccessMessage('Deliverables submitted successfully! Ready for acknowledgment.');
      triggerCelebration();
    } catch (err: any) {
      setError(err.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcknowledge = async () => {
    if (!submission) return;

    setAcknowledging(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await api.acknowledgeSubmission(submission.id);
      setSubmission(res.submission);
      setSuccessMessage(
        assignment?.submissionType === 'group'
          ? 'Group submission officially acknowledged! All team members and the professor have been updated.'
          : 'Your submission has been formally acknowledged!'
      );
      triggerCelebration();
    } catch (err: any) {
      setError(err.message || 'Failed to acknowledge submission.');
    } finally {
      setAcknowledging(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-500 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-xs font-medium">Loading assignment specifications...</p>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-600 text-xs">
        Assignment not found.
        <button
          onClick={onBack}
          className="mt-3 block mx-auto text-indigo-600 font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isGroup = assignment.submissionType === 'group';
  const isLeader = isGroup && group ? group.leaderId === currentUser.id : false;
  const isStudent = currentUser.role === 'student';

  const deadlineDate = new Date(assignment.deadline);
  const isOverdue = deadlineDate.getTime() < Date.now();
  const formattedDeadline = deadlineDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate progress percentage for Section 1.4 visualization
  let progressPercentage = 0;
  let statusBadge = {
    label: 'Not Started',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  if (submission) {
    if (submission.status === 'submitted') {
      progressPercentage = 50;
      statusBadge = {
        label: isGroup ? 'Submitted (Awaiting Leader Acknowledgment)' : 'Submitted (Unconfirmed)',
        color: 'bg-amber-50 text-amber-800 border-amber-200',
      };
    } else if (submission.status === 'acknowledged') {
      progressPercentage = 80;
      statusBadge = {
        label: 'Acknowledged & Finalized',
        color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      };
    } else if (submission.status === 'graded') {
      progressPercentage = 100;
      statusBadge = {
        label: `Graded: ${submission.gradePoints} / ${assignment.totalPoints}`,
        color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      };
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-to-dashboard"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
            {assignment.courseCode}
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
              isGroup
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}
          >
            {isGroup ? 'Group Assignment' : 'Individual Assignment'}
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-medium text-indigo-600">
              {assignment.courseTitle}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {assignment.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {assignment.description}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shrink-0 space-y-2 min-w-[200px]">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Submission Deadline
              </span>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                {formattedDeadline}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-500">Max Score:</span>
              <span className="font-bold text-slate-900">{assignment.totalPoints} Points</span>
            </div>
          </div>
        </div>

        {/* Section 1.4: Progress Bar & Status Badges */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <span>Submission Lifecycle Progress</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-md border font-semibold ${statusBadge.color}`}>
                {statusBadge.label}
              </span>
            </span>
            <span className="font-mono font-bold text-slate-700">{progressPercentage}%</span>
          </div>

          {/* Stepped progress bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                progressPercentage === 100
                  ? 'bg-indigo-600'
                  : progressPercentage >= 80
                  ? 'bg-emerald-500'
                  : progressPercentage >= 50
                  ? 'bg-amber-500'
                  : 'bg-slate-300'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Milestones Indicator */}
          <div className="grid grid-cols-4 text-[11px] text-slate-500 font-medium text-center pt-1">
            <div className={`flex flex-col items-center ${progressPercentage >= 0 ? 'text-indigo-600 font-bold' : ''}`}>
              <div className="w-2 h-2 rounded-full bg-indigo-600 mb-1" />
              <span>1. Formed</span>
            </div>
            <div className={`flex flex-col items-center ${progressPercentage >= 50 ? 'text-amber-600 font-bold' : ''}`}>
              <div className={`w-2 h-2 rounded-full mb-1 ${progressPercentage >= 50 ? 'bg-amber-500' : 'bg-slate-300'}`} />
              <span>2. Submitted</span>
            </div>
            <div className={`flex flex-col items-center ${progressPercentage >= 80 ? 'text-emerald-600 font-bold' : ''}`}>
              <div className={`w-2 h-2 rounded-full mb-1 ${progressPercentage >= 80 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span>3. Acknowledged</span>
            </div>
            <div className={`flex flex-col items-center ${progressPercentage === 100 ? 'text-indigo-600 font-bold' : ''}`}>
              <div className={`w-2 h-2 rounded-full mb-1 ${progressPercentage === 100 ? 'bg-indigo-600' : 'bg-slate-300'}`} />
              <span>4. Graded</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <div className="flex-1 font-medium">{successMessage}</div>
        </div>
      )}

      {/* Main Grid: Details / Rubric / Group Members vs. Submission Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Instructions, Rubric, Group Members */}
        <div className="lg:col-span-2 space-y-6">
          {/* Instructions Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Detailed Instructions & Guidelines
            </h2>
            <div className="text-xs text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {assignment.instructions}
            </div>

            {/* Attachments */}
            {assignment.attachments && assignment.attachments.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  Reference Attachments & Specs
                </span>
                <div className="flex flex-wrap gap-2">
                  {assignment.attachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>{att.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({att.size})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Grading Rubric Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              Grading Rubric
            </h2>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {assignment.rubric.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50/40 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{item.criteria}</span>
                  <span className="font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-md">
                    {item.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Group Roster & Roles (CRITICAL FOR TASK -2 GROUP ASSIGNMENTS) */}
          {isGroup && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    Assigned Group: {group ? group.name : 'Group Not Assigned'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Group Leader holds authorization to formally acknowledge and lock final submissions.
                  </p>
                </div>
                {group && (
                  <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg border border-purple-200">
                    {group.members.length} Members
                  </span>
                )}
              </div>

              {group ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.members.map((member) => {
                    const isMemberLeader = member.id === group.leaderId;
                    const isMe = member.id === currentUser.id;

                    return (
                      <div
                        key={member.id}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          isMemberLeader
                            ? 'border-amber-300 bg-amber-50/40'
                            : 'border-slate-200 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              member.avatar ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                                member.name
                              )}`
                            }
                            alt={member.name}
                            className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{member.name}</span>
                              {isMe && (
                                <span className="text-[10px] text-slate-500 font-normal">
                                  (You)
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                              {member.email}
                            </div>
                          </div>
                        </div>

                        <div>
                          {isMemberLeader ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                              <Crown className="w-3 h-3 text-amber-600" />
                              Leader
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 px-2 py-0.5 rounded bg-slate-200/60 font-medium">
                              Member
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  You have not been assigned to a group for this assignment yet. Please consult with your professor.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Submission Portal & Group Leader Acknowledgment */}
        <div className="space-y-6">
          {/* Submission Status & Action Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center justify-between">
              <span>Deliverables Status</span>
              {submission && (
                <span className={`text-[11px] px-2 py-0.5 rounded-md border font-semibold ${statusBadge.color}`}>
                  {submission.status.toUpperCase()}
                </span>
              )}
            </h2>

            {/* If Graded: Show Grade & Feedback Note */}
            {submission && submission.status === 'graded' && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-indigo-600" />
                    Final Grade Assigned
                  </span>
                  <span className="text-sm font-black text-indigo-700">
                    {submission.gradePoints} / {assignment.totalPoints} pts
                  </span>
                </div>
                {submission.feedbackNotes && (
                  <div className="text-xs text-indigo-900/90 pt-1 border-t border-indigo-200/60 leading-relaxed">
                    <span className="font-semibold block text-[11px] text-indigo-700">Professor Feedback:</span>
                    {submission.feedbackNotes}
                  </div>
                )}
              </div>
            )}

            {/* Acknowledgment Notice Banner */}
            {submission && submission.status === 'acknowledged' && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Officially Acknowledged</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Acknowledged by{' '}
                  <span className="font-semibold">{submission.acknowledgedByUserName}</span> on{' '}
                  {submission.acknowledgedAt
                    ? new Date(submission.acknowledgedAt).toLocaleString()
                    : 'recently'}
                  .
                </p>
                <p className="text-[11px] text-emerald-700">
                  {isGroup
                    ? 'All group members share this confirmed status.'
                    : 'Your individual submission has been locked for professor evaluation.'}
                </p>
              </div>
            )}

            {/* Submitted but NOT Acknowledged Banner */}
            {submission && submission.status === 'submitted' && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Pending Acknowledgment</span>
                </div>
                {isGroup ? (
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {isLeader ? (
                      <span className="font-semibold text-amber-950">
                        You are the Group Leader ({currentUser.name}). Please review the deliverables below and click &quot;Acknowledge & Confirm Submission&quot; to formalize it for the whole team!
                      </span>
                    ) : (
                      <span>
                        Deliverables submitted by <span className="font-semibold">{submission.submittedByUserName}</span>. Awaiting confirmation from your Group Leader (<span className="font-semibold">{group?.leaderName}</span>).
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Your deliverables have been uploaded. Please confirm and acknowledge your submission below to lock it.
                  </p>
                )}
              </div>
            )}

            {/* Existing Submission Details Card */}
            {submission && !isEditingSubmission ? (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Submitted By
                    </span>
                    <span className="font-semibold text-slate-800">
                      {submission.submittedByUserName}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </span>
                  </div>

                  {submission.repositoryUrl && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Repository
                      </span>
                      <a
                        href={submission.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline flex items-center gap-1 font-medium truncate"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{submission.repositoryUrl}</span>
                      </a>
                    </div>
                  )}

                  {submission.fileAttachmentName && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Attached Document
                      </span>
                      <span className="text-slate-700 font-medium">
                        {submission.fileAttachmentName} ({submission.fileAttachmentSize || '2 MB'})
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Summary / Notes
                    </span>
                    <p className="text-slate-700 whitespace-pre-line text-xs">
                      {submission.submissionText}
                    </p>
                  </div>
                </div>

                {/* Leader Acknowledgment Button (Strict Section 1.3 & 3.3 Rule) */}
                {submission.status === 'submitted' && isStudent && (
                  <div className="space-y-2 pt-2">
                    {isGroup ? (
                      isLeader ? (
                        <button
                          id="btn-acknowledge-submission"
                          type="button"
                          onClick={handleAcknowledge}
                          disabled={acknowledging}
                          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          {acknowledging ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Acknowledging...</span>
                            </>
                          ) : (
                            <>
                              <Shield className="w-4 h-4" />
                              <span>Acknowledge & Confirm (Group Leader)</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div
                          id="notice-only-leader-can-acknowledge"
                          className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs text-center font-medium"
                        >
                          <Info className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                          Only your Group Leader ({group?.leaderName}) can formally acknowledge this submission.
                        </div>
                      )
                    ) : (
                      <button
                        id="btn-acknowledge-submission-individual"
                        type="button"
                        onClick={handleAcknowledge}
                        disabled={acknowledging}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        {acknowledging ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Acknowledging...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Acknowledge Submission</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      id="btn-edit-submission"
                      type="button"
                      onClick={() => setIsEditingSubmission(true)}
                      className="w-full py-2 px-3 text-xs font-semibold text-slate-600 hover:text-indigo-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      Edit / Resubmit Deliverables
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Submission Input Form (New or Editing) */
              <form onSubmit={handleFormSubmit} className="space-y-4 pt-1">
                {isStudent ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Git Repository URL
                      </label>
                      <input
                        id="input-repo-url"
                        type="url"
                        value={repositoryUrl}
                        onChange={(e) => setRepositoryUrl(e.target.value)}
                        placeholder="https://github.com/organization/project"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Attached Document / Report Name
                      </label>
                      <input
                        id="input-file-name"
                        type="text"
                        value={fileAttachmentName}
                        onChange={(e) => setFileAttachmentName(e.target.value)}
                        placeholder="e.g. Raft_Consensus_Final_Report.pdf"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Submission Notes & Test Summary
                      </label>
                      <textarea
                        id="input-submission-text"
                        rows={4}
                        required
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        placeholder="Describe key implementation details, test coverage, and instructions for running the code..."
                        className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id="btn-submit-work"
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>{submission ? 'Save Updated Work' : 'Submit Assignment'}</span>
                          </>
                        )}
                      </button>

                      {submission && (
                        <button
                          type="button"
                          onClick={() => setIsEditingSubmission(false)}
                          className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                    Professors review submissions in the Submissions Monitor tab.
                  </div>
                )}
              </form>
            )}

            {/* Timeline Events / Audit Log */}
            {submission && submission.timeline && submission.timeline.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Activity Audit Trail
                </span>
                <div className="space-y-2">
                  {submission.timeline.map((event, idx) => (
                    <div key={idx} className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-800">{event.actor}</span>
                        <span className="text-slate-400">
                          {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{event.action}</p>
                      {event.note && (
                        <p className="text-slate-500 text-[10px] italic mt-0.5">{event.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
