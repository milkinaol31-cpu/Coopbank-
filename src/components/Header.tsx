import React from 'react';
import { User, District } from '../types';
import { ShieldCheck, Building2, UserCheck, Lock, AlertCircle, Wifi, WifiOff, Database, LogIn, LogOut, HelpCircle } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { ThemeToggle } from './ThemeToggle';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useFirebase } from '../context/FirebaseContext';

interface HeaderProps {
  currentUser: User;
  allUsers: User[];
  districts: District[];
  onSwitchUser: (user: User) => void;
  systemName: string;
  onOpenOfflineCenter: () => void;
  unsyncedCount: number;
  onOpenGuide: () => void;
  canSwitchUser?: boolean;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  districts,
  onSwitchUser,
  systemName,
  onOpenOfflineCenter,
  unsyncedCount,
  onOpenGuide,
  canSwitchUser,
  onSignOut,
}) => {
  const currentDistrict = districts.find(d => d.DistrictID === currentUser.DistrictID);
  const { isOnline, isSimulated } = useOnlineStatus();
  const { firebaseUser, authLoading, isConnected, signInWithGoogle, signOut, dbError } = useFirebase();

  // The persona switcher dropdown is STRICTLY EXCLUSIVE to the Enterprise Administrator.
  // Once a user is assigned a role (District HR, Head Office Manager), they CANNOT switch roles or use a proxy switcher.
  const isAuthorizedAdmin = Boolean(
    currentUser?.Role === 'ADMIN' ||
    (firebaseUser && (
      firebaseUser.email?.toLowerCase() === 'milkinaol31@gmail.com' ||
      firebaseUser.email?.toLowerCase() === 'bighabes@gmail.com' ||
      firebaseUser.email?.toLowerCase().includes('admin')
    )) ||
    canSwitchUser
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-purple-100 text-purple-800 border border-purple-200">System Administrator</span>;
      case 'HO_MANAGER':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-100 text-blue-800 border border-blue-200">Head Office HR Manager</span>;
      case 'DISTRICT_HR':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">District HR Officer</span>;
      case 'AUDITOR':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200">Compliance Auditor</span>;
      case 'DIRECTOR':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-100 text-amber-800 border border-amber-200">District Director</span>;
      default:
        return null;
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top institution bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
        <div className="flex items-center space-x-2">
          <span className={`inline-block w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <span className="font-semibold text-slate-200 uppercase tracking-wider">{systemName}</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">EMPLOYEE PERFORMANCE DISCIPLINE CASE REPORT</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Online/Offline status badge */}
          <button
            onClick={onOpenOfflineCenter}
            className={`flex items-center space-x-1.5 px-2 py-0.5 rounded text-[11px] font-medium border transition ${
              isOnline
                ? 'bg-emerald-950/70 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/80'
                : 'bg-amber-950 border-amber-800 text-amber-200 hover:bg-amber-900'
            }`}
            title="Click to open Offline & Sync Center"
          >
            {isOnline ? (
              <Wifi className="w-3 h-3 text-emerald-400" />
            ) : (
              <WifiOff className="w-3 h-3 text-amber-400 animate-pulse" />
            )}
            <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
            {unsyncedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white font-bold text-[9px]">
                {unsyncedCount}
              </span>
            )}
          </button>

          <span className="text-slate-700 hidden sm:inline">•</span>

          {/* In-App PWA Install Button */}
          <PWAInstallButton onOpenGuide={onOpenGuide} />

          <span className="text-slate-700 hidden sm:inline">•</span>

          {/* App Usage & Deployment Guide */}
          <button
            onClick={onOpenGuide}
            className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/40 shadow-sm transition"
            title="Open Complete Usage & Deployment Guide"
          >
            <HelpCircle className="w-3 h-3 text-indigo-200" />
            <span>App Guide</span>
          </button>

          <span className="text-slate-700 hidden sm:inline">•</span>

          {/* Persistent Dark Mode Toggle */}
          <ThemeToggle />

          <span className="text-slate-700 hidden sm:inline">•</span>

          {/* Cloud Firestore Status Badge */}
          <div
            className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
              isConnected
                ? 'bg-slate-800/90 border-slate-700 text-slate-200'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
            }`}
            title={isConnected ? 'Connected to Cloud Firestore' : 'Firestore Standby'}
          >
            <Database className={`w-3 h-3 ${isConnected ? 'text-amber-400' : 'text-slate-500'}`} />
            <span className="hidden md:inline">Firestore:</span>
            <span className={isConnected ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
              {isConnected ? 'Active' : 'Standby'}
            </span>
          </div>

          <span className="text-slate-700 hidden sm:inline">•</span>

          {/* Firebase Google Auth Button / Status */}
          {firebaseUser ? (
            <div className="flex items-center space-x-1.5 bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-[11px] text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
              <span className="max-w-[120px] truncate font-medium text-emerald-300" title={firebaseUser.email || ''}>
                {firebaseUser.email}
              </span>
              <button
                onClick={signOut}
                title="Sign Out of Firebase Google Auth"
                className="text-slate-400 hover:text-red-300 ml-1 p-0.5 rounded hover:bg-slate-700 transition"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              disabled={authLoading}
              className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white border border-blue-500 shadow-sm transition"
              title="Sign in with your Google account to sync live with Cloud Firestore"
            >
              <LogIn className="w-3 h-3" />
              <span>{authLoading ? 'Connecting...' : 'Sign in with Google'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main branding & persona switcher bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo and system title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center shadow-inner border border-blue-400/30">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              PERFORMANCE DISCIPLINE CASE REPORT
              <span className="text-xs font-normal px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                13 Districts
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              COOPERATIVE BANK OF OROMIA • Performance & Ethics Oversight Directorate
            </p>
          </div>
        </div>

        {/* Current Active User Profile (Strictly Read-Only for District HR & HO Managers) */}
        <div className="flex items-center space-x-3 bg-slate-800/90 p-2 px-3 rounded-xl border border-slate-700 shadow-sm">
          <div className="text-right">
            <div className="flex items-center justify-end space-x-2">
              <span className="text-sm font-semibold text-slate-100">{currentUser.FullName}</span>
              {getRoleBadge(currentUser.Role)}
            </div>
            <div className="text-xs text-slate-400 flex items-center justify-end gap-1.5 mt-0.5">
              {currentUser.Role === 'DISTRICT_HR' || currentUser.Role === 'DIRECTOR' ? (
                <>
                  <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="text-emerald-400 font-medium">
                    {currentUser.Role === 'DIRECTOR' ? 'Directorate:' : 'Assigned:'} {currentDistrict?.DistrictName || 'District Not Assigned'}
                  </span>
                  <span className="text-slate-500 font-mono">({currentUser.DistrictID || 'N/A'})</span>
                </>
              ) : currentUser.Role === 'HO_MANAGER' ? (
                <>
                  <Lock className="w-3 h-3 text-blue-400 shrink-0" />
                  <span className="text-blue-300 font-medium">Head Office Oversight • All 13 Districts</span>
                </>
              ) : currentUser.Role === 'AUDITOR' ? (
                <>
                  <Lock className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span className="text-indigo-300 font-medium">Internal Audit & Inspection • All 13 Districts</span>
                </>
              ) : (
                <span className="text-purple-300 font-medium">Enterprise Security & System Admin</span>
              )}
            </div>
          </div>

          {/* User selector dropdown ONLY for Authorized Administrator. Never rendered for non-admin users */}
          {isAuthorizedAdmin && (
            <div className="relative">
              <label htmlFor="user-select" className="sr-only">Switch User Persona (Administrator Access Only)</label>
              <div className="flex items-center bg-slate-900 rounded-lg border border-purple-500/60 px-2 py-1.5 text-xs text-slate-200 shadow-inner">
                <UserCheck className="w-4 h-4 text-purple-400 mr-1.5 shrink-0" />
                <span className="text-[10px] font-mono uppercase text-purple-300 font-bold mr-1 hidden lg:inline">Admin Mode:</span>
                <select
                  id="user-select"
                  aria-label="Switch User Persona"
                  className="bg-transparent border-none text-xs text-slate-200 focus:outline-none focus:ring-0 cursor-pointer pr-4"
                  value={currentUser.UserID}
                  onChange={(e) => {
                    const selected = allUsers.find(u => u.UserID === e.target.value);
                    if (selected) onSwitchUser(selected);
                  }}
                >
                  <optgroup label="System Administrators (Full Admin)">
                    {allUsers
                      .filter(u => u.Role === 'ADMIN')
                      .map(u => (
                        <option key={u.UserID} value={u.UserID} className="bg-slate-900 text-white">
                          {u.FullName} — System Administrator {u.IsActive ? '(Active)' : '🔒 (INACTIVE - BLOCKED)'}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="District HR Officers (District-Restricted)">
                    {allUsers
                      .filter(u => u.Role === 'DISTRICT_HR')
                      .map(u => {
                        const dist = districts.find(d => d.DistrictID === u.DistrictID);
                        return (
                          <option key={u.UserID} value={u.UserID} className="bg-slate-900 text-white">
                            {u.FullName} — {dist?.DistrictName || 'No District'} {u.IsActive ? '(Active)' : '🔒 (INACTIVE - BLOCKED)'}
                          </option>
                        );
                      })}
                  </optgroup>
                  <optgroup label="District Directors (Authorized Signatory)">
                    {allUsers
                      .filter(u => u.Role === 'DIRECTOR')
                      .map(u => {
                        const dist = districts.find(d => d.DistrictID === u.DistrictID);
                        return (
                          <option key={u.UserID} value={u.UserID} className="bg-slate-900 text-white">
                            {u.FullName} — Director ({dist?.DistrictName || 'No District'}) {u.IsActive ? '(Active)' : '🔒 (INACTIVE - BLOCKED)'}
                          </option>
                        );
                      })}
                  </optgroup>
                  <optgroup label="Head Office HR Managers (13-District Oversight)">
                    {allUsers
                      .filter(u => u.Role === 'HO_MANAGER')
                      .map(u => (
                        <option key={u.UserID} value={u.UserID} className="bg-slate-900 text-white">
                          {u.FullName} — Head Office Manager {u.IsActive ? '(Active)' : '🔒 (INACTIVE - BLOCKED)'}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Compliance Auditors (Inspection)">
                    {allUsers
                      .filter(u => u.Role === 'AUDITOR')
                      .map(u => (
                        <option key={u.UserID} value={u.UserID} className="bg-slate-900 text-white">
                          {u.FullName} — Compliance Auditor {u.IsActive ? '(Active)' : '🔒 (INACTIVE - BLOCKED)'}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>
            </div>
          )}

          {/* Dedicated Sign Out Button */}
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="px-2.5 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-800/80 text-red-200 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              title="Sign Out of Portal"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* District Security Enforcement Banner for District HR */}
      {currentUser.Role === 'DISTRICT_HR' && (
        <div className="bg-emerald-950/80 border-t border-emerald-900 px-4 sm:px-6 lg:px-8 py-1.5 text-xs text-emerald-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              <strong>District Isolation Active:</strong> You are authenticated for <strong>{currentDistrict?.DistrictName} ({currentUser.DistrictID})</strong>. Access to other districts is restricted by data security rules.
            </span>
          </div>
          <span className="hidden md:inline text-emerald-300/80">Authorized District Director: {currentDistrict?.DirectorName}</span>
        </div>
      )}

      {/* Account Deactivated Warning if inactive user selected */}
      {!currentUser.IsActive && (
        <div className="bg-red-950 border-t border-red-800 px-4 sm:px-6 lg:px-8 py-2 text-xs text-red-200 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>
            <strong>Account Inactive:</strong> This user account has been deactivated by the System Administrator. Access to submit or view reports is denied.
          </span>
        </div>
      )}
    </header>
  );
};
