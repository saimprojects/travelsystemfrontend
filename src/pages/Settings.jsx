import { useEffect, useState, useRef } from 'react';
import { usersAPI, agencyAPI } from '../services/api';
import {
  Plus, Edit, UserX, UserCheck, Building2, Phone, Mail, Shield, X, Save,
  Upload, Image, CheckCircle, FileText, Palette, MapPin, Info,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic Blue',
    description: 'Clean blue & white professional look',
    preview: (
      <div className="w-full h-20 rounded border overflow-hidden bg-white flex flex-col">
        <div className="bg-indigo-600 h-5 flex items-center px-2">
          <span className="text-white text-[6px] font-bold tracking-widest">INVOICE</span>
        </div>
        <div className="flex-1 flex gap-1 p-1">
          <div className="flex-1 bg-gray-50 rounded" />
          <div className="flex-1 bg-indigo-50 rounded" />
        </div>
        <div className="h-4 bg-indigo-50 mx-1 mb-1 rounded" />
      </div>
    ),
  },
  {
    id: 'gold_voucher',
    name: 'Gold Voucher',
    description: 'Elegant gold & brown travel voucher style',
    preview: (
      <div className="w-full h-20 rounded border overflow-hidden bg-white flex flex-col">
        <div className="flex justify-between items-start p-1.5 border-b border-amber-200">
          <div className="w-8 h-5 bg-amber-100 rounded flex items-center justify-center">
            <div className="w-4 h-4 bg-amber-400 rounded-full opacity-60" />
          </div>
          <div className="text-right">
            <div className="text-[7px] font-black text-amber-700 tracking-widest">INVOICE</div>
            <div className="flex gap-1 mt-0.5">
              <div className="bg-amber-600 rounded px-1 py-0.5"><span className="text-white text-[5px]">NO.</span></div>
              <div className="bg-amber-100 rounded px-1 py-0.5"><span className="text-amber-800 text-[5px]">DATE</span></div>
            </div>
          </div>
        </div>
        <div className="flex gap-1 p-1 flex-1">
          <div className="flex-1 border border-amber-200 rounded p-0.5"><div className="text-[5px] text-amber-700 font-bold">BOOKING INFO</div></div>
          <div className="flex-1 border border-amber-200 rounded p-0.5"><div className="text-[5px] text-amber-700 font-bold">GUEST INFO</div></div>
        </div>
        <div className="h-3 bg-amber-600 mx-1 mb-1 rounded opacity-80" />
      </div>
    ),
  },
  {
    id: 'dark_pro',
    name: 'Dark Professional',
    description: 'Bold dark header with gold accents',
    preview: (
      <div className="w-full h-20 rounded border overflow-hidden bg-white flex flex-col">
        <div className="bg-gray-900 p-1.5 flex justify-between items-center">
          <div className="w-8 h-5 bg-yellow-500 rounded flex items-center justify-center">
            <span className="text-gray-900 text-[5px] font-black">LOGO</span>
          </div>
          <span className="text-white text-[8px] font-black tracking-widest">INVOICE</span>
        </div>
        <div className="flex gap-2 p-1 text-[5px]">
          <div><span className="text-gray-500">Bill To:</span><div className="font-bold text-gray-800">Client Name</div></div>
          <div className="ml-auto text-right"><div className="bg-gray-100 px-1 rounded"><span className="font-bold">Balance Due</span></div></div>
        </div>
        <div className="mx-1 rounded overflow-hidden flex-1">
          <div className="bg-gray-800 h-3 flex items-center px-1 gap-2">
            <span className="text-gray-300 text-[4px]">ITEM</span>
            <span className="text-gray-300 text-[4px] ml-auto">AMT</span>
          </div>
          <div className="bg-gray-50 h-3" />
        </div>
      </div>
    ),
  },
  {
    id: 'minimal',
    name: 'Modern Minimal',
    description: 'Clean, ultra-minimal modern design',
    preview: (
      <div className="w-full h-20 rounded border overflow-hidden bg-white flex flex-col p-2">
        <div className="flex justify-between items-start mb-1">
          <div className="text-[6px] font-light text-gray-400 tracking-[3px] uppercase">Agency Name</div>
          <div className="text-[10px] font-thin text-gray-300 tracking-widest">INVOICE</div>
        </div>
        <div className="border-t border-gray-100 pt-1 flex gap-2 flex-1">
          <div className="flex-1">
            <div className="text-[5px] text-gray-400 uppercase tracking-widest mb-0.5">Bill To</div>
            <div className="text-[6px] font-medium text-gray-700">Client Name</div>
          </div>
          <div className="text-right">
            <div className="text-[5px] text-gray-400">Total</div>
            <div className="text-[8px] font-semibold text-gray-800">PKR 0</div>
          </div>
        </div>
        <div className="border-t border-gray-100 mt-1 pt-0.5">
          <div className="h-1.5 bg-gray-50 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: 'corporate',
    name: 'Corporate Teal',
    description: 'Professional teal & emerald corporate style',
    preview: (
      <div className="w-full h-20 rounded border overflow-hidden bg-white flex flex-col">
        <div className="bg-teal-700 p-1.5 flex items-center justify-between">
          <div className="text-white text-[7px] font-bold">Agency Name</div>
          <div className="text-teal-200 text-[6px] tracking-widest font-light">INVOICE</div>
        </div>
        <div className="h-0.5 bg-emerald-400" />
        <div className="flex gap-1 p-1 flex-1">
          <div className="flex-1">
            <div className="text-[5px] text-teal-600 font-semibold uppercase mb-0.5">Client</div>
            <div className="h-1.5 bg-teal-50 rounded mb-0.5" />
            <div className="h-1.5 bg-teal-50 rounded w-2/3" />
          </div>
          <div className="w-12 bg-teal-50 rounded p-0.5">
            <div className="text-[5px] text-teal-700 font-bold text-right">Total</div>
            <div className="text-[6px] font-black text-teal-800 text-right">PKR 0</div>
          </div>
        </div>
        <div className="h-3 bg-teal-50 mx-1 mb-1 rounded flex items-center px-1">
          <div className="h-1 w-full bg-teal-200 rounded" />
        </div>
      </div>
    ),
  },
];

const Settings = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);

  // Staff modal
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [staffForm, setStaffForm] = useState({
    username: '', email: '', password: '',
    first_name: '', last_name: '', phone_number: '', role: 'agent',
  });

  // Agency edit state
  const [editingAgency, setEditingAgency] = useState(false);
  const [agencyForm, setAgencyForm] = useState({
    name: '', phone_number: '', email: '', address: '', description: '', invoice_template: 'classic',
  });
  const [agencySubmitting, setAgencySubmitting] = useState(false);

  // Logo upload
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const logoInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, agencyRes] = await Promise.all([
        usersAPI.getUsers(),
        agencyAPI.getAgency(),
      ]);
      setUsers(usersRes.data.results || usersRes.data);
      const ag = agencyRes.data;
      setAgency(ag);
      setAgencyForm({
        name: ag.name || '',
        phone_number: ag.phone_number || '',
        email: ag.email || '',
        address: ag.address || '',
        description: ag.description || '',
        invoice_template: ag.invoice_template || 'classic',
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // ── Agency update ──────────────────────────────────────
  const handleAgencySubmit = async (e) => {
    e.preventDefault();
    setAgencySubmitting(true);
    try {
      let payload;
      if (logoFile) {
        payload = new FormData();
        Object.entries(agencyForm).forEach(([k, v]) => payload.append(k, v));
        payload.append('logo', logoFile);
      } else {
        payload = { ...agencyForm };
      }
      await agencyAPI.updateAgency(payload);
      toast.success('Agency updated successfully');
      setEditingAgency(false);
      setLogoFile(null);
      setLogoPreview(null);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to update agency');
    } finally {
      setAgencySubmitting(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Logo must be under 5MB'); return; }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  // ── Staff handlers ────────────────────────────────────
  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await usersAPI.updateUser(editingUser.id, staffForm);
        toast.success('User updated successfully');
      } else {
        await usersAPI.createUser(staffForm);
        toast.success('User created successfully');
      }
      setShowModal(false);
      resetStaffForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save user');
    }
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      if (isActive) {
        await usersAPI.deactivateUser(userId);
        toast.success('User deactivated');
      } else {
        await usersAPI.activateUser(userId);
        toast.success('User activated');
      }
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update user status');
    }
  };

  const openEditModal = (userToEdit) => {
    setEditingUser(userToEdit);
    setStaffForm({
      username: userToEdit.username,
      email: userToEdit.email || '',
      password: '',
      first_name: userToEdit.first_name || '',
      last_name: userToEdit.last_name || '',
      phone_number: userToEdit.phone_number || '',
      role: userToEdit.role,
    });
    setShowModal(true);
  };

  const resetStaffForm = () => {
    setStaffForm({ username: '', email: '', password: '', first_name: '', last_name: '', phone_number: '', role: 'agent' });
    setEditingUser(null);
  };

  const canManageRole = (targetRole) => {
    if (user.role === 'agency_owner') return true;
    if (user.role === 'manager') return targetRole !== 'agency_owner';
    return false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 animate-in fade-in-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full" />
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  const isOwnerOrManager = user.role === 'agency_owner' || user.role === 'manager';

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your agency profile, invoice templates, and staff</p>
      </div>

      {/* ══════════════════════════════════════════════
          AGENCY SETTINGS CARD
      ══════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in-50 duration-500">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Agency Profile</h2>
              <p className="text-sm text-gray-500">Name, contact info & logo shown on invoices</p>
            </div>
          </div>
          {isOwnerOrManager && !editingAgency && (
            <button
              onClick={() => setEditingAgency(true)}
              className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
          )}
        </div>

        <div className="p-6">
          {editingAgency ? (
            <form onSubmit={handleAgencySubmit} className="space-y-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Image className="inline w-4 h-4 mr-1 text-gray-500" />
                  Agency Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                    ) : agency?.logo_url ? (
                      <img src={agency.logo_url} alt="Agency logo" className="w-full h-full object-contain" />
                    ) : (
                      <Image className="w-8 h-8 text-gray-300" />
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {logoFile ? 'Change Logo' : 'Upload Logo'}
                    </button>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB. Shown on all invoices.</p>
                    {logoFile && (
                      <button
                        type="button"
                        onClick={() => { setLogoFile(null); setLogoPreview(null); }}
                        className="text-xs text-red-500 hover:text-red-700 mt-1"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </div>
              </div>

              {/* Agency Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Agency Name *</label>
                  <input
                    type="text"
                    value={agencyForm.name}
                    onChange={(e) => setAgencyForm({ ...agencyForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Your Agency Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline w-4 h-4 mr-1 text-gray-400" />Phone Number
                  </label>
                  <input
                    type="text"
                    value={agencyForm.phone_number}
                    onChange={(e) => setAgencyForm({ ...agencyForm, phone_number: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="+92 300 0000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline w-4 h-4 mr-1 text-gray-400" />Email Address
                  </label>
                  <input
                    type="email"
                    value={agencyForm.email}
                    onChange={(e) => setAgencyForm({ ...agencyForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="info@youragency.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1 text-gray-400" />Address
                  </label>
                  <input
                    type="text"
                    value={agencyForm.address}
                    onChange={(e) => setAgencyForm({ ...agencyForm, address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => { setEditingAgency(false); setLogoFile(null); setLogoPreview(null); }}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={agencySubmitting}
                  className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {agencySubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <div className="flex items-start gap-6">
              {/* Logo */}
              <div className="flex-shrink-0 w-20 h-20 border border-gray-200 rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden">
                {agency?.logo_url ? (
                  <img src={agency.logo_url} alt="Agency logo" className="w-full h-full object-contain" />
                ) : (
                  <Building2 className="w-8 h-8 text-gray-300" />
                )}
              </div>
              {/* Info */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Agency Name</p>
                  <p className="font-semibold text-gray-900">{agency?.name || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                  <p className="font-medium text-gray-700">{agency?.phone_number || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
                  <p className="font-medium text-gray-700">{agency?.email || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Address</p>
                  <p className="font-medium text-gray-700">{agency?.address || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    agency?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {agency?.status || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          INVOICE TEMPLATE SELECTOR
      ══════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in-50 duration-600">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Palette className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Invoice Template</h2>
              <p className="text-sm text-gray-500">Choose the design for all generated invoices</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Info className="w-4 h-4" />
            <span>Auto-saved on select</span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {TEMPLATES.map((tpl) => {
              const isSelected = (agencyForm.invoice_template || 'classic') === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={async () => {
                    if (!isOwnerOrManager) return;
                    const prev = agencyForm.invoice_template;
                    setAgencyForm((f) => ({ ...f, invoice_template: tpl.id }));
                    try {
                      await agencyAPI.updateAgency({ invoice_template: tpl.id });
                      toast.success(`Template changed to "${tpl.name}"`);
                      fetchData();
                    } catch {
                      setAgencyForm((f) => ({ ...f, invoice_template: prev }));
                      toast.error('Failed to save template');
                    }
                  }}
                  className={`relative group rounded-xl border-2 transition-all duration-200 p-3 text-left ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50 shadow-md shadow-purple-100'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  } ${!isOwnerOrManager ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  {tpl.preview}
                  <div className="mt-2">
                    <p className={`text-xs font-semibold leading-tight ${isSelected ? 'text-purple-700' : 'text-gray-700'}`}>
                      {tpl.name}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{tpl.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          STAFF MANAGEMENT
      ══════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in-50 duration-700">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Staff Management</h2>
              <p className="text-sm text-gray-500">Manage staff members and permissions</p>
            </div>
          </div>
          {isOwnerOrManager && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Staff Member
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((staffUser, index) => (
                <tr
                  key={staffUser.id}
                  className="hover:bg-gray-50/50 transition-colors duration-150 animate-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {staffUser.first_name?.charAt(0) || staffUser.username?.charAt(0) || 'U'}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{staffUser.first_name} {staffUser.last_name}</div>
                        <div className="text-xs text-gray-500">@{staffUser.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="w-3 h-3 mr-2 text-gray-400" />{staffUser.email || 'N/A'}
                      </div>
                      {staffUser.phone_number && (
                        <div className="text-xs text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-2 text-gray-400" />{staffUser.phone_number}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      <Shield className="w-3 h-3 mr-2" />{staffUser.role_display}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      staffUser.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${staffUser.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                      {staffUser.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {canManageRole(staffUser.role) && (
                        <>
                          <button
                            onClick={() => openEditModal(staffUser)}
                            className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {staffUser.role !== 'agency_owner' && (
                            <button
                              onClick={() => handleToggleActive(staffUser.id, staffUser.is_active)}
                              className={`p-1.5 hover:bg-gray-50 rounded-lg transition-all ${
                                staffUser.is_active ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={staffUser.is_active ? 'Deactivate' : 'Activate'}
                            >
                              {staffUser.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <UserX className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No staff members yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Staff Modal ──────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 animate-in fade-in duration-200" />
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {editingUser ? <Edit className="w-6 h-6 text-blue-600" /> : <Plus className="w-6 h-6 text-blue-600" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{editingUser ? 'Edit Staff Member' : 'Add Staff Member'}</h2>
                    <p className="text-sm text-gray-500 mt-1">{editingUser ? 'Update staff member details' : 'Add a new staff member to your agency'}</p>
                  </div>
                </div>
                <button onClick={() => { setShowModal(false); resetStaffForm(); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleStaffSubmit} className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                    <input type="text" value={staffForm.username} onChange={(e) => setStaffForm({ ...staffForm, username: e.target.value })} required disabled={!!editingUser}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input type="email" value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                  </div>
                  {!editingUser && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                      <input type="password" value={staffForm.password} onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })} required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input type="text" value={staffForm.first_name} onChange={(e) => setStaffForm({ ...staffForm, first_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input type="text" value={staffForm.last_name} onChange={(e) => setStaffForm({ ...staffForm, last_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input type="text" value={staffForm.phone_number} onChange={(e) => setStaffForm({ ...staffForm, phone_number: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                    <select value={staffForm.role} onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                      {user.role === 'agency_owner' && <option value="manager">Manager</option>}
                      <option value="agent">Agent</option>
                      <option value="accountant">Accountant</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                  <button type="button" onClick={() => { setShowModal(false); resetStaffForm(); }}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm">
                    <Save className="w-4 h-4 mr-2" />{editingUser ? 'Update Staff Member' : 'Create Staff Member'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
