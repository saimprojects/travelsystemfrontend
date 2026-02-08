import { useEffect, useState, useRef } from 'react';
import { clientsAPI } from '../services/api';
import { Plus, Edit, Trash2, Search, Eye, StickyNote, User, Phone, Mail, MapPin, Calendar, FileText, X, Save, AlertCircle, Users, Shield, Briefcase, Clock, Building, ExternalLink, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // For actual search
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const searchInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    alternative_number: '',
    email: '',
    passport_number: '',
    cnic: '',
    address: '',
    date_of_birth: '',
    nationality: '',
    occupation: '',
    emergency_contact: '',
  });

  // Fetch clients on mount and when searchQuery changes
  useEffect(() => {
    fetchClients();
  }, [searchQuery]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientsAPI.getClients({ search: searchQuery });
      setClients(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  // Handle Enter key press for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle search button click
  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setSearchLoading(true);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const fetchClientDetail = async (id) => {
    setNotesLoading(true);
    try {
      const res = await clientsAPI.getClient(id);
      setSelectedClient(res.data);
    } catch (error) {
      console.error('Error fetching client detail:', error);
      toast.error('Failed to load client details');
      setShowNotesModal(false);
    } finally {
      setNotesLoading(false);
    }
  };

  const openNotesModal = async (client) => {
    setShowNotesModal(true);
    setSelectedClient(null);
    setNewNote('');
    await fetchClientDetail(client.id);
  };

  const handleAddNote = async () => {
    if (!selectedClient?.id) return;

    if (!newNote.trim()) {
      toast.error('Please write a note');
      return;
    }

    setAddingNote(true);
    try {
      await clientsAPI.addNote(selectedClient.id, { note: newNote.trim() });
      toast.success('Note added successfully');
      setNewNote('');
      await fetchClientDetail(selectedClient.id);
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error(error.response?.data?.detail || 'Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.phone_number.trim()) {
      errors.phone_number = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone_number)) {
      errors.phone_number = 'Please enter a valid phone number';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (formData.cnic && !/^[0-9-]+$/.test(formData.cnic)) {
      errors.cnic = 'Please enter a valid CNIC';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }
    
    setSubmitting(true);
    try {
      if (editingClient) {
        await clientsAPI.updateClient(editingClient.id, formData);
        toast.success('Client updated successfully');
      } else {
        await clientsAPI.createClient(formData);
        toast.success('Client created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchClients();
    } catch (error) {
      console.error('Error saving client:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to save client';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientsAPI.deleteClient(id);
        toast.success('Client deleted successfully');
        fetchClients();
      } catch (error) {
        console.error('Error deleting client:', error);
        toast.error('Failed to delete client');
      }
    }
  };

  const openEditModal = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone_number: client.phone_number,
      alternative_number: client.alternative_number || '',
      email: client.email || '',
      passport_number: client.passport_number || '',
      cnic: client.cnic || '',
      address: client.address || '',
      date_of_birth: client.date_of_birth || '',
      nationality: client.nationality || '',
      occupation: client.occupation || '',
      emergency_contact: client.emergency_contact || '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone_number: '',
      alternative_number: '',
      email: '',
      passport_number: '',
      cnic: '',
      address: '',
      date_of_birth: '',
      nationality: '',
      occupation: '',
      emergency_contact: '',
    });
    setFormErrors({});
    setEditingClient(null);
    setSubmitting(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 animate-in fade-in-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 animate-in slide-in-from-left-4 duration-500">
            Clients Management
          </h1>
          <p className="text-gray-600 mt-2 animate-in slide-in-from-left-4 duration-700">
            Manage your clients and their information
          </p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 animate-in slide-in-from-right-4 duration-500"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Client
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-in fade-in-50 duration-500">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Type and press Enter to search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-12 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searchLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-1" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>
        {searchQuery && (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing results for: <span className="font-medium text-gray-900">"{searchQuery}"</span>
              <span className="ml-2 text-gray-500">• {clients.length} clients found</span>
            </p>
            <button
              onClick={handleClearSearch}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Clients Grid/Cards */}
      {clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client, index) => (
            <div 
              key={client.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in-50 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Client Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {client.name}
                      </h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Phone className="w-3 h-3 mr-1" />
                        {client.phone_number}
                      </div>
                    </div>
                  </div>
                  
                  {/* Total Bookings Badge */}
                  {client.total_bookings > 0 && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {client.total_bookings} booking{client.total_bookings > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Client Details */}
              <div className="p-5 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="truncate">{client.email || 'No email'}</span>
                  </div>
                  
                  {client.passport_number && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FileText className="w-4 h-4 mr-3 text-gray-400" />
                      <span>Passport: {client.passport_number}</span>
                    </div>
                  )}
                  
                  {client.cnic && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Shield className="w-4 h-4 mr-3 text-gray-400" />
                      <span>CNIC: {client.cnic}</span>
                    </div>
                  )}
                  
                  {client.nationality && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                      <span>{client.nationality}</span>
                    </div>
                  )}
                </div>

                {/* Last Booking Info */}
                {client.last_booking_date && (
                  <div className="bg-gray-50/50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Last Booking</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(client.last_booking_date)}
                        </p>
                      </div>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <button
                  onClick={() => openNotesModal(client)}
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <StickyNote className="w-4 h-4 mr-1" />
                  Notes
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(client)}
                    className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center animate-in fade-in-50">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No clients found' : 'No clients yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? `No clients found for "${searchQuery}". Try a different search term.`
              : 'Add your first client to get started'}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            {searchQuery ? 'Add New Client' : 'Add First Client'}
          </button>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="ml-3 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-in fade-in duration-200"></div>
          
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl animate-in slide-in-from-bottom-4 duration-300">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <StickyNote className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Client Notes & Details</h2>
                    <p className="text-sm text-gray-500 mt-1">View and manage client information</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowNotesModal(false);
                    setSelectedClient(null);
                    setNewNote('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              {notesLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : selectedClient ? (
                <div className="p-6 space-y-6">
                  {/* Client Info Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50/50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Client Name</p>
                      <p className="font-semibold text-gray-900 flex items-center">
                        <User className="w-4 h-4 mr-2 text-blue-400" />
                        {selectedClient.name}
                      </p>
                    </div>
                    <div className="bg-green-50/50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Contact</p>
                      <p className="font-semibold text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-green-500" />
                        {selectedClient.phone_number}
                      </p>
                    </div>
                    <div className="bg-purple-50/50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Email</p>
                      <p className="font-semibold text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-purple-500" />
                        {selectedClient.email || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-amber-50/50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Total Bookings</p>
                      <p className="font-semibold text-gray-900 flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-amber-500" />
                        {selectedClient.total_bookings || 0}
                      </p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-3 gap-4">
                    {selectedClient.passport_number && (
                      <div className="bg-gray-50/50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Passport No.</p>
                        <p className="text-sm font-medium text-gray-900">{selectedClient.passport_number}</p>
                      </div>
                    )}
                    {selectedClient.cnic && (
                      <div className="bg-gray-50/50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">CNIC</p>
                        <p className="text-sm font-medium text-gray-900">{selectedClient.cnic}</p>
                      </div>
                    )}
                    {selectedClient.nationality && (
                      <div className="bg-gray-50/50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Nationality</p>
                        <p className="text-sm font-medium text-gray-900">{selectedClient.nationality}</p>
                      </div>
                    )}
                  </div>

                  {/* Add New Note */}
                  <div className="bg-gray-50/50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Add New Note</h3>
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows="3"
                      placeholder="Write a note about this client..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="button"
                        onClick={handleAddNote}
                        disabled={addingNote}
                        className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {addingNote ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            <StickyNote className="w-4 h-4 mr-2" />
                            Add Note
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Existing Notes */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Client Notes</h3>
                    {Array.isArray(selectedClient.notes) && selectedClient.notes.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {selectedClient.notes.map((note, index) => (
                          <div 
                            key={note.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 animate-in fade-in-50"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                  <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-gray-900">
                                    {note.created_by_name || 'Unknown User'}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(note.created_at).toLocaleString('en-PK', {
                                      dateStyle: 'medium',
                                      timeStyle: 'short'
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-800 whitespace-pre-wrap bg-gray-50/50 p-3 rounded">
                              {note.note}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50/50 rounded-lg">
                        <StickyNote className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">No notes yet</p>
                        <p className="text-xs text-gray-500 mt-1">Add the first note above</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-500">No client details found.</p>
                </div>
              )}

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100">
                <button
                  onClick={() => {
                    setShowNotesModal(false);
                    setSelectedClient(null);
                    setNewNote('');
                  }}
                  className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Client Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-in fade-in duration-200"></div>
          
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-300">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {editingClient ? (
                      <Edit className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Plus className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {editingClient ? 'Edit Client' : 'Create New Client'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {editingClient ? 'Update client information' : 'Add a new client to your agency'}
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
              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Personal Information */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                        }}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          formErrors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="John Doe"
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        value={formData.phone_number}
                        onChange={(e) => {
                          setFormData({ ...formData, phone_number: e.target.value });
                          if (formErrors.phone_number) setFormErrors({ ...formErrors, phone_number: '' });
                        }}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          formErrors.phone_number ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="+92 300 1234567"
                      />
                      {formErrors.phone_number && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {formErrors.phone_number}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alternative Number
                      </label>
                      <input
                        type="text"
                        value={formData.alternative_number}
                        onChange={(e) => setFormData({ ...formData, alternative_number: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Optional"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          formErrors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="john@example.com"
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {formErrors.email}
                        </p>
                      )}
                    </div>



                  </div>
                </div>

                {/* Identification */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    Identification
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passport Number
                      </label>
                      <input
                        type="text"
                        value={formData.passport_number}
                        onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="AB1234567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CNIC
                      </label>
                      <input
                        type="text"
                        value={formData.cnic}
                        onChange={(e) => {
                          setFormData({ ...formData, cnic: e.target.value });
                          if (formErrors.cnic) setFormErrors({ ...formErrors, cnic: '' });
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          formErrors.cnic ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="12345-6789012-3"
                      />
                      {formErrors.cnic && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {formErrors.cnic}
                        </p>
                      )}
                    </div>


                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    Address
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complete Address
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="House #, Street, City, Country"
                    />
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
                    disabled={submitting}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {editingClient ? 'Update Client' : 'Create Client'}
                      </>
                    )}
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

export default Clients;