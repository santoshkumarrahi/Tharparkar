import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  X,
  LogOut,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Upload,
  BarChart3,
  Search,
  RefreshCw,
  Settings,
  Mail,
  Clock,
  MapPin,
  ExternalLink,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { DirectoryItem, Inquiry, SiteSettings, AuditLog, AdminUser, CategoryType } from '../types.ts';
import { TOWNS } from '../data/seedData.ts';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
  siteSettings: SiteSettings;
  onSettingsUpdated: (newSettings: SiteSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onDataChanged,
  siteSettings,
  onSettingsUpdated
}) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('thar_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Login form state
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'overview' | 'directory' | 'pending' | 'inquiries' | 'settings' | 'audit'>(
    'overview'
  );

  // Data states
  const [directoryItems, setDirectoryItems] = useState<DirectoryItem[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Search & filter in table
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Add / Edit Modal state
  const [editingItem, setEditingItem] = useState<DirectoryItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<DirectoryItem>>({});

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Fetch admin data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [dirRes, inqRes, statsRes, auditRes] = await Promise.all([
        fetch('/api/directory?status=all'),
        fetch('/api/inquiries'),
        fetch('/api/stats'),
        fetch('/api/audit-logs')
      ]);

      if (dirRes.ok) setDirectoryItems(await dirRes.json());
      if (inqRes.ok) setInquiries(await inqRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (auditRes.ok) setAuditLogs(await auditRes.json());
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchData();
      setSettingsForm(siteSettings);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setCurrentUser(data.user);
      localStorage.setItem('thar_admin_user', JSON.stringify(data.user));
    } catch (err: any) {
      setLoginError(err.message || 'Login error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('thar_admin_user');
  };

  // Directory CRUD operations
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'education',
      subCategory: 'govt_boys_school',
      town: 'Mithi',
      address: '',
      latitude: 24.7438,
      longitude: 69.8000,
      phone: '',
      email: '',
      website: '',
      description: '',
      programsOrServices: [],
      ownership: 'Government',
      genderType: 'Co-education',
      photos: ['/hero-tharparkar.jpg'],
      verificationStatus: 'verified',
      sourceReference: 'Admin Verified Entry'
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: DirectoryItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/directory/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
        onDataChanged();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleQuickStatusChange = async (item: DirectoryItem, newStatus: 'verified' | 'pending' | 'rejected') => {
    try {
      const res = await fetch(`/api/directory/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, verificationStatus: newStatus })
      });
      if (res.ok) {
        fetchData();
        onDataChanged();
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/directory/${editingItem.id}` : '/api/directory';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save');
      }

      setIsFormOpen(false);
      fetchData();
      onDataChanged();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Inquiry update
  const handleUpdateInquiry = async (id: string, status: 'reviewed' | 'resolved') => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFeedbackMessage('Homepage and portal settings updated successfully!');
      onSettingsUpdated(data.settings);
      fetchData();
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSettingsSaving(false);
    }
  };

  // CSV Export & Import
  const handleExportCSV = () => {
    window.open('/api/export/csv', '_blank');
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim() !== '');
        if (lines.length < 2) {
          alert('CSV file is empty or has no header row.');
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
        const items = [];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map((val) => val.trim().replace(/^"|"$/g, ''));
          if (row.length < 3) continue;

          items.push({
            name: row[1] || 'Imported Listing',
            category: (row[2] as CategoryType) || 'education',
            subCategory: row[3] || 'govt_boys_school',
            town: row[4] || 'Mithi',
            address: row[5] || 'Tharparkar',
            latitude: parseFloat(row[6]) || 24.7438,
            longitude: parseFloat(row[7]) || 69.8000,
            phone: row[8] || '',
            verificationStatus: 'verified'
          });
        }

        const res = await fetch('/api/import/csv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items })
        });
        const resData = await res.json();
        alert(resData.message || 'CSV imported successfully!');
        fetchData();
        onDataChanged();
      } catch (err: any) {
        alert(`Failed to import CSV: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#1C1C17] text-[#F8F4EC] rounded-3xl max-w-6xl w-full h-[94vh] flex flex-col shadow-2xl border border-[#D8B786]/30 overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#25251F] border-b border-[#D8B786]/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D8B786] to-[#9A542E] flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white font-serif leading-tight">
                Tharparkar District Administration Portal
              </h2>
              <span className="text-[11px] text-[#D8B786] uppercase tracking-wider font-semibold">
                Verified Data & Verification Management Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-white/70">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Logged in: <strong>{currentUser.name}</strong></span>
              </div>
            )}

            {currentUser && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-800/40 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!currentUser ? (
          /* Login Screen */
          <div className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(#9A542E_1px,transparent_1px)] [background-size:20px_20px]">
            <div className="bg-[#25251F] p-8 sm:p-10 rounded-3xl border border-[#D8B786]/30 max-w-md w-full shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-[#9A542E]/20 border border-[#D8B786]/40 text-[#D8B786] flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-center text-white">
                Administrative Authentication
              </h3>
              <p className="text-xs text-white/60 text-center mt-1 mb-6">
                Enter authorized credentials to manage verified records, approve citizen submissions, and configure homepage banners.
              </p>

              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#D8B786] mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full bg-[#1C1C17] border border-white/20 text-white px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#D8B786]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#D8B786] mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password..."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#1C1C17] border border-white/20 text-white px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#D8B786]"
                  />
                  <span className="text-[10px] text-white/50 block mt-1">
                    Demo Administrator Password: <code className="text-[#D8B786]">thar2026!</code>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 rounded-xl bg-[#9A542E] hover:bg-[#b06135] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Logged In Dashboard View */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-[#25251F] border-r border-[#D8B786]/20 p-3 sm:p-4 flex md:flex-col gap-1.5 shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 shrink-0 cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#9A542E] text-white shadow'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('directory')}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 shrink-0 cursor-pointer ${
                  activeTab === 'directory'
                    ? 'bg-[#9A542E] text-white shadow'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Manage Directory ({directoryItems.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between shrink-0 cursor-pointer ${
                  activeTab === 'pending'
                    ? 'bg-[#9A542E] text-white shadow'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Citizen Submissions</span>
                </div>
                {stats?.pending > 0 && (
                  <span className="bg-amber-500 text-black px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                    {stats.pending}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between shrink-0 cursor-pointer ${
                  activeTab === 'inquiries'
                    ? 'bg-[#9A542E] text-white shadow'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4" />
                  <span>Inquiries & Feedback</span>
                </div>
                {stats?.inquiriesNew > 0 && (
                  <span className="bg-[#9A542E] text-white px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                    {stats.inquiriesNew}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 shrink-0 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#9A542E] text-white shadow'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Site Content & Hero</span>
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 shrink-0 cursor-pointer ${
                  activeTab === 'audit'
                    ? 'bg-[#9A542E] text-white shadow'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Audit & Security Logs</span>
              </button>
            </div>

            {/* Main Content Workspace */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold font-serif text-white">
                        District Database Overview
                      </h3>
                      <p className="text-xs text-white/60">
                        Live statistics from the persistent database.
                      </p>
                    </div>
                    <button
                      onClick={fetchData}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Refresh data"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-[#25251F] border border-white/10 shadow-sm">
                      <span className="text-[10px] uppercase tracking-wider text-white/50 block font-bold">
                        Total Directory Listings
                      </span>
                      <div className="text-2xl font-bold text-[#D8B786] mt-1">
                        {stats?.total || directoryItems.length}
                      </div>
                      <span className="text-[11px] text-emerald-400 mt-1 block">
                        ✓ {stats?.verified || 0} Fully Verified
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#25251F] border border-white/10 shadow-sm">
                      <span className="text-[10px] uppercase tracking-wider text-white/50 block font-bold">
                        Pending Submissions
                      </span>
                      <div className="text-2xl font-bold text-amber-400 mt-1">
                        {stats?.pending || 0}
                      </div>
                      <span className="text-[11px] text-amber-300/80 mt-1 block">
                        Requires Admin Review
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#25251F] border border-white/10 shadow-sm">
                      <span className="text-[10px] uppercase tracking-wider text-white/50 block font-bold">
                        Citizen Inquiries
                      </span>
                      <div className="text-2xl font-bold text-white mt-1">
                        {stats?.inquiriesTotal || inquiries.length}
                      </div>
                      <span className="text-[11px] text-[#D8B786] mt-1 block">
                        {stats?.inquiriesNew || 0} New Messages
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#25251F] border border-white/10 shadow-sm">
                      <span className="text-[10px] uppercase tracking-wider text-white/50 block font-bold">
                        District Talukas
                      </span>
                      <div className="text-2xl font-bold text-white mt-1">
                        7 Talukas
                      </div>
                      <span className="text-[11px] text-white/60 mt-1 block">
                        Mithi, Islamkot, Nagarparkar...
                      </span>
                    </div>
                  </div>

                  {/* Category Breakdown & Quick Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-5 rounded-2xl bg-[#25251F] border border-white/10">
                      <h4 className="font-bold text-sm text-white mb-3">
                        Records Distribution by Category
                      </h4>
                      <div className="space-y-2 text-xs">
                        {stats?.byCategory &&
                          Object.entries(stats.byCategory).map(([cat, count]: [string, any]) => (
                            <div key={cat} className="flex items-center justify-between py-1 border-b border-white/5">
                              <span className="uppercase text-white/70 font-semibold">{cat}</span>
                              <span className="font-bold text-[#D8B786]">{count} records</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#25251F] border border-white/10">
                      <h4 className="font-bold text-sm text-white mb-3">
                        Quick Administrative Actions
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={handleOpenAdd}
                          className="p-3 rounded-xl bg-[#9A542E] hover:bg-[#b06135] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add New Listing</span>
                        </button>

                        <button
                          onClick={handleExportCSV}
                          className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export CSV</span>
                        </button>

                        <label className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer">
                          <Upload className="w-4 h-4" />
                          <span>Import CSV</span>
                          <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
                        </label>

                        <button
                          onClick={() => setActiveTab('settings')}
                          className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Edit Hero Text</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MANAGE DIRECTORY */}
              {activeTab === 'directory' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Filter listings..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-[#25251F] border border-white/10 text-white pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[#D8B786]"
                        />
                      </div>

                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-[#25251F] border border-white/10 text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[#D8B786]"
                      >
                        <option value="all">All Categories</option>
                        <option value="education">Education</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="destination">Destination</option>
                        <option value="accommodation">Accommodation</option>
                        <option value="government">Government</option>
                        <option value="business">Business</option>
                      </select>
                    </div>

                    <button
                      onClick={handleOpenAdd}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#9A542E] hover:bg-[#b06135] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Directory Item</span>
                    </button>
                  </div>

                  {/* Listings Table */}
                  <div className="bg-[#25251F] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-white/80">
                        <thead className="bg-black/30 text-[10px] uppercase font-bold text-[#D8B786] border-b border-white/10">
                          <tr>
                            <th className="p-3">Institution / Place</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Town</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {directoryItems
                            .filter((item) => {
                              const matchCat = filterCategory === 'all' || item.category === filterCategory;
                              const matchSearch =
                                !searchTerm ||
                                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                item.town.toLowerCase().includes(searchTerm.toLowerCase());
                              return matchCat && matchSearch;
                            })
                            .map((item) => (
                              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-3">
                                  <div className="font-bold text-white text-sm">{item.name}</div>
                                  <div className="text-[11px] text-white/50 truncate max-w-xs">{item.address}</div>
                                </td>
                                <td className="p-3 uppercase text-[10px] font-semibold text-[#D8B786]">
                                  {item.category}
                                </td>
                                <td className="p-3 font-medium text-white/90">{item.town}</td>
                                <td className="p-3">
                                  <select
                                    value={item.verificationStatus}
                                    onChange={(e) =>
                                      handleQuickStatusChange(item, e.target.value as any)
                                    }
                                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase border cursor-pointer ${
                                      item.verificationStatus === 'verified'
                                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                        : item.verificationStatus === 'pending'
                                        ? 'bg-amber-950 text-amber-300 border-amber-700'
                                        : 'bg-red-950 text-red-300 border-red-700'
                                    }`}
                                  >
                                    <option value="verified">Verified</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                  </select>
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleOpenEdit(item)}
                                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                                      title="Edit"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(item.id, item.name)}
                                      className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CITIZEN PENDING SUBMISSIONS */}
              {activeTab === 'pending' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold font-serif text-white">
                        Review Citizen Submissions
                      </h3>
                      <p className="text-xs text-white/60">
                        Submissions suggested by the public awaiting administrative approval.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {directoryItems.filter((i) => i.verificationStatus === 'pending').length === 0 ? (
                      <div className="p-8 text-center bg-[#25251F] rounded-2xl border border-white/10 text-white/60">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                        <h4 className="font-bold text-white">All Submissions Reviewed</h4>
                        <p className="text-xs mt-1">There are no pending submissions awaiting approval.</p>
                      </div>
                    ) : (
                      directoryItems
                        .filter((i) => i.verificationStatus === 'pending')
                        .map((item) => (
                          <div
                            key={item.id}
                            className="p-5 rounded-2xl bg-[#25251F] border border-amber-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300">
                                  {item.category}
                                </span>
                                <span className="text-xs text-white/60">• {item.town}</span>
                              </div>
                              <h4 className="font-bold text-base text-white">{item.name}</h4>
                              <p className="text-xs text-white/70">{item.description}</p>
                              <div className="text-[11px] text-white/50">Address: {item.address}</div>
                              {item.phone && <div className="text-[11px] text-[#D8B786]">Phone: {item.phone}</div>}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleQuickStatusChange(item, 'verified')}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                              >
                                Approve & Verify
                              </button>
                              <button
                                onClick={() => handleQuickStatusChange(item, 'rejected')}
                                className="px-4 py-2 rounded-xl bg-red-900/60 hover:bg-red-800 text-red-200 text-xs font-bold transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold font-serif text-white">
                    Citizen Inquiries & Messages
                  </h3>

                  <div className="space-y-3">
                    {inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="p-5 rounded-2xl bg-[#25251F] border border-white/10 flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{inq.name}</span>
                            <span className="text-xs text-white/60">({inq.email})</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              inq.status === 'new'
                                ? 'bg-red-950 text-red-300'
                                : inq.status === 'reviewed'
                                ? 'bg-amber-950 text-amber-300'
                                : 'bg-emerald-950 text-emerald-300'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>

                        <div className="font-semibold text-xs text-[#D8B786]">{inq.subject}</div>
                        <p className="text-xs text-white/80 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                          {inq.message}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-white/40 pt-1">
                          <span>Received: {new Date(inq.createdAt).toLocaleString()}</span>
                          {inq.status !== 'resolved' && (
                            <button
                              onClick={() => handleUpdateInquiry(inq.id, 'resolved')}
                              className="text-xs text-emerald-400 hover:underline font-semibold"
                            >
                              Mark as Resolved ✓
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h3 className="text-xl font-bold font-serif text-white">
                      Portal Content & Hero Configuration
                    </h3>
                    <p className="text-xs text-white/60">
                      Edit the homepage hero texts, button labels, and top helpline notice.
                    </p>
                  </div>

                  {feedbackMessage && (
                    <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs">
                      {feedbackMessage}
                    </div>
                  )}

                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#D8B786] mb-1">
                        Hero Main Heading
                      </label>
                      <input
                        type="text"
                        value={settingsForm.heroHeading}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, heroHeading: e.target.value })
                        }
                        className="w-full bg-[#25251F] border border-white/20 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#D8B786]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#D8B786] mb-1">
                        Hero Subtitle
                      </label>
                      <textarea
                        rows={3}
                        value={settingsForm.heroSubtitle}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })
                        }
                        className="w-full bg-[#25251F] border border-white/20 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#D8B786]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#D8B786] mb-1">
                          Button 1 (Primary)
                        </label>
                        <input
                          type="text"
                          value={settingsForm.heroButtonPrimary}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              heroButtonPrimary: e.target.value
                            })
                          }
                          className="w-full bg-[#25251F] border border-white/20 text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[#D8B786]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#D8B786] mb-1">
                          Button 2 (Map)
                        </label>
                        <input
                          type="text"
                          value={settingsForm.heroButtonSecondary}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              heroButtonSecondary: e.target.value
                            })
                          }
                          className="w-full bg-[#25251F] border border-white/20 text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[#D8B786]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#D8B786] mb-1">
                          Button 3 (Education)
                        </label>
                        <input
                          type="text"
                          value={settingsForm.heroButtonTertiary}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              heroButtonTertiary: e.target.value
                            })
                          }
                          className="w-full bg-[#25251F] border border-white/20 text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[#D8B786]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#D8B786] mb-1">
                        Emergency Top Helpline Notice
                      </label>
                      <input
                        type="text"
                        value={settingsForm.emergencyNotice}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, emergencyNotice: e.target.value })
                        }
                        className="w-full bg-[#25251F] border border-white/20 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#D8B786]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#D8B786] mb-1">
                          Official Contact Phone
                        </label>
                        <input
                          type="text"
                          value={settingsForm.contactPhone}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, contactPhone: e.target.value })
                          }
                          className="w-full bg-[#25251F] border border-white/20 text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[#D8B786]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#D8B786] mb-1">
                          Official Contact Email
                        </label>
                        <input
                          type="email"
                          value={settingsForm.contactEmail}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, contactEmail: e.target.value })
                          }
                          className="w-full bg-[#25251F] border border-white/20 text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[#D8B786]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={settingsSaving}
                      className="px-6 py-2.5 rounded-xl bg-[#9A542E] hover:bg-[#b06135] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      {settingsSaving ? 'Saving...' : 'Save Portal Settings'}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 6: AUDIT LOGS */}
              {activeTab === 'audit' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold font-serif text-white">
                    Administrative Activity & Audit Trail
                  </h3>
                  <div className="space-y-2">
                    {auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 rounded-xl bg-[#25251F] border border-white/5 flex items-start justify-between gap-4 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded text-[#D8B786]">
                              {log.action}
                            </span>
                            <span className="font-bold text-white">{log.performedBy}</span>
                          </div>
                          <p className="text-white/70 mt-1">{log.details}</p>
                        </div>
                        <span className="text-[10px] text-white/40 font-mono shrink-0">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add/Edit Listing Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#25251F] text-white p-6 sm:p-8 rounded-3xl max-w-2xl w-full border border-[#D8B786]/30 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold font-serif mb-4">
                {editingItem ? 'Edit Directory Record' : 'Add New Directory Record'}
              </h3>

              <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase text-[10px] font-bold text-[#D8B786] mb-1">
                    Institution / Place Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#1C1C17] border border-white/20 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-[#D8B786]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase text-[10px] font-bold text-[#D8B786] mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category || 'education'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as CategoryType
                        })
                      }
                      className="w-full bg-[#1C1C17] border border-white/20 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-[#D8B786]"
                    >
                      <option value="education">Education</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="accommodation">Accommodation</option>
                      <option value="destination">Tourist Destination</option>
                      <option value="government">Government Office</option>
                      <option value="business">Private Business</option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase text-[10px] font-bold text-[#D8B786] mb-1">
                      Town / Taluka *
                    </label>
                    <select
                      value={formData.town || 'Mithi'}
                      onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                      className="w-full bg-[#1C1C17] border border-white/20 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-[#D8B786]"
                    >
                      {TOWNS.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block uppercase text-[10px] font-bold text-[#D8B786] mb-1">
                    Full Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-[#1C1C17] border border-white/20 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-[#D8B786]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase text-[10px] font-bold text-[#D8B786] mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.latitude || 24.7438}
                      onChange={(e) =>
                        setFormData({ ...formData, latitude: parseFloat(e.target.value) })
                      }
                      className="w-full bg-[#1C1C17] border border-white/20 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-[#D8B786]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-[10px] font-bold text-[#D8B786] mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.longitude || 69.8000}
                      onChange={(e) =>
                        setFormData({ ...formData, longitude: parseFloat(e.target.value) })
                      }
                      className="w-full bg-[#1C1C17] border border-white/20 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-[#D8B786]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase text-[10px] font-bold text-[#D8B786] mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#1C1C17] border border-white/20 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-[#D8B786]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-[10px] font-bold text-[#D8B786] mb-1">
                      Official Verification Status
                    </label>
                    <select
                      value={formData.verificationStatus || 'verified'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          verificationStatus: e.target.value as any
                        })
                      }
                      className="w-full bg-[#1C1C17] border border-white/20 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-[#D8B786]"
                    >
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block uppercase text-[10px] font-bold text-[#D8B786] mb-1">
                    Detailed Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#1C1C17] border border-white/20 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-[#D8B786]"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#9A542E] hover:bg-[#b06135] text-white font-bold cursor-pointer"
                  >
                    Save Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
