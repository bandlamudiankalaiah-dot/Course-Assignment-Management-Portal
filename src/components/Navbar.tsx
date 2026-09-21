import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  LogOut,
  BookOpen,
  ChevronDown,
  FileCode2,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import type { User } from '../types.ts';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onSwitchDemo: (role: string) => void;
  onOpenDocs: () => void;
  currentView: 'dashboard' | 'course' | 'assignment' | 'submissions';
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  onSwitchDemo,
  onOpenDocs,
  currentView,
  onNavigateHome,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const demoAccounts = [
    {
      id: 'prof-1',
      roleKey: 'professor-1',
      name: 'Dr. Elena Rostova',
      role: 'Professor',
      detail: 'CS-401 & CS-415 Instructor',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    },
    {
      id: 'prof-2',
      roleKey: 'professor-2',
      name: 'Prof. Marcus Vance',
      role: 'Professor',
      detail: 'SE-302 Instructor',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    },
    {
      id: 'stud-1',
      roleKey: 'student-leader',
      name: 'Alex Rivera',
      role: 'Student Leader',
      detail: 'ByteForge Group Leader (Can Acknowledge)',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'stud-2',
      roleKey: 'student-member',
      name: 'Sarah Chen',
      role: 'Student Member',
      detail: 'ByteForge Team Member',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    },
    {
      id: 'stud-4',
      roleKey: 'student-independent',
      name: 'David Kim',
      role: 'Student',
      detail: 'Independent / Member in NeuralCraft',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand logo & title */}
          <div className="flex items-center space-x-3">
            <button
              id="brand-home-button"
              onClick={onNavigateHome}
              className="flex items-center space-x-3 text-left group focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  AcademiaFlow
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Task -2
                  </span>
                </span>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Course & Assignment Portal
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation links */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              id="nav-dashboard-link"
              onClick={onNavigateHome}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </button>

            <button
              id="nav-docs-button"
              onClick={onOpenDocs}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/60 transition-colors"
            >
              <FileCode2 className="w-4 h-4 text-indigo-600" />
              Architecture & Schema
            </button>
          </div>

          {/* Right side: User & Switcher */}
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Quick Demo Role Switcher Dropdown */}
              <div className="relative">
                <button
                  id="role-switcher-dropdown-toggle"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Switch test account to inspect different role permissions"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Switch Role:</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[120px]">
                    {user.name.split(' ')[0]} ({user.role === 'professor' ? 'Prof' : 'Student'})
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-2 divide-y divide-slate-100">
                      <div className="px-3 py-2 bg-slate-50 text-xs text-slate-500 font-medium">
                        Instant Account Switcher (Evaluator Test Suite)
                      </div>
                      <div className="py-1">
                        {demoAccounts.map((acc) => (
                          <button
                            key={acc.id}
                            onClick={() => {
                              onSwitchDemo(acc.roleKey);
                              setDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs flex flex-col gap-0.5 hover:bg-indigo-50/70 transition-colors ${
                              user.id === acc.id ? 'bg-indigo-50/50' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-900">
                                {acc.name}
                              </span>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${acc.badgeColor}`}
                              >
                                {acc.role}
                              </span>
                            </div>
                            <span className="text-slate-500 text-[11px]">
                              {acc.detail}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* User Avatar & Info */}
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <img
                  src={
                    user.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      user.name
                    )}`
                  }
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-slate-200 object-cover bg-slate-100"
                />
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-slate-900 truncate max-w-[130px]">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-500 capitalize">
                    {user.role} • {user.department.split(' ')[0]}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                id="logout-button"
                onClick={onLogout}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                id="header-docs-link"
                onClick={onOpenDocs}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5"
              >
                Documentation
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
