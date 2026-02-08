import { useEffect, useState } from 'react';
import { usersAPI, agencyAPI } from '../services/api';
import { Plus, Edit, UserX, UserCheck, Building2, Phone, Mail, Shield, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    role: 'agent',
  });

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
      setAgency(agencyRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await usersAPI.updateUser(editingUser.id, formData);
        toast.success('User updated successfully');
      } else {
        await usersAPI.createUser(formData);
        toast.success('User created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving user:', error);
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
      console.error('Error toggling user status:', error);
      toast.error(error.response?.data?.detail || 'Failed to update user status');
    }
  };

  const openEditModal = (userToEdit) => {
    setEditingUser(userToEdit);
    setFormData({
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

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      role: 'agent',
    });
    setEditingUser(null);
  };

  const canManageRole = (targetRole) => {
    if (user.role === 'agency_owner') return true;
    if (user.role === 'manager') {
      return targetRole !== 'agency_owner';
    }
    return false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 animate-in fade-in-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 animate-in slide-in-from-left-4 duration-500">
          Settings
        </h1>
        <p className="text-gray-600 mt-2 animate-in slide-in-from-left-4 duration-700">
          Manage your agency and staff members
        </p>
      </div>

      {/* Agency Information Card */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm animate-in fade-in-50 duration-500 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Agency Information</h2>
              <p className="text-gray-600 mt-1">Manage your agency details</p>
            </div>
          </div>
          
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            agency?.status === 'active' 
              ? 'bg-green-100 text-green-800 animate-pulse' 
              : 'bg-red-100 text-red-800'
          }`}>
            {agency?.status || 'N/A'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Agency Name</p>
                <p className="text-lg font-semibold text-gray-900">{agency?.name || 'N/A'}</p>
              </div>
            </div>
          </div>



        </div>
      </div>

      {/* Staff Management Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in-50 duration-700">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Staff Management</h2>
            <p className="text-sm text-gray-500 mt-1">Manage staff members and permissions</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Staff Member
          </button>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr className="animate-in fade-in-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
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
                        <div className="text-sm font-medium text-gray-900">
                          {staffUser.first_name} {staffUser.last_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          @{staffUser.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="w-3 h-3 mr-2 text-gray-400" />
                        {staffUser.email || 'N/A'}
                      </div>
                      {staffUser.phone_number && (
                        <div className="text-xs text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-2 text-gray-400" />
                          {staffUser.phone_number}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      <Shield className="w-3 h-3 mr-2" />
                      {staffUser.role_display}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      staffUser.is_active 
                        ? 'bg-green-50 text-green-700 animate-pulse' 
                        : 'bg-red-50 text-red-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        staffUser.is_active ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      {staffUser.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {canManageRole(staffUser.role) && (
                        <>
                          <button
                            onClick={() => openEditModal(staffUser)}
                            className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {staffUser.role !== 'agency_owner' && (
                            <button
                              onClick={() => handleToggleActive(staffUser.id, staffUser.is_active)}
                              className={`p-1.5 hover:bg-gray-50 rounded-lg transition-all duration-200 ${
                                staffUser.is_active 
                                  ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                                  : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                              }`}
                              title={staffUser.is_active ? 'Deactivate' : 'Activate'}
                            >
                              {staffUser.is_active ? (
                                <UserX className="w-4 h-4" />
                              ) : (
                                <UserCheck className="w-4 h-4" />
                              )}
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
              <p className="text-sm text-gray-400 mt-1">Add your first staff member to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-in fade-in duration-200"></div>
          
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-300">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {editingUser ? (
                      <Edit className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Plus className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {editingUser ? 'Edit Staff Member' : 'Add Staff Member'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {editingUser ? 'Update staff member details' : 'Add a new staff member to your agency'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                      disabled={!!editingUser}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>

                  {!editingUser && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required={!editingUser}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    >
                      {user.role === 'agency_owner' && <option value="manager">Manager</option>}
                      <option value="agent">Agent</option>
                      <option value="accountant">Accountant</option>
                    </select>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingUser ? 'Update Staff Member' : 'Create Staff Member'}
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