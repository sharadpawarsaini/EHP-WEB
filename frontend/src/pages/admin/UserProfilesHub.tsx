import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Users,
  Search,
  Trash2,
  Mail,
  Calendar,
  UserCheck,
  UserX,
  Eye,
  MessageSquare,
  X,
  ChevronDown,
  Download,
  ShieldCheck,
  AlertTriangle,
  Heart,
  Pill,
  Syringe,
  FileText,
  Phone,
  Activity,
  Droplet,
  Clock,
  Send,
  Filter,
  CheckSquare,
  Square,
  UserCircle,
  TrendingUp,
  Star,
  MoreVertical,
  Lock,
  Unlock,
  RefreshCw,
  BrainCircuit,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';

// ─── Types ───────────────────────────────────────────────────────────────────
interface UserData {
  _id: string;
  email: string;
  role: string;
  createdAt: string;
  profile?: {
    fullName?: string;
    dob?: string;
    gender?: string;
    bloodGroup?: string;
    phone?: string;
    allergies?: string[];
    chronicConditions?: string[];
    photoUrl?: string;
  };
}

interface UserDetail extends UserData {
  reportCount?: number;
  medicineCount?: number;
  vaccinationCount?: number;
  contactCount?: number;
  visitCount?: number;
  lastLogin?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getInitials = (user: UserData) => {
  const name = user.profile?.fullName;
  if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return user.email[0].toUpperCase();
};

const getProfileScore = (user: UserData) => {
  let score = 0;
  const p = user.profile;
  if (!p) return 0;
  if (p.fullName) score += 20;
  if (p.dob) score += 15;
  if (p.bloodGroup) score += 20;
  if (p.phone) score += 10;
  if (p.allergies && p.allergies.length > 0) score += 15;
  if (p.chronicConditions && p.chronicConditions.length > 0) score += 10;
  if (p.gender) score += 10;
  return Math.min(score, 100);
};

const AVATAR_COLORS = [
  'from-blue-500 to-sky-400',
  'from-violet-500 to-purple-400',
  'from-emerald-500 to-teal-400',
  'from-rose-500 to-pink-400',
  'from-amber-500 to-orange-400',
  'from-cyan-500 to-blue-400',
];

const getAvatarColor = (id: string) => {
  const idx = id.charCodeAt(id.length - 1) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

// ─── Score Ring Component ─────────────────────────────────────────────────────
const ScoreRing = ({ score }: { score: number }) => {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#3b82f6' : '#f59e0b';
  return (
    <svg width="48" height="48" className="rotate-[-90deg]">
      <circle cx="24" cy="24" r={r} fill="none" stroke="#e2e8f0" strokeWidth="4" />
      <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
      <text x="24" y="28" textAnchor="middle" className="rotate-90"
        fill={color} fontSize="10" fontWeight="900"
        style={{ transform: 'rotate(90deg)', transformOrigin: '24px 24px' }}>
        {score}%
      </text>
    </svg>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const UserProfilesHub = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterBlood, setFilterBlood] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'score'>('newest');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [drawerUser, setDrawerUser] = useState<UserDetail | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [messageTarget, setMessageTarget] = useState<UserData | null>(null);
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgSending, setMsgSending] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const openDrawer = async (user: UserData) => {
    setDrawerUser(user as UserDetail);
    setDrawerLoading(true);
    try {
      // Try to get detailed counts; fall back gracefully
      const { data } = await api.get(`/admin/users/${user._id}/details`);
      setDrawerUser(data);
    } catch {
      // Use basic data if detail endpoint not available
      setDrawerUser(user as UserDetail);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(u => u.filter(x => x._id !== userId));
      if (drawerUser?._id === userId) setDrawerUser(null);
    } catch { alert('Failed to delete user'); }
  };

  const handleBulkDelete = async () => {
    if (!selectedUsers.length) return;
    if (!confirm(`Delete ${selectedUsers.length} selected users?`)) return;
    try {
      await api.post('/admin/users/bulk-action', { userIds: selectedUsers, action: 'delete' });
      setUsers(u => u.filter(x => !selectedUsers.includes(x._id)));
      setSelectedUsers([]);
    } catch { alert('Failed bulk delete'); }
  };

  const handleBulkExportCSV = () => {
    const targets = filteredUsers.filter(u => selectedUsers.includes(u._id));
    const csv = [
      ['Name', 'Email', 'Role', 'Blood Group', 'Joined', 'Profile Score'].join(','),
      ...targets.map(u => [
        u.profile?.fullName || '',
        u.email,
        u.role,
        u.profile?.bloodGroup || '',
        new Date(u.createdAt).toLocaleDateString(),
        getProfileScore(u)
      ].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ehp_users_export.csv';
    a.click();
  };

  const handleExportSingle = (user: UserData) => {
    const blob = new Blob([JSON.stringify(user, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ehp_user_${user._id}.json`;
    a.click();
  };

  const handleSendMessage = async () => {
    if (!messageTarget || !msgBody.trim()) return;
    setMsgSending(true);
    try {
      await api.post('/admin/message', {
        receiverId: messageTarget._id,
        title: msgSubject || 'Message from EHP Admin',
        content: msgBody,
        priority: 'normal'
      });
      setMsgSuccess(true);
      setTimeout(() => {
        setMessageTarget(null);
        setMsgSubject('');
        setMsgBody('');
        setMsgSuccess(false);
      }, 2000);
    } catch { alert('Failed to send message'); }
    finally { setMsgSending(false); }
  };

  const toggleSelect = (id: string) =>
    setSelectedUsers(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const toggleSelectAll = () =>
    setSelectedUsers(s => s.length === filteredUsers.length ? [] : filteredUsers.map(u => u._id));

  // ── Filter & Sort ─────────────────────────────────────────────────────────
  const bloodGroups = [...new Set(users.map(u => u.profile?.bloodGroup).filter(Boolean))];

  const filteredUsers = users
    .filter(u => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        u.email.toLowerCase().includes(q) ||
        u.profile?.fullName?.toLowerCase().includes(q);
      const matchRole = filterRole === 'all' || u.role === filterRole;
      const matchBlood = filterBlood === 'all' || u.profile?.bloodGroup === filterBlood;
      return matchSearch && matchRole && matchBlood;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'name') return (a.profile?.fullName || a.email).localeCompare(b.profile?.fullName || b.email);
      if (sortBy === 'score') return getProfileScore(b) - getProfileScore(a);
      return 0;
    });

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const avgScore = users.length
    ? Math.round(users.reduce((s, u) => s + getProfileScore(u), 0) / users.length)
    : 0;
  const thisWeek = users.filter(u =>
    new Date(u.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Loading User Registry...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-sky-400 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">User Profiles Hub</h1>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">
              Full member management & activity command center
            </p>
          </div>
        </div>
        <button
          onClick={fetchUsers}
          className="btn-secondary text-xs py-2.5 px-5 self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* ── Stats Strip ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'New This Week', value: `+${thisWeek}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Admin Accounts', value: adminCount, icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          { label: 'Avg. Profile Score', value: `${avgScore}%`, icon: Star, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
        ].map((stat) => (
          <div key={stat.label} className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border ${stat.border} dark:border-slate-800 p-5 rounded-[2rem] shadow-sm flex items-center gap-4`}>
            <div className={`p-3 ${stat.bg} dark:bg-slate-800 rounded-2xl border ${stat.border} dark:border-slate-700 ${stat.color} flex-shrink-0`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search, Filter & Sort Bar ─────────────────────────────────── */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-blue-100 dark:border-slate-800 p-4 rounded-[2rem] shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="health-input pl-10"
          />
        </div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="health-input md:w-40">
          <option value="all">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
        <select value={filterBlood} onChange={e => setFilterBlood(e.target.value)} className="health-input md:w-40">
          <option value="all">All Blood Groups</option>
          {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="health-input md:w-44">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name A–Z</option>
          <option value="score">Profile Score ↓</option>
        </select>
      </div>

      {/* ── Bulk Actions Bar ─────────────────────────────────────────── */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-600 text-white p-4 rounded-[1.5rem] flex items-center justify-between shadow-lg shadow-blue-600/20 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3 text-sm font-bold">
            <CheckSquare className="w-5 h-5" />
            {selectedUsers.length} users selected
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleBulkExportCSV} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-bold transition-all">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button onClick={handleBulkDelete} className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-xl text-xs font-bold transition-all">
              <Trash2 className="w-4 h-4" /> Delete Selected
            </button>
            <button onClick={() => setSelectedUsers([])} className="p-2 hover:bg-white/20 rounded-xl transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── User Cards Grid ───────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
            Showing {filteredUsers.length} of {totalUsers} members
          </p>
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            {selectedUsers.length === filteredUsers.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            {selectedUsers.length === filteredUsers.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user) => {
            const score = getProfileScore(user);
            const isSelected = selectedUsers.includes(user._id);
            const isAdmin = user.role === 'admin';
            const avatarColor = getAvatarColor(user._id);

            return (
              <div
                key={user._id}
                className={`
                  relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] border shadow-sm
                  transition-all duration-200 overflow-hidden group
                  ${isSelected
                    ? 'border-blue-400 shadow-blue-200 dark:shadow-blue-900/30 shadow-lg ring-2 ring-blue-400/30'
                    : 'border-blue-100 dark:border-slate-800 hover:border-blue-300 hover:shadow-md'}
                `}
              >
                {/* Selection checkbox */}
                <button
                  onClick={() => toggleSelect(user._id)}
                  className="absolute top-4 left-4 z-10 w-6 h-6 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center transition-all hover:border-blue-400"
                >
                  {isSelected && <div className="w-3 h-3 bg-blue-600 rounded-sm" />}
                </button>

                {/* Admin badge */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 z-10 px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200 dark:border-amber-700 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </div>
                )}

                {/* Card body */}
                <div className="p-6 pt-10">
                  {/* Avatar + Score Ring */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-16 h-16 bg-gradient-to-br ${avatarColor} rounded-[1.5rem] flex items-center justify-center text-white text-xl font-black shadow-lg flex-shrink-0`}>
                      {getInitials(user)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-black text-slate-900 dark:text-white truncate">
                        {user.profile?.fullName || 'Name Not Set'}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium truncate">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        {user.profile?.bloodGroup && (
                          <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-[10px] font-black rounded-full border border-rose-100 dark:border-rose-900 flex items-center gap-1">
                            <Droplet className="w-2.5 h-2.5" /> {user.profile.bloodGroup}
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100 dark:border-emerald-900 flex items-center gap-1">
                          <UserCheck className="w-2.5 h-2.5" /> Active
                        </span>
                      </div>
                    </div>
                    <ScoreRing score={score} />
                  </div>

                  {/* Profile completeness bar */}
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Profile Completeness</span>
                      <span className="text-[10px] font-black text-blue-600">{score}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${score >= 75 ? 'bg-emerald-500' : score >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-5">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      Joined {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                    </span>
                    {user.profile?.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-blue-400" />
                        {user.profile.phone}
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => openDrawer(user)}
                      className="flex flex-col items-center gap-1.5 p-3 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-2xl border border-blue-100 dark:border-blue-900 transition-all group/btn"
                    >
                      <Eye className="w-4 h-4 text-blue-600 group-hover/btn:scale-110 transition-transform" />
                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-wider">Inspect</span>
                    </button>
                    <button
                      onClick={() => { setMessageTarget(user); setMsgSubject(''); setMsgBody(''); }}
                      className="flex flex-col items-center gap-1.5 p-3 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50 rounded-2xl border border-sky-100 dark:border-sky-900 transition-all group/btn"
                    >
                      <MessageSquare className="w-4 h-4 text-sky-600 group-hover/btn:scale-110 transition-transform" />
                      <span className="text-[9px] font-black text-sky-600 uppercase tracking-wider">Message</span>
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="flex flex-col items-center gap-1.5 p-3 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-2xl border border-rose-100 dark:border-rose-900 transition-all group/btn"
                    >
                      <Trash2 className="w-4 h-4 text-rose-500 group-hover/btn:scale-110 transition-transform" />
                      <span className="text-[9px] font-black text-rose-500 uppercase tracking-wider">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-24 text-center bg-white/90 dark:bg-slate-900/90 rounded-[3rem] border border-blue-100 dark:border-slate-800">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No users match your filters</h3>
            <p className="text-sm text-slate-500">Try a different search query or clear the filters.</p>
          </div>
        )}
      </div>

      {/* ══ SIDE DRAWER ═══════════════════════════════════════════════════ */}
      {drawerUser && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setDrawerUser(null)}
          />
          {/* Drawer panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 border-l border-blue-100 dark:border-slate-800 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            {drawerLoading && (
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center z-10">
                <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              </div>
            )}

            {/* Drawer header */}
            <div className={`bg-gradient-to-br ${getAvatarColor(drawerUser._id)} p-8 relative`}>
              <button
                onClick={() => setDrawerUser(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black mb-4 shadow-lg">
                {getInitials(drawerUser)}
              </div>
              <h2 className="text-2xl font-black text-white">
                {drawerUser.profile?.fullName || 'No Name Set'}
              </h2>
              <p className="text-white/80 text-sm font-medium">{drawerUser.email}</p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {drawerUser.role === 'admin' && (
                  <span className="px-3 py-1 bg-white/20 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                    Admin
                  </span>
                )}
                {drawerUser.profile?.bloodGroup && (
                  <span className="px-3 py-1 bg-white/20 text-white text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-1">
                    <Droplet className="w-3 h-3" /> {drawerUser.profile.bloodGroup}
                  </span>
                )}
                <span className="px-3 py-1 bg-white/20 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                  Score: {getProfileScore(drawerUser)}%
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <section>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <UserCircle className="w-3.5 h-3.5 text-blue-500" /> Personal Information
                </h4>
                <div className="space-y-2.5">
                  {[
                    { label: 'Date of Birth', value: drawerUser.profile?.dob ? format(new Date(drawerUser.profile.dob), 'dd MMM yyyy') : null, icon: Calendar },
                    { label: 'Gender', value: drawerUser.profile?.gender, icon: UserCircle },
                    { label: 'Phone', value: drawerUser.profile?.phone, icon: Phone },
                    { label: 'Member Since', value: format(new Date(drawerUser.createdAt), 'dd MMM yyyy'), icon: Clock },
                  ].map(({ label, value, icon: Icon }) => value ? (
                    <div key={label} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                      <Icon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{value}</p>
                      </div>
                    </div>
                  ) : null)}
                </div>
              </section>

              {/* Health Info */}
              {(drawerUser.profile?.allergies?.length || drawerUser.profile?.chronicConditions?.length) ? (
                <section>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-rose-500" /> Health Details
                  </h4>
                  {drawerUser.profile?.allergies && drawerUser.profile.allergies.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Allergies</p>
                      <div className="flex flex-wrap gap-2">
                        {drawerUser.profile.allergies.map((a, i) => (
                          <span key={i} className="px-3 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-[10px] font-bold rounded-full border border-rose-100">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {drawerUser.profile?.chronicConditions && drawerUser.profile.chronicConditions.length > 0 && (
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Chronic Conditions</p>
                      <div className="flex flex-wrap gap-2">
                        {drawerUser.profile.chronicConditions.map((c, i) => (
                          <span key={i} className="px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 text-[10px] font-bold rounded-full border border-amber-100">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              ) : null}

              {/* Record Counts */}
              <section>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-blue-500" /> Recorded Data
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Reports', value: drawerUser.reportCount ?? '—', icon: FileText, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                    { label: 'Medicines', value: drawerUser.medicineCount ?? '—', icon: Pill, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                    { label: 'Vaccinations', value: drawerUser.vaccinationCount ?? '—', icon: Syringe, color: 'text-violet-600 bg-violet-50 border-violet-100' },
                    { label: 'Contacts', value: drawerUser.contactCount ?? '—', icon: Phone, color: 'text-sky-600 bg-sky-50 border-sky-100' },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                      <div className={`p-2 rounded-xl border ${color} dark:bg-slate-700 dark:border-slate-600`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-slate-900 dark:text-white">{value}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Message */}
              <section>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-sky-500" /> Send Quick Message
                </h4>
                <div className="space-y-3">
                  <input
                    value={msgSubject}
                    onChange={e => setMsgSubject(e.target.value)}
                    className="health-input text-xs"
                    placeholder="Subject (optional)"
                  />
                  <textarea
                    value={msgBody}
                    onChange={e => setMsgBody(e.target.value)}
                    className="health-input text-xs resize-none"
                    rows={3}
                    placeholder="Type your message to this user..."
                  />
                  <button
                    onClick={() => {
                      setMessageTarget(drawerUser);
                      handleSendMessage();
                    }}
                    disabled={!msgBody.trim() || msgSending}
                    className="btn-primary w-full py-3 text-xs"
                  >
                    <Send className="w-4 h-4" />
                    {msgSending ? 'Sending...' : msgSuccess ? 'Message Sent ✓' : 'Send Message'}
                  </button>
                </div>
              </section>

              {/* Danger Zone */}
              <section className="border-t border-slate-100 dark:border-slate-800 pt-6">
                <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5" /> Admin Actions
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleExportSingle(drawerUser)}
                    className="btn-secondary text-xs py-3"
                  >
                    <Download className="w-4 h-4" /> Export JSON
                  </button>
                  <button
                    onClick={() => handleDelete(drawerUser._id)}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-2xl text-xs font-bold border border-rose-100 dark:border-rose-900 transition-all"
                  >
                    <Trash2 className="w-4 h-4" /> Delete User
                  </button>
                </div>
              </section>
            </div>
          </div>
        </>
      )}

      {/* ══ DIRECT MESSAGE MODAL ══════════════════════════════════════════ */}
      {messageTarget && !drawerUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-blue-100 dark:border-slate-800 space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Send Message</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">To: {messageTarget.profile?.fullName || messageTarget.email}</p>
              </div>
              <button onClick={() => setMessageTarget(null)} className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {msgSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <Send className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-lg font-black text-slate-900 dark:text-white">Message Sent!</p>
                <p className="text-sm text-slate-500">The user will see it in their app.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Subject</label>
                  <input
                    value={msgSubject}
                    onChange={e => setMsgSubject(e.target.value)}
                    className="health-input"
                    placeholder="e.g. Important health update"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Message</label>
                  <textarea
                    value={msgBody}
                    onChange={e => setMsgBody(e.target.value)}
                    className="health-input resize-none"
                    rows={5}
                    placeholder="Type your message here..."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setMessageTarget(null)} className="btn-secondary flex-1 py-3 text-xs">
                    Cancel
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!msgBody.trim() || msgSending}
                    className="btn-primary flex-1 py-3 text-xs"
                  >
                    <Send className="w-4 h-4" />
                    {msgSending ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilesHub;
