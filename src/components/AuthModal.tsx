import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Mail,
  Lock,
  User as UserIcon,
  Building2,
  BadgeAlert,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  Users2,
} from 'lucide-react';
import { api, setAuthSession } from '../lib/api.ts';
import type { User, UserRole } from '../types.ts';

interface AuthModalProps {
  onSuccess: (user: User) => void;
  onOpenDocs: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess, onOpenDocs }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('alex.rivera@student.edu');
  const [password, setPassword] = useState('Password123!');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [studentIdNumber, setStudentIdNumber] = useState('CS-2024-8841');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (!email.trim() || !email.includes('@')) throw new Error('Please enter a valid academic email.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');

        const res = await api.register({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          department,
          studentIdNumber: role === 'student' ? studentIdNumber : undefined,
        });
        setAuthSession(res.token, res.user);
        onSuccess(res.user);
      } else {
        if (!email.trim()) throw new Error('Please enter your email.');
        if (!password) throw new Error('Please enter your password.');

        const res = await api.login(email.trim(), password);
        setAuthSession(res.token, res.user);
        onSuccess(res.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = async (demoKey: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.demoLogin(demoKey);
      setAuthSession(res.token, res.user);
      onSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50/50">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 mb-3">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Academic Course & Assignment Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Task -2: Enhanced Role-Based Academic Management
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {/* Tab Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
            <button
              id="tab-login"
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                !isRegister
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              id="tab-register"
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                isRegister
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Register New Account
            </button>
          </div>

          {error && (
            <div
              id="auth-error-banner"
              className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn"
            >
              <BadgeAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                {/* Role Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Account Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      id="role-select-student"
                      onClick={() => setRole('student')}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        role === 'student'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-2 ring-indigo-600/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <GraduationCap className="w-4 h-4 text-indigo-600" />
                        {role === 'student' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <span className="text-xs font-bold">Student</span>
                      <span className="text-[11px] text-slate-500">
                        Enroll in courses, submit work & lead groups
                      </span>
                    </button>

                    <button
                      type="button"
                      id="role-select-professor"
                      onClick={() => setRole('professor')}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        role === 'professor'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-2 ring-indigo-600/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        {role === 'professor' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <span className="text-xs font-bold">Professor</span>
                      <span className="text-[11px] text-slate-500">
                        Create assignments, monitor & grade
                      </span>
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      id="input-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Siddhartha Thonti"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      id="input-department"
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Computer Science"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                {role === 'student' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Student ID Number
                    </label>
                    <input
                      id="input-student-id"
                      type="text"
                      value={studentIdNumber}
                      onChange={(e) => setStudentIdNumber(e.target.value)}
                      placeholder="e.g. CS-2024-8841"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                )}
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  id="input-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  id="input-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-hidden"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isRegister ? 'Complete Registration' : 'Sign In with JWT'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins for Evaluation */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Instant Demo Logins
              </p>
              <button
                onClick={onOpenDocs}
                className="text-[11px] text-indigo-600 hover:underline font-medium"
              >
                View Specs
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              One-click evaluation profiles with pre-seeded courses and group submissions:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="demo-student-leader"
                onClick={() => handleDemoSelect('student-leader')}
                className="p-2.5 text-left rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 transition-colors group"
              >
                <div className="text-xs font-bold text-amber-900 flex items-center justify-between">
                  <span>Alex Rivera</span>
                  <span className="text-[10px] px-1 bg-amber-200 text-amber-900 rounded font-semibold">
                    Leader
                  </span>
                </div>
                <div className="text-[10px] text-amber-800 mt-0.5">
                  ByteForge Group Leader (Can Acknowledge)
                </div>
              </button>

              <button
                type="button"
                id="demo-student-member"
                onClick={() => handleDemoSelect('student-member')}
                className="p-2.5 text-left rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-100/70 transition-colors group"
              >
                <div className="text-xs font-bold text-teal-900 flex items-center justify-between">
                  <span>Sarah Chen</span>
                  <span className="text-[10px] px-1 bg-teal-200 text-teal-900 rounded font-semibold">
                    Member
                  </span>
                </div>
                <div className="text-[10px] text-teal-800 mt-0.5">
                  ByteForge Member (Submits work)
                </div>
              </button>

              <button
                type="button"
                id="demo-professor-1"
                onClick={() => handleDemoSelect('professor-1')}
                className="p-2.5 text-left rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 transition-colors group"
              >
                <div className="text-xs font-bold text-indigo-900 flex items-center justify-between">
                  <span>Dr. Elena Rostova</span>
                  <span className="text-[10px] px-1 bg-indigo-200 text-indigo-900 rounded font-semibold">
                    Prof
                  </span>
                </div>
                <div className="text-[10px] text-indigo-800 mt-0.5">
                  CS-401 & CS-415 Instructor
                </div>
              </button>

              <button
                type="button"
                id="demo-professor-2"
                onClick={() => handleDemoSelect('professor-2')}
                className="p-2.5 text-left rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 transition-colors group"
              >
                <div className="text-xs font-bold text-indigo-900 flex items-center justify-between">
                  <span>Prof. Vance</span>
                  <span className="text-[10px] px-1 bg-indigo-200 text-indigo-900 rounded font-semibold">
                    Prof
                  </span>
                </div>
                <div className="text-[10px] text-indigo-800 mt-0.5">
                  SE-302 Agile Architecture
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
