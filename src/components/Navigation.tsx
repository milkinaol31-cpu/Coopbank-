import React from 'react';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  FilePlus,
  Files,
  FolderGit2,
  CheckCircle2,
  DownloadCloud,
  Users,
  MapPin,
  ShieldAlert,
  Database,
  Lock,
  WifiOff
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'submit'
  | 'my-reports'
  | 'all-reports'
  | 'review-queue'
  | 'reports-download'
  | 'users'
  | 'districts'
  | 'audit-log'
  | 'offline-sync';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  userRole: UserRole;
  isAuthorizedAdmin?: boolean;
  pendingReviewsCount: number;
  correctionsCount: number;
  offlineQueueCount: number;
  isOnline: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  userRole,
  isAuthorizedAdmin,
  pendingReviewsCount,
  correctionsCount,
  offlineQueueCount,
  isOnline,
}) => {
  const isDistrictHR = userRole === 'DISTRICT_HR';
  const isDirector = userRole === 'DIRECTOR';
  const isHOManager = userRole === 'HO_MANAGER';
  const isAuditor = userRole === 'AUDITOR';
  const isAdmin = userRole === 'ADMIN' || Boolean(isAuthorizedAdmin);

  interface NavItem {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    allowed: boolean;
    badge?: number | string;
    badgeColor?: string;
    restrictedTooltip?: string;
  }

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: (isDistrictHR || isDirector) ? 'District Dashboard' : 'Consolidated Dashboard',
      icon: LayoutDashboard,
      allowed: true,
    },
    {
      id: 'submit',
      label: 'Submit New Report',
      icon: FilePlus,
      allowed: isDistrictHR || isDirector || isAdmin,
      restrictedTooltip: 'Restricted: Filing reports is reserved for District HR, Directors, and Administrators.',
    },
    {
      id: 'my-reports',
      label: (isDistrictHR || isDirector) ? 'My District Reports' : 'District Submissions',
      icon: Files,
      allowed: true,
      badge: (isDistrictHR || isDirector) && correctionsCount > 0 ? correctionsCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'all-reports',
      label: 'All 13 Districts Reports',
      icon: FolderGit2,
      allowed: isHOManager || isAdmin || isAuditor,
      restrictedTooltip: 'Restricted: District accounts can only access their assigned district.',
    },
    {
      id: 'review-queue',
      label: 'HO Review Queue',
      icon: CheckCircle2,
      allowed: isHOManager || isAdmin,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
      badgeColor: 'bg-blue-600 text-white',
      restrictedTooltip: 'Restricted to Head Office HR Oversight personnel.',
    },
    {
      id: 'reports-download',
      label: 'Reports & Downloads',
      icon: DownloadCloud,
      allowed: true,
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      allowed: isAdmin,
      restrictedTooltip: 'Restricted to System Administrators.',
    },
    {
      id: 'districts',
      label: '13 Districts Registry',
      icon: MapPin,
      allowed: isAdmin,
      restrictedTooltip: 'Restricted to System Administrators.',
    },
    {
      id: 'audit-log',
      label: 'System Audit Trail',
      icon: ShieldAlert,
      allowed: isHOManager || isAdmin || isAuditor,
      restrictedTooltip: 'Restricted to Head Office, Auditors, and Administrators.',
    },
    {
      id: 'offline-sync',
      label: 'Offline & Sync Center',
      icon: Database,
      allowed: true,
      badge: !isOnline ? 'OFFLINE' : offlineQueueCount > 0 ? offlineQueueCount : undefined,
      badgeColor: !isOnline ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white',
    },
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-[73px] z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isAccessible = item.allowed;

            if (!isAccessible) {
              return (
                <div
                  key={item.id}
                  title={item.restrictedTooltip}
                  className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-50/70 dark:bg-slate-800/40 rounded-md border border-slate-200/60 dark:border-slate-800/60 cursor-not-allowed opacity-60 select-none shrink-0"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>{item.label}</span>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-sm font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      item.badgeColor || 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
