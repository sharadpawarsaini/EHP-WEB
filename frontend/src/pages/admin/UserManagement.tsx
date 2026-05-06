import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Users, 
  Search, 
  MoreVertical, 
  Trash2, 
  Shield, 
  Mail, 
  Calendar,
  Filter,
  UserCheck,
  UserX
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map(u => u._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedUsers.length} users? This cannot be undone.`)) return;

    try {
      await api.post('/admin/users/bulk-action', { userIds: selectedUsers, action: 'delete' });
      setUsers(users.filter(user => !selectedUsers.includes(user._id)));
      setSelectedUsers([]);
      alert(`Successfully deleted ${selectedUsers.length} users`);
    } catch (error) {
      alert('Failed to perform bulk deletion');
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.profile?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-100 border-b-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative z-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="bg-zinc-950/50 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl inline-block">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2 flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 glow-border">
               <Users className="w-7 h-7 text-emerald-400" />
            </div>
            USER REGISTRY
          </h1>
          <p className="text-zinc-400 font-medium text-sm tracking-widest uppercase">Manage and monitor all platform members.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 text-white pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 w-full md:w-80 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all text-sm font-medium placeholder:text-zinc-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {selectedUsers.length > 0 && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30 rounded-xl p-4 flex items-center justify-between mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-sm">
              {selectedUsers.length}
            </span>
            <span className="text-primary-800 dark:text-primary-300 font-bold text-sm">Users Selected</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedUsers([])}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-bold text-sm px-3 py-1.5 transition-colors"
            >
              Clear
            </button>
            <button 
              onClick={handleBulkDelete}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      <div className="bg-white/80 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden relative group hover:shadow-[0_0_30px_rgba(16,185,129,0.05)] transition-all">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200/50 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-md">
                <th className="px-6 py-4 text-left w-12">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    className="w-4 h-4 text-emerald-500 rounded border-white/20 bg-zinc-900 focus:ring-emerald-500 focus:ring-offset-zinc-900"
                  />
                </th>
                <th className="px-6 py-4 text-zinc-400 font-bold text-xs uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-zinc-400 font-bold text-xs uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-zinc-400 font-bold text-xs uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-zinc-400 font-bold text-xs uppercase tracking-widest">Joined</th>
                <th className="px-6 py-4 text-zinc-400 font-bold text-xs uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/50 dark:divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user._id} className={`transition-all duration-300 ${selectedUsers.includes(user._id) ? 'bg-emerald-500/10' : 'hover:bg-white/5'}`}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                      className="w-4 h-4 text-emerald-500 rounded border-white/20 bg-zinc-900 focus:ring-emerald-500 focus:ring-offset-zinc-900"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-black shadow-[0_0_15px_rgba(16,185,129,0.15)] border border-emerald-500/20">
                        {user.profile?.fullName?.[0] || user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-zinc-900 dark:text-white font-bold text-sm tracking-wide">{user.profile?.fullName || 'No Name'}</div>
                        <div className="text-zinc-500 dark:text-zinc-400 text-xs font-medium flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-cyan-500" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border shadow-sm ${
                      user.role === 'admin' 
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                        : 'bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-white/10'
                    }`}>
                      {user.role?.toUpperCase() || 'USER'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      <UserCheck className="w-4 h-4" />
                      Active
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-zinc-500 text-xs font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2.5 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 rounded-xl transition-all border border-transparent hover:border-rose-500/30"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 hover:bg-white/10 text-zinc-500 hover:text-white rounded-xl transition-all border border-transparent hover:border-white/10">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-16 text-center">
              <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-1">No users found</h3>
              <p className="text-zinc-500 text-sm font-medium">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
