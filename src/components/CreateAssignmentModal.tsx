import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Calendar,
  Award,
  BookOpen,
  Users,
  User,
  Loader2,
  X,
  FileText,
} from 'lucide-react';
import { api } from '../lib/api.ts';
import type { Course, Assignment, RubricItem } from '../types.ts';

interface CreateAssignmentModalProps {
  courses: Course[];
  defaultCourseId?: string;
  onClose: () => void;
  onSuccess: (newAssignment: Assignment) => void;
}

export const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
  courses,
  defaultCourseId,
  onClose,
  onSuccess,
}) => {
  const [courseId, setCourseId] = useState(defaultCourseId || (courses[0]?.id || ''));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [submissionType, setSubmissionType] = useState<'individual' | 'group'>('group');
  const [deadline, setDeadline] = useState('2026-10-15T23:59');
  const [totalPoints, setTotalPoints] = useState(100);
  const [rubric, setRubric] = useState<RubricItem[]>([
    { criteria: 'Core Implementation & Architectural Correctness', points: 40 },
    { criteria: 'Automated Test Suite & Edge Cases', points: 30 },
    { criteria: 'Technical Documentation & Deliverables Quality', points: 30 },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddRubricItem = () => {
    setRubric([...rubric, { criteria: 'New Evaluation Criterion', points: 10 }]);
  };

  const handleRemoveRubricItem = (index: number) => {
    setRubric(rubric.filter((_, i) => i !== index));
  };

  const handleRubricChange = (index: number, field: 'criteria' | 'points', value: any) => {
    const next = [...rubric];
    next[index] = {
      ...next[index],
      [field]: field === 'points' ? Number(value) : value,
    };
    setRubric(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an assignment title.');
      return;
    }
    if (!courseId) {
      setError('Please select an active course.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.createAssignment({
        courseId,
        title: title.trim(),
        description: description.trim(),
        instructions: instructions.trim(),
        submissionType,
        deadline: new Date(deadline).toISOString(),
        totalPoints: Number(totalPoints),
        rubric,
        attachments: [
          { name: 'Assignment_Requirements_Spec.pdf', url: '#', size: '1.1 MB' },
        ],
      });

      onSuccess(res.assignment);
    } catch (err: any) {
      setError(err.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-5 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Curriculum Authoring
            </span>
            <h2 className="text-xl font-bold text-slate-900">Create New Coursework</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Course
            </label>
            <select
              id="select-assignment-course"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Assignment Title
            </label>
            <input
              id="input-new-assignment-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Milestone 2: Paxos Consensus & Fault Tolerance"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          {/* Submission Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Submission Mode (Individual vs Group)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="type-select-group"
                onClick={() => setSubmissionType('group')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  submissionType === 'group'
                    ? 'border-purple-600 bg-purple-50/50 text-purple-950 ring-2 ring-purple-600/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-600" />
                    Group Assignment
                  </span>
                  {submissionType === 'group' && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-200 text-purple-800 font-bold">
                      Selected
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500">
                  Enforces group leader acknowledgment requirement across all members.
                </span>
              </button>

              <button
                type="button"
                id="type-select-individual"
                onClick={() => setSubmissionType('individual')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  submissionType === 'individual'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-950 ring-2 ring-blue-600/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-600" />
                    Individual Task
                  </span>
                  {submissionType === 'individual' && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-200 text-blue-800 font-bold">
                      Selected
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500">
                  Each student submits and acknowledges their independent deliverable.
                </span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Short Description / Summary
            </label>
            <input
              id="input-new-assignment-desc"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief 1-2 sentence overview shown in the card list..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detailed Instructions & Steps
            </label>
            <textarea
              id="input-new-assignment-instructions"
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="1. Step-by-step goals&#10;2. Specific deliverables (GitHub link, report PDF)&#10;3. Testing constraints..."
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Deadline & Points Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Submission Deadline
              </label>
              <input
                id="input-new-assignment-deadline"
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Total Points
              </label>
              <input
                id="input-new-assignment-points"
                type="number"
                min="10"
                max="500"
                required
                value={totalPoints}
                onChange={(e) => setTotalPoints(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Rubric Builder */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Grading Rubric Breakdown
              </label>
              <button
                type="button"
                onClick={handleAddRubricItem}
                className="text-xs text-indigo-600 hover:underline font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Criterion</span>
              </button>
            </div>

            <div className="space-y-2">
              {rubric.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.criteria}
                    onChange={(e) => handleRubricChange(idx, 'criteria', e.target.value)}
                    placeholder="Criterion description"
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
                  />
                  <input
                    type="number"
                    value={item.points}
                    onChange={(e) => handleRubricChange(idx, 'points', e.target.value)}
                    placeholder="Pts"
                    className="w-20 px-3 py-1.5 text-xs border border-slate-200 rounded-xl font-bold text-right"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRubricItem(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-create-asg"
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Assignment...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Publish Assignment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
