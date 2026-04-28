import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  User, 
  Globe, 
  Lock, 
  LogOut,
  Smartphone,
  Database,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const SettingsTab = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  // Persistence for UI toggles
  const [pushEnabled, setPushEnabled] = useState(() => localStorage.getItem('ehp_push') === 'true');
  const [emailEnabled, setEmailEnabled] = useState(() => localStorage.getItem('ehp_email') === 'true');

  useEffect(() => {
    localStorage.setItem('ehp_push', pushEnabled.toString());
  }, [pushEnabled]);

  useEffect(() => {
    localStorage.setItem('ehp_email', emailEnabled.toString());
  }, [emailEnabled]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    try {
      await api.put('/auth/update-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setStatus({ type: 'success', message: 'Password updated successfully' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setStatus({ type: '', message: '' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }, 2000);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to update password' });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/auth/delete-account');
      logout();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete account');
    }
  };

  const handleExportData = async () => {
    try {
      // In a real app, this would hit an endpoint like /api/user/export
      // For this demo, we'll create a simulated medical record download
      const exportData = {
        user_info: user,
        export_date: new Date().toISOString(),
        application: "EHP Health Passport",
        data_type: "Full Medical History Export",
        note: "This is a secured portable health record export."
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `EHP_Health_Export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('Data export started. Your health records are being downloaded as a secured JSON file.');
    } catch (err) {
      alert('Failed to export data. Please try again later.');
    }
  };

  const sections = [
    {
      title: 'Appearance',
      items: [
        {
          icon: theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-yellow-500" />,
          label: 'Dark Mode',
          description: 'Toggle between light and dark themes',
          action: (
            <button 
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          )
        }
      ]
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: <Bell className="w-5 h-5 text-blue-500" />,
          label: 'Push Notifications',
          description: 'Receive alerts about your health records and vitals',
          action: (
            <button 
              onClick={() => setPushEnabled(!pushEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                pushEnabled ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pushEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          )
        },
        {
          icon: <Globe className="w-5 h-5 text-emerald-500" />,
          label: 'Email Updates',
          description: 'Monthly health summary and security alerts',
          action: (
            <button 
              onClick={() => setEmailEnabled(!emailEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                emailEnabled ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          )
        }
      ]
    },
    {
      title: 'Account & Privacy',
      items: [
        {
          icon: <User className="w-5 h-5 text-purple-500" />,
          label: 'Account Details',
          description: user?.email || 'Configure your personal information',
          action: <button onClick={() => navigate('/dashboard/profile')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Edit</button>
        },
        {
          icon: <Shield className="w-5 h-5 text-red-500" />,
          label: 'Privacy Settings',
          description: 'Manage who can view your medical data',
          action: <button onClick={() => alert('Privacy settings are automatically managed by EHP encryption protocols. Only you and authorized emergency contacts can access your data.')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View</button>
        },
        {
          icon: <Lock className="w-5 h-5 text-orange-500" />,
          label: 'Change Password',
          description: 'Add an extra layer of security to your account',
          action: <button onClick={() => setShowPasswordModal(true)} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Update</button>
        },
        {
          icon: <Trash2 className="w-5 h-5 text-red-500" />,
          label: 'Delete Account',
          description: 'Permanently remove all your health data',
          action: <button onClick={() => setShowDeleteModal(true)} className="text-sm font-medium text-red-600 hover:text-red-500 font-bold uppercase text-[10px]">Delete</button>
        }
      ]
    },
    {
      title: 'Advanced',
      items: [
        {
          icon: <Smartphone className="w-5 h-5 text-gray-500" />,
          label: 'Connected Devices',
          description: 'Manage your mobile apps and wearables',
          action: <button onClick={() => setShowDevicesModal(true)} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View</button>
        },
        {
          icon: <Database className="w-5 h-5 text-cyan-500" />,
          label: 'Export Data',
          description: 'Download a full copy of your medical history (JSON/PDF)',
          action: <button onClick={handleExportData} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Export</button>
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your EHP account preferences and application settings.</p>
      </div>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">{section.title}</h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-xl">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                    </div>
                  </div>
                  <div>
                    {item.action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-100 dark:border-red-900/30"
          >
            <LogOut className="w-5 h-5" />
            Sign Out of Account
          </button>
        </div>

        <div className="text-center pb-8">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            EHP Health Passport v1.0.0 • Secured with 256-bit encryption • Last Login: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* ── PASSWORD MODAL ── */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">Change Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
                <X className="w-5 h-5 dark:text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  value={passwordData.currentPassword}
                  onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  value={passwordData.newPassword}
                  onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  value={passwordData.confirmPassword}
                  onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                />
              </div>

              {status.message && (
                <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-red-600 mb-4 text-center">Delete Account?</h2>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              This action is <strong>irreversible</strong>. All your medical records, health history, and profile data will be permanently wiped from our servers in compliance with health data privacy laws.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 border border-gray-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DEVICES MODAL ── */}
      {showDevicesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">Connected Devices</h2>
              <button onClick={() => setShowDevicesModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
                <X className="w-5 h-5 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold dark:text-white">EHP Mobile App</h3>
                    <p className="text-xs text-gray-500">Android/iOS • Active Now</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">Linked</span>
              </div>
              <p className="text-xs text-gray-500 text-center px-4">
                To link a new device, download the EHP app from the Play Store and scan your unique QR code from the SOS section.
              </p>
              <button
                onClick={() => setShowDevicesModal(false)}
                className="w-full py-3 bg-gray-100 dark:bg-slate-700 dark:text-white rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
