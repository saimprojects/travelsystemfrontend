import { useEffect, useState, useRef } from 'react';
import { servicesAPI } from '../services/api';
import { Plus, Edit, Trash2, Power, PowerOff, Eye, Package, MapPin, Clock, DollarSign, Tag, Info, X, Save, AlertCircle, Printer, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Services = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const searchInputRef = useRef(null);

  const [formData, setFormData] = useState({
    service_name: '',
    service_include: [],
    service_base_cost: '',
    service_profit: '',
    service_duration: '',
    destination: '',
    status: 'active',
  });
  const [newInclusion, setNewInclusion] = useState('');

  const canManage = user?.role === 'agency_owner' || user?.role === 'manager';
  const isAgent = user?.role === 'agent';

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchTerm, services]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getServices();
      const servicesData = response.data.results || response.data;
      setServices(servicesData);
      setFilteredServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    if (!searchTerm.trim()) {
      setFilteredServices(services);
      return;
    }

    setSearchLoading(true);
    const searchLower = searchTerm.toLowerCase();
    
    const filtered = services.filter(service => 
      service.service_name.toLowerCase().includes(searchLower) ||
      service.destination.toLowerCase().includes(searchLower) ||
      (service.service_include && 
        service.service_include.some(inclusion => 
          inclusion.toLowerCase().includes(searchLower)
        )
      )
    );
    
    setFilteredServices(filtered);
    setSearchLoading(false);
  };

  const handleSearch = () => {
    filterServices();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Format PKR currency
  const formatPKR = (amount) => {
    if (!amount && amount !== 0) return '₨ 0';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₨ ${num.toLocaleString('en-PK')}`;
  };

  const printServiceDetails = (service) => {
    const printWindow = window.open('', '_blank');
    
    const printHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Service Details - ${service.service_name}</title>
        <style>
          @media print {
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            
            body {
              margin: 0 !important;
              padding: 0 !important;
              font-family: Arial, sans-serif !important;
              font-size: 12pt !important;
              line-height: 1.4 !important;
              color: #000 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .no-print {
              display: none !important;
            }
            
            .service-container {
              width: 100% !important;
              max-width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
              border: none !important;
              box-shadow: none !important;
            }
            
            .service-header {
              text-align: center;
              margin-bottom: 5mm !important;
              padding-bottom: 3mm !important;
              border-bottom: 1mm solid #000 !important;
            }
            
            .service-header h1 {
              margin: 0 !important;
              font-size: 24pt !important;
              font-weight: bold !important;
              color: #000 !important;
            }
            
            .service-header h2 {
              margin: 2mm 0 0 0 !important;
              font-size: 14pt !important;
              font-weight: normal !important;
              color: #666 !important;
            }
            
            .details-section {
              margin: 5mm 0 !important;
            }
            
            .details-section h3 {
              margin: 0 0 3mm 0 !important;
              font-size: 16pt !important;
              font-weight: bold !important;
              color: #000 !important;
              border-bottom: 0.5mm solid #ccc !important;
              padding-bottom: 1mm !important;
            }
            
            .details-grid {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 3mm !important;
              margin-bottom: 3mm !important;
            }
            
            .detail-item {
              margin-bottom: 2mm !important;
              padding: 2mm !important;
              background: #f9f9f9 !important;
              border: 0.2mm solid #ddd !important;
              border-radius: 1mm !important;
            }
            
            .detail-label {
              font-size: 10pt !important;
              font-weight: bold !important;
              color: #666 !important;
              margin-bottom: 0.5mm !important;
            }
            
            .detail-value {
              font-size: 12pt !important;
              font-weight: bold !important;
              color: #000 !important;
            }
            
            .price-highlight {
              color: #006400 !important;
              font-size: 14pt !important;
              font-weight: bold !important;
            }
            
            .inclusions-list {
              margin: 2mm 0 !important;
              padding-left: 5mm !important;
            }
            
            .inclusion-item {
              margin-bottom: 1mm !important;
              font-size: 11pt !important;
            }
            
            .footer {
              margin-top: 10mm !important;
              text-align: center !important;
              font-size: 10pt !important;
              color: #666 !important;
              border-top: 0.5mm solid #ccc !important;
              padding-top: 3mm !important;
            }
            
            .print-button {
              display: none !important;
            }
          }
          
          @media screen {
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              padding: 20px;
              background: #f5f5f5;
            }
            
            .service-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .service-header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #4f46e5;
            }
            
            .service-header h1 {
              margin: 0;
              color: #4f46e5;
              font-size: 32px;
            }
            
            .service-header h2 {
              margin: 10px 0 0 0;
              color: #666;
              font-size: 18px;
            }
            
            .details-section {
              margin: 20px 0;
            }
            
            .details-section h3 {
              margin: 0 0 15px 0;
              color: #4f46e5;
              font-size: 20px;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 20px;
            }
            
            .detail-item {
              padding: 15px;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
            }
            
            .detail-label {
              font-size: 12px;
              font-weight: 600;
              color: #666;
              margin-bottom: 5px;
              text-transform: uppercase;
            }
            
            .detail-value {
              font-size: 16px;
              font-weight: 700;
              color: #000;
            }
            
            .price-highlight {
              color: #059669;
              font-size: 18px;
            }
            
            .inclusions-list {
              margin: 15px 0;
              padding-left: 20px;
            }
            
            .inclusion-item {
              margin-bottom: 8px;
              font-size: 14px;
              line-height: 1.5;
            }
            
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #eee;
              padding-top: 20px;
            }
            
            .print-button {
              position: fixed;
              top: 20px;
              right: 20px;
              padding: 12px 24px;
              background: #4f46e5;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 600;
              font-size: 14px;
              display: flex;
              align-items: center;
              gap: 8px;
              transition: background 0.3s;
            }
            
            .print-button:hover {
              background: #4338ca;
            }
          }
        </style>
      </head>
      <body>
        <button class="print-button" onclick="window.print()">
          🖨️ Print Service Details
        </button>
        
        <div class="service-container">
          <div class="service-header">
            <h1>${service.service_name}</h1>
            <h2>Travel Package Details</h2>
          </div>
          
          <div class="details-section">
            <h3>Package Information</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Destination</div>
                <div class="detail-value">${service.destination}</div>
              </div>
              
              <div class="detail-item">
                <div class="detail-label">Duration</div>
                <div class="detail-value">${service.service_duration}</div>
              </div>
              
              <div class="detail-item">
                <div class="detail-label">Package Status</div>
                <div class="detail-value">${service.status.toUpperCase()}</div>
              </div>
              
              <div class="detail-item">
                <div class="detail-label">Total Price</div>
                <div class="detail-value price-highlight">${formatPKR(service.service_total_price)}</div>
              </div>
            </div>
          </div>
          

          
          <div class="details-section">
            <h3>Service Inclusions</h3>
            ${service.service_include && service.service_include.length > 0 ? `
              <ul class="inclusions-list">
                ${service.service_include.map(item => `
                  <li class="inclusion-item">${item}</li>
                `).join('')}
              </ul>
            ` : `
              <div class="detail-item">
                <div class="detail-value">No inclusions listed for this package</div>
              </div>
            `}
          </div>
          
          <div class="footer">
            <p>For more information and bookings, please contact our agency.</p>
            <p>Document generated on ${new Date().toLocaleDateString('en-PK', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}</p>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            // Optional: Auto-print
            // window.print();
          };
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(printHTML);
    printWindow.document.close();
    
    toast.success('Service details opened in new window. Click print button to print.');
  };

  const openDetailsModal = async (service) => {
    setShowDetailsModal(true);
    setDetailsLoading(true);
    setSelectedService(null);

    try {
      const res = await servicesAPI.getService(service.id);
      setSelectedService(res.data);
    } catch (error) {
      console.error('Error fetching service details:', error);
      toast.error('Failed to load service details');
      setShowDetailsModal(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.service_name.trim()) {
      errors.service_name = 'Service name is required';
    }
    
    if (!formData.destination.trim()) {
      errors.destination = 'Destination is required';
    }
    
    if (!formData.service_base_cost || parseFloat(formData.service_base_cost) <= 0) {
      errors.service_base_cost = 'Valid base cost is required';
    }
    
    if (!formData.service_profit || parseFloat(formData.service_profit) < 0) {
      errors.service_profit = 'Valid profit amount is required';
    }
    
    if (!formData.service_duration.trim()) {
      errors.service_duration = 'Duration is required';
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
      const requestData = {
        ...formData,
        service_base_cost: parseFloat(formData.service_base_cost),
        service_profit: parseFloat(formData.service_profit),
      };
      
      if (editingService) {
        await servicesAPI.updateService(editingService.id, requestData);
        toast.success('Service updated successfully');
      } else {
        await servicesAPI.createService(requestData);
        toast.success('Service created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to save service';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await servicesAPI.deleteService(id);
        toast.success('Service deleted successfully');
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error('Failed to delete service');
      }
    }
  };

  const handleToggleStatus = async (service) => {
    try {
      if (service.status === 'active') {
        await servicesAPI.deactivateService(service.id);
        toast.success('Service deactivated');
      } else {
        await servicesAPI.activateService(service.id);
        toast.success('Service activated');
      }
      fetchServices();
    } catch (error) {
      console.error('Error toggling service status:', error);
      toast.error('Failed to update service status');
    }
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      service_name: service.service_name,
      service_include: service.service_include || [],
      service_base_cost: service.service_base_cost,
      service_profit: service.service_profit,
      service_duration: service.service_duration,
      destination: service.destination,
      status: service.status,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      service_name: '',
      service_include: [],
      service_base_cost: '',
      service_profit: '',
      service_duration: '',
      destination: '',
      status: 'active',
    });
    setNewInclusion('');
    setFormErrors({});
    setEditingService(null);
    setSubmitting(false);
  };

  const addInclusion = () => {
    if (newInclusion.trim()) {
      setFormData({
        ...formData,
        service_include: [...formData.service_include, newInclusion.trim()],
      });
      setNewInclusion('');
    }
  };

  const removeInclusion = (index) => {
    setFormData({
      ...formData,
      service_include: formData.service_include.filter((_, i) => i !== index),
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
          <p className="mt-4 text-gray-600 font-medium">Loading services...</p>
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
            Services Management
          </h1>
          <p className="text-gray-600 mt-2 animate-in slide-in-from-left-4 duration-700">
            Manage travel packages and services offered by your agency
          </p>
        </div>
        
        {canManage && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 animate-in slide-in-from-right-4 duration-500"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Service
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-in fade-in-50 duration-500">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by service name, destination, or inclusions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-12 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {searchTerm && (
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
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-gray-500">
            Tip: Search by service name, destination, or inclusions
          </p>
          {searchTerm && (
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-600">
                Results for: <span className="font-medium text-gray-900">"{searchTerm}"</span>
                <span className="ml-2 text-gray-500">• {filteredServices.length} found</span>
              </p>
              <button
                onClick={handleClearSearch}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <div 
              key={service.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in-50 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Service Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {service.service_name}
                      </h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {service.destination}
                      </div>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    service.status === 'active' 
                      ? 'bg-green-100 text-green-800 animate-pulse' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {service.status}
                  </span>
                </div>
              </div>

              {/* Service Details */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <Clock className="w-3 h-3 mr-2 text-gray-400" />
                      {service.service_duration}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Price</p>
                    <div className="flex items-center text-lg font-bold text-gray-900">
                      <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                      {formatPKR(service.service_total_price)}
                    </div>
                  </div>
                </div>

                {/* Inclusions Preview */}
                {service.service_include?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Inclusions</p>
                    <div className="space-y-1">
                      {service.service_include.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-700">
                          <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                          {item}
                        </div>
                      ))}
                      {service.service_include.length > 2 && (
                        <p className="text-xs text-gray-500 mt-1">
                          +{service.service_include.length - 2} more inclusions
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Management Details (only for managers/owners) */}
                {canManage && (
                  <div className="bg-gray-50/50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Base Cost</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPKR(service.service_base_cost)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Profit</p>
                        <p className="text-sm font-medium text-green-700">
                          {formatPKR(service.service_profit)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {/* View Details Button */}
                  <button
                    onClick={() => openDetailsModal(service)}
                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </button>
                  
                  {/* Print Button */}
                  {/* <button
                    onClick={() => printServiceDetails(service)}
                    className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 px-3 py-1.5 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                  >
                    <Printer className="w-4 h-4 mr-1" />
                    Print
                  </button> */}
                </div>

                {/* Management Actions */}
                {canManage && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(service)}
                      className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleToggleStatus(service)}
                      className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200 ${
                        service.status === 'active' 
                          ? 'text-amber-600 hover:text-amber-700' 
                          : 'text-green-600 hover:text-green-700'
                      }`}
                      title={service.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {service.status === 'active' ? (
                        <PowerOff className="w-4 h-4" />
                      ) : (
                        <Power className="w-4 h-4" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center animate-in fade-in-50">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No services found' : 'No services yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? `No services found for "${searchTerm}". Try a different search term.`
              : 'Add your first service to start offering travel packages'}
          </p>
          {canManage && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5 mr-2" />
              {searchTerm ? 'Create New Service' : 'Create Your First Service'}
            </button>
          )}
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="ml-3 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Agent Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-in fade-in duration-200"></div>
          
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-300">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Info className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Service Details</h2>
                    <p className="text-sm text-gray-500 mt-1">Complete information about this service</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedService && (
                    <button
                      onClick={() => printServiceDetails(selectedService)}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedService(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              {detailsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : selectedService ? (
                <div className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50/50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Service Name</p>
                      <p className="font-semibold text-gray-900">{selectedService.service_name}</p>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Destination</p>
                      <p className="font-semibold text-gray-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedService.destination}
                      </p>
                    </div>
                  </div>

                  {/* Pricing & Duration */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50/50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Duration</p>
                      <p className="font-semibold text-gray-900 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-400" />
                        {selectedService.service_duration}
                      </p>
                    </div>
                    <div className="bg-green-50/50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Total Price</p>
                      <p className="font-semibold text-gray-900 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                        {formatPKR(selectedService.service_total_price)}
                      </p>
                    </div>
                    <div className="bg-purple-50/50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Status</p>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        selectedService.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedService.status}
                      </span>
                    </div>
                  </div>

                  {/* Management Details (only for managers/owners) */}
                  {/* {canManage && (
                    <div className="bg-yellow-50/50 p-4 rounded-lg border border-yellow-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-yellow-600" />
                        Cost Breakdown (Management View)
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Base Cost</p>
                          <p className="font-semibold text-gray-900">
                            {formatPKR(selectedService.service_base_cost)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Profit</p>
                          <p className="font-semibold text-green-700">
                            {formatPKR(selectedService.service_profit)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )} */}

                  {/* Inclusions */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Tag className="w-5 h-5 text-gray-400 mr-2" />
                      <h3 className="font-semibold text-gray-900">Service Inclusions</h3>
                    </div>
                    
                    {Array.isArray(selectedService.service_include) && selectedService.service_include.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {selectedService.service_include.map((item, idx) => (
                          <div 
                            key={idx}
                            className="bg-gray-50 p-3 rounded-lg border border-gray-200 animate-in fade-in-50"
                            style={{ animationDelay: `${idx * 50}ms` }}
                          >
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              <span className="text-sm text-gray-800">{item}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50/50 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-600">No inclusions available for this service</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-500">No service details found.</p>
                </div>
              )}

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 flex justify-between">
                {selectedService && (
                  <button
                    onClick={() => printServiceDetails(selectedService)}
                    className="flex items-center px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Service Details
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedService(null);
                  }}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-in fade-in duration-200"></div>
          
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-300">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {editingService ? (
                      <Edit className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Plus className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {editingService ? 'Edit Service' : 'Create New Service'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {editingService ? 'Update service details' : 'Add a new travel package'}
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
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Service Name & Destination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      value={formData.service_name}
                      onChange={(e) => {
                        setFormData({ ...formData, service_name: e.target.value });
                        if (formErrors.service_name) setFormErrors({ ...formErrors, service_name: '' });
                      }}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        formErrors.service_name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Dubai Luxury Tour"
                    />
                    {formErrors.service_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {formErrors.service_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination *
                    </label>
                    <input
                      type="text"
                      value={formData.destination}
                      onChange={(e) => {
                        setFormData({ ...formData, destination: e.target.value });
                        if (formErrors.destination) setFormErrors({ ...formErrors, destination: '' });
                      }}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        formErrors.destination ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Dubai, UAE"
                    />
                    {formErrors.destination && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {formErrors.destination}
                      </p>
                    )}
                  </div>
                </div>

                {/* Pricing & Duration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Cost (PKR) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">₨</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.service_base_cost}
                        onChange={(e) => {
                          setFormData({ ...formData, service_base_cost: e.target.value });
                          if (formErrors.service_base_cost) setFormErrors({ ...formErrors, service_base_cost: '' });
                        }}
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          formErrors.service_base_cost ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {formErrors.service_base_cost && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {formErrors.service_base_cost}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profit (PKR) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">₨</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.service_profit}
                        onChange={(e) => {
                          setFormData({ ...formData, service_profit: e.target.value });
                          if (formErrors.service_profit) setFormErrors({ ...formErrors, service_profit: '' });
                        }}
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          formErrors.service_profit ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {formErrors.service_profit && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {formErrors.service_profit}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={formData.service_duration}
                      onChange={(e) => {
                        setFormData({ ...formData, service_duration: e.target.value });
                        if (formErrors.service_duration) setFormErrors({ ...formErrors, service_duration: '' });
                      }}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        formErrors.service_duration ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 7 Days / 6 Nights"
                    />
                    {formErrors.service_duration && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {formErrors.service_duration}
                      </p>
                    )}
                  </div>
                </div>

                {/* Inclusions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Service Inclusions
                  </label>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newInclusion}
                      onChange={(e) => setNewInclusion(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclusion())}
                      placeholder="Add an inclusion (e.g., Flight Tickets)"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                    <button
                      type="button"
                      onClick={addInclusion}
                      className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.service_include.length > 0 && (
                    <div className="space-y-2 max-h-40 overflow-y-auto p-2">
                      {formData.service_include.map((inclusion, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 animate-in slide-in-from-bottom-2"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            <span className="text-sm text-gray-800">{inclusion}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeInclusion(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                        {editingService ? 'Update Service' : 'Create Service'}
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

export default Services;