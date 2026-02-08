// // import { useEffect, useState } from 'react';
// // import { onboardAPI, agencyAPI, clientsAPI, servicesAPI } from '../services/api';
// // import { Calendar, Search, Printer, Filter, X } from 'lucide-react';
// // import toast from 'react-hot-toast';

// // const Onboard = () => {
// //   const [bookings, setBookings] = useState([]);
// //   const [clients, setClients] = useState([]);
// //   const [services, setServices] = useState([]);
// //   const [agency, setAgency] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [filters, setFilters] = useState({
// //     start_date: '',
// //     end_date: '',
// //     payment_status: '',
// //   });

// //   useEffect(() => {
// //     fetchData();
// //   }, [filters]);

// //   const fetchData = async () => {
// //     try {
// //       setLoading(true);
// //       const params = {};
// //       if (filters.start_date) params.start_date = filters.start_date;
// //       if (filters.end_date) params.end_date = filters.end_date;
// //       if (filters.payment_status) params.payment_status = filters.payment_status;

// //       const [onboardRes, clientsRes, servicesRes, agencyRes] = await Promise.all([
// //         onboardAPI.getOnboard(params),
// //         clientsAPI.getClients(),
// //         servicesAPI.getServices(),
// //         agencyAPI.getAgency()
// //       ]);

// //       setBookings(onboardRes.data.results || onboardRes.data);
// //       setClients(clientsRes.data.results || clientsRes.data);
// //       setServices(servicesRes.data.results || servicesRes.data);
// //       setAgency(agencyRes.data);
// //     } catch (error) {
// //       console.error('Error fetching data:', error);
// //       toast.error('Failed to load onboard data');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const formatPKR = (amount) => {
// //     if (!amount && amount !== 0) return '₨ 0';
// //     const num = typeof amount === 'string' ? parseFloat(amount) : amount;
// //     return `₨ ${num.toLocaleString('en-PK')}`;
// //   };

// //   const formatDate = (dateString) => {
// //     if (!dateString) return 'Not set';
// //     return new Date(dateString).toLocaleDateString('en-PK', {
// //       day: 'numeric',
// //       month: 'short',
// //       year: 'numeric'
// //     });
// //   };

// //   const formatInvoiceDate = (dateString) => {
// //     if (!dateString) return '';
// //     return new Date(dateString).toLocaleDateString('en-PK', {
// //       day: '2-digit',
// //       month: 'short',
// //       year: 'numeric'
// //     });
// //   };

// //   const generateInvoiceData = (booking) => {
// //     const client = clients.find(c => c.id === booking.client);
// //     const service = services.find(s => s.id === booking.service);
    
// //     return {
// //       bookingId: booking.id,
// //       invoiceNo: `INV-${String(booking.id).padStart(5, '0')}`,
// //       invoiceDate: formatInvoiceDate(booking.created_at),
      
// //       clientName: client?.name || booking.client_details?.name || 'N/A',
// //       clientPhone: client?.phone_number || booking.client_details?.phone_number || '',
// //       clientAltPhone: client?.alternative_phone_number || '',
// //       clientEmail: client?.email || '',
// //       clientAddress: client?.address || '',
      
// //       agencyName: agency?.name || 'Your Agency Name',
// //       agencyPhone: agency?.phone_number || '',
// //       agencyEmail: agency?.email || '',
// //       agencyAddress: agency?.address || '',
      
// //       serviceName: service?.service_name || booking.service_details?.service_name || 'N/A',
// //       serviceQty: 1,
// //       servicePrice: service?.service_total_price || booking.total_amount || 0,
      
// //       paymentStatus: booking.payment_status === 'PAID' ? 'PAID' : 
// //                     booking.payment_status === 'HALF_PAID' ? 'HALF PAID' : 'PENDING',
      
// //       departureDate: formatInvoiceDate(booking.departure_date),
// //       arrivalDate: formatInvoiceDate(booking.arrival_date),
// //       destination: service?.destination || booking.service_details?.destination || '',
      
// //       subTotal: booking.total_amount,
// //       discount: booking.discount || 0,
// //       total: booking.total_amount - (booking.discount || 0),
      
// //       additionalServices: []
// //     };
// //   };

// //   const printInvoice = (booking) => {
// //     const invoiceData = generateInvoiceData(booking);
    
// //     const printWindow = window.open('', '_blank');
    
// //     const invoiceHTML = `
// //       <!DOCTYPE html>
// //       <html lang="en">
// //       <head>
// //         <meta charset="UTF-8">
// //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
// //         <title>Booking Confirmation #${invoiceData.bookingId}</title>
// //         <style>
// //           @media print {
// //             @page {
// //               size: A4;
// //               margin: 0.5in;
// //             }
// //           }
          
// //           body {
// //             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
// //             margin: 0;
// //             padding: 20px;
// //             color: #333;
// //           }
          
// //           .invoice-container {
// //             max-width: 800px;
// //             margin: 0 auto;
// //             border: 1px solid #ddd;
// //             padding: 30px;
// //             background: white;
// //           }
          
// //           .invoice-header {
// //             text-align: center;
// //             margin-bottom: 30px;
// //             border-bottom: 2px solid #4f46e5;
// //             padding-bottom: 20px;
// //           }
          
// //           .invoice-header h1 {
// //             margin: 0;
// //             color: #4f46e5;
// //             font-size: 28px;
// //             text-transform: uppercase;
// //             letter-spacing: 2px;
// //           }
          
// //           .invoice-header h2 {
// //             margin: 5px 0 0 0;
// //             color: #666;
// //             font-size: 16px;
// //             font-weight: normal;
// //           }
          
// //           .agency-info {
// //             text-align: center;
// //             margin-bottom: 20px;
// //             padding-bottom: 15px;
// //             border-bottom: 1px solid #eee;
// //           }
          
// //           .agency-info h3 {
// //             margin: 0 0 10px 0;
// //             color: #4f46e5;
// //             font-size: 18px;
// //           }
          
// //           .agency-info p {
// //             margin: 4px 0;
// //             color: #666;
// //             font-size: 14px;
// //           }
          
// //           .details-grid {
// //             display: grid;
// //             grid-template-columns: 1fr 1fr;
// //             gap: 30px;
// //             margin-bottom: 30px;
// //           }
          
// //           .detail-section h3 {
// //             margin: 0 0 10px 0;
// //             color: #4f46e5;
// //             font-size: 16px;
// //             border-bottom: 1px solid #eee;
// //             padding-bottom: 5px;
// //           }
          
// //           .detail-content {
// //             font-size: 14px;
// //             line-height: 1.6;
// //           }
          
// //           .detail-item {
// //             margin-bottom: 5px;
// //           }
          
// //           .travel-details {
// //             background: #f8fafc;
// //             border: 1px solid #e2e8f0;
// //             border-radius: 8px;
// //             padding: 15px;
// //             margin: 20px 0;
// //           }
          
// //           .travel-details h4 {
// //             margin: 0 0 10px 0;
// //             color: #4f46e5;
// //             font-size: 16px;
// //             text-align: center;
// //           }
          
// //           .travel-grid {
// //             display: grid;
// //             grid-template-columns: 1fr 1fr;
// //             gap: 15px;
// //           }
          
// //           .travel-item {
// //             text-align: center;
// //           }
          
// //           .travel-label {
// //             font-size: 12px;
// //             color: #666;
// //             text-transform: uppercase;
// //             margin-bottom: 5px;
// //           }
          
// //           .travel-value {
// //             font-size: 14px;
// //             font-weight: 600;
// //             color: #333;
// //           }
          
// //           .invoice-table {
// //             width: 100%;
// //             border-collapse: collapse;
// //             margin: 30px 0;
// //           }
          
// //           .invoice-table th {
// //             background: #f8fafc;
// //             padding: 12px;
// //             text-align: left;
// //             border: 1px solid #e2e8f0;
// //             font-weight: 600;
// //             color: #4f46e5;
// //           }
          
// //           .invoice-table td {
// //             padding: 12px;
// //             border: 1px solid #e2e8f0;
// //           }
          
// //           .status-badge {
// //             display: inline-block;
// //             padding: 4px 12px;
// //             border-radius: 20px;
// //             font-size: 12px;
// //             font-weight: 600;
// //             text-transform: uppercase;
// //             letter-spacing: 0.5px;
// //           }
          
// //           .status-paid {
// //             background: #d1fae5;
// //             color: #065f46;
// //           }
          
// //           .status-half {
// //             background: #fef3c7;
// //             color: #92400e;
// //           }
          
// //           .status-pending {
// //             background: #fee2e2;
// //             color: #991b1b;
// //           }
          
// //           .amounts-section {
// //             margin-top: 30px;
// //             text-align: right;
// //           }
          
// //           .amount-row {
// //             display: flex;
// //             justify-content: space-between;
// //             align-items: center;
// //             margin-bottom: 10px;
// //             max-width: 300px;
// //             margin-left: auto;
// //           }
          
// //           .amount-label {
// //             color: #666;
// //             font-size: 14px;
// //           }
          
// //           .amount-value {
// //             font-weight: 600;
// //             font-size: 14px;
// //           }
          
// //           .total-row {
// //             border-top: 2px solid #e2e8f0;
// //             padding-top: 10px;
// //             margin-top: 10px;
// //           }
          
// //           .total-label {
// //             color: #4f46e5;
// //             font-size: 16px;
// //             font-weight: 700;
// //           }
          
// //           .total-value {
// //             color: #4f46e5;
// //             font-size: 24px;
// //             font-weight: 700;
// //           }
          
// //           .print-button {
// //             position: fixed;
// //             top: 20px;
// //             right: 20px;
// //             padding: 10px 20px;
// //             background: #4f46e5;
// //             color: white;
// //             border: none;
// //             border-radius: 5px;
// //             cursor: pointer;
// //             font-weight: 600;
// //           }
          
// //           .print-button:hover {
// //             background: #4338ca;
// //           }
          
// //           .footer {
// //             margin-top: 50px;
// //             text-align: center;
// //             color: #666;
// //             font-size: 12px;
// //             border-top: 1px solid #eee;
// //             padding-top: 20px;
// //           }
// //         </style>
// //       </head>
// //       <body>
// //         <button class="print-button" onclick="window.print()">🖨️ Print Invoice</button>
        
// //         <div class="invoice-container">
// //           <div class="invoice-header">
// //             <h1>BOOKING CONFIRMATION</h1>
// //             <h2>Onboard Booking Receipt</h2>
// //           </div>
          
// //           <div class="agency-info">
// //             <h3>${invoiceData.agencyName}</h3>
// //             ${invoiceData.agencyPhone ? `<p>📞 ${invoiceData.agencyPhone}</p>` : ''}
// //             ${invoiceData.agencyEmail ? `<p>✉️ ${invoiceData.agencyEmail}</p>` : ''}
// //             ${invoiceData.agencyAddress ? `<p>📍 ${invoiceData.agencyAddress}</p>` : ''}
// //           </div>
          
// //           <div class="details-grid">
// //             <div class="detail-section">
// //               <h3>CLIENT DETAILS</h3>
// //               <div class="detail-content">
// //                 <div class="detail-item"><strong>${invoiceData.clientName}</strong></div>
// //                 ${invoiceData.clientPhone ? `<div class="detail-item">📞 ${invoiceData.clientPhone}</div>` : ''}
// //                 ${invoiceData.clientAltPhone ? `<div class="detail-item">📞 ${invoiceData.clientAltPhone} (Alt)</div>` : ''}
// //                 ${invoiceData.clientEmail ? `<div class="detail-item">✉️ ${invoiceData.clientEmail}</div>` : ''}
// //                 ${invoiceData.clientAddress ? `<div class="detail-item">📍 ${invoiceData.clientAddress}</div>` : ''}
// //               </div>
// //             </div>
            
// //             <div class="detail-section">
// //               <h3>BOOKING DETAILS</h3>
// //               <div class="detail-content">
// //                 <div class="detail-item"><strong>Booking ID:</strong> ${invoiceData.bookingId}</div>
// //                 <div class="detail-item"><strong>Invoice No:</strong> ${invoiceData.invoiceNo}</div>
// //                 <div class="detail-item"><strong>Date:</strong> ${invoiceData.invoiceDate}</div>
// //                 <div class="detail-item"><strong>Service:</strong> ${invoiceData.serviceName}</div>
// //                 ${invoiceData.destination ? `<div class="detail-item"><strong>Destination:</strong> ${invoiceData.destination}</div>` : ''}
// //               </div>
// //             </div>
// //           </div>
          
// //           ${(invoiceData.departureDate || invoiceData.arrivalDate) ? `
// //           <div class="travel-details">
// //             <h4>TRAVEL DATES</h4>
// //             <div class="travel-grid">
// //               ${invoiceData.departureDate ? `
// //               <div class="travel-item">
// //                 <div class="travel-label">Departure</div>
// //                 <div class="travel-value">${invoiceData.departureDate}</div>
// //               </div>
// //               ` : ''}
// //               ${invoiceData.arrivalDate ? `
// //               <div class="travel-item">
// //                 <div class="travel-label">Arrival</div>
// //                 <div class="travel-value">${invoiceData.arrivalDate}</div>
// //               </div>
// //               ` : ''}
// //             </div>
// //           </div>
// //           ` : ''}
          
// //           <div class="details-grid">
// //             <div class="detail-section">
// //               <h3>PAYMENT STATUS</h3>
// //               <div class="detail-content">
// //                 <div class="detail-item">
// //                   <span class="status-badge status-${invoiceData.paymentStatus.toLowerCase().replace(' ', '')}">
// //                     ${invoiceData.paymentStatus}
// //                   </span>
// //                 </div>
// //               </div>
// //             </div>
            
// //             <div class="detail-section">
// //               <h3>CONTACT INFORMATION</h3>
// //               <div class="detail-content">
// //                 <div class="detail-item"><strong>Agency:</strong> ${invoiceData.agencyName}</div>
// //                 ${invoiceData.agencyPhone ? `<div class="detail-item"><strong>Phone:</strong> ${invoiceData.agencyPhone}</div>` : ''}
// //                 ${invoiceData.agencyEmail ? `<div class="detail-item"><strong>Email:</strong> ${invoiceData.agencyEmail}</div>` : ''}
// //               </div>
// //             </div>
// //           </div>
          
// //           <table class="invoice-table">
// //             <thead>
// //               <tr>
// //                 <th>DESCRIPTION</th>
// //                 <th>QTY</th>
// //                 <th>PRICE</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               <tr>
// //                 <td>${invoiceData.serviceName}</td>
// //                 <td>1</td>
// //                 <td>${formatPKR(invoiceData.servicePrice).replace('₨ ', 'PKR ')}</td>
// //               </tr>
// //             </tbody>
// //           </table>
          
// //           <div class="amounts-section">
// //             <div class="amount-row">
// //               <span class="amount-label">Sub Total:</span>
// //               <span class="amount-value">${formatPKR(invoiceData.subTotal).replace('₨ ', 'PKR ')}</span>
// //             </div>
            
// //             ${invoiceData.discount > 0 ? `
// //               <div class="amount-row">
// //                 <span class="amount-label">Discount:</span>
// //                 <span class="amount-value">- ${formatPKR(invoiceData.discount).replace('₨ ', 'PKR ')}</span>
// //               </div>
// //             ` : ''}
            
// //             <div class="amount-row total-row">
// //               <span class="total-label">TOTAL:</span>
// //               <span class="total-value">${formatPKR(invoiceData.total).replace('₨ ', 'PKR ')}</span>
// //             </div>
// //           </div>
          
// //           <div class="footer">
// //             <p>This is a confirmation of your booking. For any queries, please contact ${invoiceData.agencyName}</p>
// //             <p>Document generated on ${new Date().toLocaleDateString('en-PK')}</p>
// //           </div>
// //         </div>
        
// //         <script>
// //           window.onload = function() {
// //             // Auto-print if needed
// //             // window.print();
// //           };
// //         </script>
// //       </body>
// //       </html>
// //     `;
    
// //     printWindow.document.write(invoiceHTML);
// //     printWindow.document.close();
    
// //     toast.success('Booking confirmation opened in new window. Click the print button to print.');
// //   };

// //   const clearFilters = () => {
// //     setFilters({
// //       start_date: '',
// //       end_date: '',
// //       payment_status: '',
// //     });
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-96">
// //         <div className="text-center">
// //           <div className="relative">
// //             <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
// //             <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
// //           </div>
// //           <p className="mt-4 text-gray-600 font-medium">Loading onboard bookings...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
// //         <div>
// //           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Onboard</h1>
// //           <p className="text-gray-600 mt-2">Confirmed bookings ready for travel</p>
// //         </div>
        
// //         <div className="flex items-center space-x-3">
// //           {Object.values(filters).some(value => value) && (
// //             <button
// //               onClick={clearFilters}
// //               className="flex items-center px-4 py-2.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
// //             >
// //               <X className="w-4 h-4 mr-2" />
// //               Clear Filters
// //             </button>
// //           )}
// //         </div>
// //       </div>

// //       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
// //         <div className="flex items-center mb-4">
// //           <Filter className="w-5 h-5 text-gray-500 mr-2" />
// //           <h3 className="text-lg font-medium text-gray-900">Filters</h3>
// //         </div>
        
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Start Date
// //             </label>
// //             <input
// //               type="date"
// //               value={filters.start_date}
// //               onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
// //               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               End Date
// //             </label>
// //             <input
// //               type="date"
// //               value={filters.end_date}
// //               onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
// //               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Payment Status
// //             </label>
// //             <select
// //               value={filters.payment_status}
// //               onChange={(e) => setFilters({ ...filters, payment_status: e.target.value })}
// //               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
// //             >
// //               <option value="">All Status</option>
// //               <option value="PAID">Paid</option>
// //               <option value="HALF_PAID">Half Paid</option>
// //               <option value="PENDING">Pending</option>
// //             </select>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
// //         {bookings.length > 0 ? (
// //           <div className="overflow-x-auto">
// //             <table className="min-w-full divide-y divide-gray-100">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Booking
// //                   </th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Client
// //                   </th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Service
// //                   </th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Dates
// //                   </th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Payment
// //                   </th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Actions
// //                   </th>
// //                 </tr>
// //               </thead>
// //               <tbody className="bg-white divide-y divide-gray-100">
// //                 {bookings.map((booking) => (
// //                   <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-150">
// //                     <td className="px-6 py-4">
// //                       <div>
// //                         <div className="text-sm font-semibold text-gray-900">#{booking.id}</div>
// //                         <div className="text-xs text-gray-500 mt-1">
// //                           {formatDate(booking.created_at)}
// //                         </div>
// //                       </div>
// //                     </td>
                    
// //                     <td className="px-6 py-4">
// //                       <div>
// //                         <div className="text-sm font-medium text-gray-900">
// //                           {booking.client_details?.name || 'N/A'}
// //                         </div>
// //                         <div className="text-xs text-gray-500">
// //                           {booking.client_details?.phone_number || ''}
// //                         </div>
// //                       </div>
// //                     </td>
                    
// //                     <td className="px-6 py-4">
// //                       <div>
// //                         <div className="text-sm font-medium text-gray-900">
// //                           {booking.service_details?.service_name || 'N/A'}
// //                         </div>
// //                         <div className="text-xs text-gray-500">
// //                           {booking.service_details?.destination || ''}
// //                         </div>
// //                       </div>
// //                     </td>
                    
// //                     <td className="px-6 py-4">
// //                       <div className="space-y-2">
// //                         <div className="flex items-center text-sm">
// //                           <Calendar className="w-4 h-4 mr-2 text-gray-400" />
// //                           <span className={booking.arrival_date ? "text-gray-900" : "text-gray-400"}>
// //                             {booking.arrival_date ? formatDate(booking.arrival_date) : 'Not set'}
// //                           </span>
// //                         </div>
// //                         <div className="flex items-center text-sm">
// //                           <Calendar className="w-4 h-4 mr-2 text-gray-400" />
// //                           <span className={booking.departure_date ? "text-gray-900" : "text-gray-400"}>
// //                             {booking.departure_date ? formatDate(booking.departure_date) : 'Not set'}
// //                           </span>
// //                         </div>
// //                       </div>
// //                     </td>
                    
// //                     <td className="px-6 py-4">
// //                       <div className="space-y-2">
// //                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
// //                           booking.payment_status === 'PAID'
// //                             ? 'bg-green-100 text-green-800'
// //                             : booking.payment_status === 'HALF_PAID'
// //                             ? 'bg-amber-100 text-amber-800'
// //                             : 'bg-red-100 text-red-800'
// //                         }`}>
// //                           {booking.payment_status_display}
// //                         </span>
                        
// //                         <div className="space-y-1">
// //                           <div className="text-xs font-medium text-green-600">
// //                             Paid: {formatPKR(booking.paid_amount)}
// //                           </div>
// //                           <div className="text-xs font-medium text-red-600">
// //                             Due: {formatPKR(booking.remaining_amount)}
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </td>
                    
// //                     <td className="px-6 py-4">
// //                       <button
// //                         onClick={() => printInvoice(booking)}
// //                         className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
// //                         title="Print Booking Confirmation"
// //                       >
// //                         <Printer className="w-4 h-4 mr-2" />
// //                         Print
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         ) : (
// //           <div className="p-12 text-center">
// //             <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
// //               <Calendar className="w-8 h-8 text-gray-400" />
// //             </div>
// //             <h3 className="text-lg font-medium text-gray-900 mb-2">No confirmed bookings found</h3>
// //             <p className="text-gray-500">
// //               {Object.values(filters).some(value => value) 
// //                 ? 'Try adjusting your filters'
// //                 : 'All confirmed bookings will appear here'}
// //             </p>
// //             {Object.values(filters).some(value => value) && (
// //               <button
// //                 onClick={clearFilters}
// //                 className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
// //               >
// //                 Clear filters
// //               </button>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Onboard;

// import { useEffect, useState } from 'react';
// import { onboardAPI, agencyAPI, clientsAPI, servicesAPI } from '../services/api';
// import { Calendar, Search, Printer, Filter, X } from 'lucide-react';
// import toast from 'react-hot-toast';

// const Onboard = () => {
//   const [bookings, setBookings] = useState([]);
//   const [clients, setClients] = useState([]);
//   const [services, setServices] = useState([]);
//   const [agency, setAgency] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     start_date: '',
//     end_date: '',
//     payment_status: '',
//   });

//   useEffect(() => {
//     fetchData();
//   }, [filters]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const params = {};
//       if (filters.start_date) params.start_date = filters.start_date;
//       if (filters.end_date) params.end_date = filters.end_date;
//       if (filters.payment_status) params.payment_status = filters.payment_status;

//       const [onboardRes, clientsRes, servicesRes, agencyRes] = await Promise.all([
//         onboardAPI.getOnboard(params),
//         clientsAPI.getClients(),
//         servicesAPI.getServices(),
//         agencyAPI.getAgency()
//       ]);

//       setBookings(onboardRes.data.results || onboardRes.data);
//       setClients(clientsRes.data.results || clientsRes.data);
//       setServices(servicesRes.data.results || servicesRes.data);
//       setAgency(agencyRes.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to load onboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatPKR = (amount) => {
//     if (!amount && amount !== 0) return '₨ 0';
//     const num = typeof amount === 'string' ? parseFloat(amount) : amount;
//     return `₨ ${num.toLocaleString('en-PK')}`;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not set';
//     return new Date(dateString).toLocaleDateString('en-PK', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const formatInvoiceDate = (dateString) => {
//     if (!dateString) return '';
//     return new Date(dateString).toLocaleDateString('en-PK', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const generateInvoiceData = (booking) => {
//     const client = clients.find(c => c.id === booking.client);
//     const service = services.find(s => s.id === booking.service);
    
//     // ✅ FIXED: Get original service price from service data
//     const originalPrice = service?.service_total_price || booking.service_details?.service_total_price || booking.total_amount || 0;
//     const discount = booking.discount || 0;
    
//     // ✅ FIXED: Calculate final price after discount
//     const finalPrice = originalPrice - discount;
//     const paid = booking.paid_amount || 0;
//     const remaining = finalPrice - paid;
    
//     return {
//       bookingId: booking.id,
//       invoiceNo: `INV-${String(booking.id).padStart(5, '0')}`,
//       invoiceDate: formatInvoiceDate(booking.created_at),
      
//       clientName: client?.name || booking.client_details?.name || 'N/A',
//       clientPhone: client?.phone_number || booking.client_details?.phone_number || '',
//       clientAltPhone: client?.alternative_phone_number || '',
//       clientEmail: client?.email || '',
//       clientAddress: client?.address || '',
      
//       agencyName: agency?.name || 'Your Agency Name',
//       agencyPhone: agency?.phone_number || '',
//       agencyEmail: agency?.email || '',
//       agencyAddress: agency?.address || '',
      
//       serviceName: service?.service_name || booking.service_details?.service_name || 'N/A',
//       serviceQty: 1,
//       servicePrice: originalPrice, // ✅ ORIGINAL price show karo
      
//       paymentStatus: booking.payment_status === 'PAID' ? 'PAID' : 
//                     booking.payment_status === 'HALF_PAID' ? 'HALF PAID' : 'PENDING',
      
//       departureDate: formatInvoiceDate(booking.departure_date),
//       arrivalDate: formatInvoiceDate(booking.arrival_date),
//       destination: service?.destination || booking.service_details?.destination || '',
      
//       // ✅ FIXED: subTotal = ORIGINAL price
//       subTotal: originalPrice,
//       discount: discount,
//       total: finalPrice, // ✅ Discount ke baad ka final amount
//       paidAmount: paid,
//       remainingAmount: remaining,
      
//       additionalServices: []
//     };
//   };

//   const printInvoice = (booking) => {
//     const invoiceData = generateInvoiceData(booking);
    
//     const printWindow = window.open('', '_blank');
    
//     const invoiceHTML = `
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Booking Confirmation #${invoiceData.bookingId}</title>
//         <style>
//           /* PRINT STYLES - Single Page Optimization */
//           @media print {
//             @page {
//               size: A4 portrait;
//               margin: 10mm;
//             }
            
//             body {
//               margin: 0 !important;
//               padding: 0 !important;
//               font-size: 10px !important;
//               line-height: 1.2 !important;
//               font-family: Arial, sans-serif !important;
//               -webkit-print-color-adjust: exact !important;
//               print-color-adjust: exact !important;
//             }
            
//             .no-print {
//               display: none !important;
//             }
            
//             .invoice-container {
//               max-width: 100% !important;
//               padding: 0 !important;
//               border: none !important;
//               box-shadow: none !important;
//             }
            
//             /* COMPACT HEADER */
//             .invoice-header {
//               text-align: center;
//               margin-bottom: 8mm !important;
//               padding-bottom: 4mm !important;
//               border-bottom: 1px solid #000 !important;
//             }
            
//             .invoice-header h1 {
//               margin: 2mm 0 !important;
//               font-size: 20px !important;
//               letter-spacing: 1px !important;
//             }
            
//             .invoice-header h2 {
//               margin: 1mm 0 !important;
//               font-size: 12px !important;
//               font-weight: normal !important;
//             }
            
//             /* COMPACT AGENCY INFO */
//             .agency-info {
//               text-align: center;
//               margin-bottom: 6mm !important;
//               padding-bottom: 3mm !important;
//               border-bottom: 1px solid #ddd !important;
//             }
            
//             .agency-info h3 {
//               margin: 2mm 0 !important;
//               font-size: 14px !important;
//             }
            
//             .agency-info p {
//               margin: 1mm 0 !important;
//               font-size: 10px !important;
//             }
            
//             /* COMPACT DETAILS GRID */
//             .details-grid {
//               display: grid !important;
//               grid-template-columns: 1fr 1fr !important;
//               gap: 6mm !important;
//               margin-bottom: 6mm !important;
//             }
            
//             .detail-section h3 {
//               margin: 0 0 2mm !important;
//               font-size: 12px !important;
//               padding-bottom: 1mm !important;
//               border-bottom: 1px solid #eee !important;
//             }
            
//             .detail-content {
//               font-size: 10px !important;
//               line-height: 1.3 !important;
//             }
            
//             .detail-item {
//               margin-bottom: 1mm !important;
//             }
            
//             /* COMPACT TRAVEL DETAILS */
//             .travel-details {
//               margin: 4mm 0 !important;
//               padding: 3mm !important;
//               background: #f8fafc !important;
//               border: 0.5px solid #ddd !important;
//               border-radius: 2px !important;
//             }
            
//             .travel-details h4 {
//               margin: 0 0 3mm !important;
//               font-size: 12px !important;
//               text-align: center !important;
//               padding-bottom: 1mm !important;
//               border-bottom: 0.5px solid #ddd !important;
//             }
            
//             .travel-grid {
//               display: grid !important;
//               grid-template-columns: 1fr 1fr !important;
//               gap: 3mm !important;
//             }
            
//             .travel-item {
//               text-align: center !important;
//             }
            
//             .travel-label {
//               font-size: 9px !important;
//               color: #666 !important;
//               text-transform: uppercase !important;
//               margin-bottom: 2px !important;
//             }
            
//             .travel-value {
//               font-size: 11px !important;
//               font-weight: 600 !important;
//               color: #333 !important;
//             }
            
//             /* COMPACT TABLE */
//             .invoice-table {
//               width: 100% !important;
//               border-collapse: collapse !important;
//               margin: 4mm 0 !important;
//               font-size: 10px !important;
//             }
            
//             .invoice-table th {
//               background: #f5f5f5 !important;
//               padding: 3mm 2mm !important;
//               border: 0.5px solid #ddd !important;
//               font-weight: 600 !important;
//               text-align: left !important;
//             }
            
//             .invoice-table td {
//               padding: 2.5mm 2mm !important;
//               border: 0.5px solid #ddd !important;
//               text-align: left !important;
//             }
            
//             /* COMPACT STATUS BADGES */
//             .status-badge {
//               display: inline-block !important;
//               padding: 1mm 2mm !important;
//               border-radius: 10px !important;
//               font-size: 8px !important;
//               font-weight: 600 !important;
//               text-transform: uppercase !important;
//               letter-spacing: 0.3px !important;
//             }
            
//             .status-paid {
//               background: #d1fae5 !important;
//               color: #065f46 !important;
//             }
            
//             .status-half {
//               background: #fef3c7 !important;
//               color: #92400e !important;
//             }
            
//             .status-pending {
//               background: #fee2e2 !important;
//               color: #991b1b !important;
//             }
            
//             /* COMPACT AMOUNTS SECTION */
//             .amounts-section {
//               margin-top: 4mm !important;
//               background: #f9f9f9 !important;
//               padding: 3mm !important;
//               border: 0.5px solid #ddd !important;
//               border-radius: 2px !important;
//             }
            
//             .amount-row {
//               display: flex !important;
//               justify-content: space-between !important;
//               align-items: center !important;
//               margin-bottom: 1.5mm !important;
//               padding-bottom: 1.5mm !important;
//               border-bottom: 0.5px dashed #ddd !important;
//             }
            
//             .amount-row:last-child {
//               border-bottom: none !important;
//             }
            
//             .amount-label {
//               font-size: 10px !important;
//               font-weight: 500 !important;
//             }
            
//             .amount-value {
//               font-size: 10px !important;
//               font-weight: 600 !important;
//             }
            
//             .total-row {
//               border-top: 1px solid #000 !important;
//               padding-top: 2mm !important;
//               margin-top: 2mm !important;
//             }
            
//             .total-label {
//               font-size: 12px !important;
//               font-weight: 700 !important;
//             }
            
//             .total-value {
//               font-size: 14px !important;
//               font-weight: 700 !important;
//             }
            
//             /* COMPACT FOOTER */
//             .footer {
//               margin-top: 6mm !important;
//               text-align: center !important;
//               color: #666 !important;
//               font-size: 8px !important;
//               border-top: 0.5px solid #ddd !important;
//               padding-top: 2mm !important;
//             }
            
//             /* Hide unnecessary elements for print */
//             .print-button {
//               display: none !important;
//             }
//           }
          
//           /* SCREEN STYLES */
//           @media screen {
//             body {
//               font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//               margin: 0;
//               padding: 20px;
//               color: #333;
//               background: #f5f5f5;
//             }
            
//             .invoice-container {
//               max-width: 800px;
//               margin: 0 auto;
//               border: 1px solid #eee;
//               padding: 30px;
//               background: white;
//               box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//             }
            
//             .invoice-header {
//               text-align: center;
//               margin-bottom: 30px;
//               border-bottom: 2px solid #4f46e5;
//               padding-bottom: 20px;
//             }
            
//             .invoice-header h1 {
//               margin: 0;
//               color: #4f46e5;
//               font-size: 28px;
//               text-transform: uppercase;
//               letter-spacing: 2px;
//             }
            
//             .invoice-header h2 {
//               margin: 5px 0 0 0;
//               color: #666;
//               font-size: 16px;
//               font-weight: normal;
//             }
            
//             .agency-info {
//               text-align: center;
//               margin-bottom: 20px;
//               padding-bottom: 15px;
//               border-bottom: 1px solid #eee;
//             }
            
//             .agency-info h3 {
//               margin: 0 0 10px 0;
//               color: #4f46e5;
//               font-size: 18px;
//             }
            
//             .agency-info p {
//               margin: 4px 0;
//               color: #666;
//               font-size: 14px;
//             }
            
//             .details-grid {
//               display: grid;
//               grid-template-columns: 1fr 1fr;
//               gap: 30px;
//               margin-bottom: 30px;
//             }
            
//             .detail-section h3 {
//               margin: 0 0 10px 0;
//               color: #4f46e5;
//               font-size: 16px;
//               border-bottom: 1px solid #eee;
//               padding-bottom: 5px;
//             }
            
//             .detail-content {
//               font-size: 14px;
//               line-height: 1.6;
//             }
            
//             .detail-item {
//               margin-bottom: 5px;
//             }
            
//             .travel-details {
//               background: #f8fafc;
//               border: 1px solid #e2e8f0;
//               border-radius: 8px;
//               padding: 15px;
//               margin: 20px 0;
//             }
            
//             .travel-details h4 {
//               margin: 0 0 10px 0;
//               color: #4f46e5;
//               font-size: 16px;
//               text-align: center;
//             }
            
//             .travel-grid {
//               display: grid;
//               grid-template-columns: 1fr 1fr;
//               gap: 15px;
//             }
            
//             .travel-item {
//               text-align: center;
//             }
            
//             .travel-label {
//               font-size: 12px;
//               color: #666;
//               text-transform: uppercase;
//               margin-bottom: 5px;
//             }
            
//             .travel-value {
//               font-size: 14px;
//               font-weight: 600;
//               color: #333;
//             }
            
//             .invoice-table {
//               width: 100%;
//               border-collapse: collapse;
//               margin: 30px 0;
//             }
            
//             .invoice-table th {
//               background: #f8fafc;
//               padding: 12px;
//               text-align: left;
//               border: 1px solid #e2e8f0;
//               font-weight: 600;
//               color: #4f46e5;
//             }
            
//             .invoice-table td {
//               padding: 12px;
//               border: 1px solid #e2e8f0;
//             }
            
//             .status-badge {
//               display: inline-block;
//               padding: 4px 12px;
//               border-radius: 20px;
//               font-size: 12px;
//               font-weight: 600;
//               text-transform: uppercase;
//               letter-spacing: 0.5px;
//             }
            
//             .status-paid {
//               background: #d1fae5;
//               color: #065f46;
//             }
            
//             .status-half {
//               background: #fef3c7;
//               color: #92400e;
//             }
            
//             .status-pending {
//               background: #fee2e2;
//               color: #991b1b;
//             }
            
//             .amounts-section {
//               margin-top: 30px;
//               background: #f8fafc;
//               padding: 20px;
//               border-radius: 8px;
//               border: 1px solid #e2e8f0;
//             }
            
//             .amount-row {
//               display: flex;
//               justify-content: space-between;
//               align-items: center;
//               margin-bottom: 10px;
//               padding: 8px 0;
//               border-bottom: 1px dashed #e2e8f0;
//             }
            
//             .amount-label {
//               color: #666;
//               font-size: 15px;
//               font-weight: 500;
//             }
            
//             .amount-value {
//               font-weight: 600;
//               font-size: 15px;
//             }
            
//             .total-row {
//               border-top: 2px solid #e2e8f0;
//               padding-top: 15px;
//               margin-top: 15px;
//               border-bottom: none;
//             }
            
//             .total-label {
//               color: #4f46e5;
//               font-size: 18px;
//               font-weight: 700;
//             }
            
//             .total-value {
//               color: #4f46e5;
//               font-size: 24px;
//               font-weight: 700;
//             }
            
//             .print-button {
//               position: fixed;
//               top: 20px;
//               right: 20px;
//               padding: 10px 20px;
//               background: #4f46e5;
//               color: white;
//               border: none;
//               border-radius: 5px;
//               cursor: pointer;
//               font-weight: 600;
//             }
            
//             .print-button:hover {
//               background: #4338ca;
//             }
            
//             .footer {
//               margin-top: 50px;
//               text-align: center;
//               color: #666;
//               font-size: 12px;
//               border-top: 1px solid #eee;
//               padding-top: 20px;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <button class="print-button no-print" onclick="window.print()">🖨️ Print Invoice</button>
        
//         <div class="invoice-container">
//           <div class="invoice-header">
//             <h1>BOOKING CONFIRMATION</h1>
//             <h2>Onboard Booking Receipt</h2>
//           </div>
          
//           <div class="agency-info">
//             <h3>${invoiceData.agencyName}</h3>
//             ${invoiceData.agencyPhone ? `<p>📞 ${invoiceData.agencyPhone}</p>` : ''}
//             ${invoiceData.agencyEmail ? `<p>✉️ ${invoiceData.agencyEmail}</p>` : ''}
//             ${invoiceData.agencyAddress ? `<p>📍 ${invoiceData.agencyAddress}</p>` : ''}
//           </div>
          
//           <div class="details-grid">
//             <div class="detail-section">
//               <h3>CLIENT DETAILS</h3>
//               <div class="detail-content">
//                 <div class="detail-item"><strong>${invoiceData.clientName}</strong></div>
//                 ${invoiceData.clientPhone ? `<div class="detail-item">📞 ${invoiceData.clientPhone}</div>` : ''}
//                 ${invoiceData.clientAltPhone ? `<div class="detail-item">📞 ${invoiceData.clientAltPhone} (Alt)</div>` : ''}
//                 ${invoiceData.clientEmail ? `<div class="detail-item">✉️ ${invoiceData.clientEmail}</div>` : ''}
//                 ${invoiceData.clientAddress ? `<div class="detail-item">📍 ${invoiceData.clientAddress}</div>` : ''}
//               </div>
//             </div>
            
//             <div class="detail-section">
//               <h3>BOOKING DETAILS</h3>
//               <div class="detail-content">
//                 <div class="detail-item"><strong>Booking ID:</strong> ${invoiceData.bookingId}</div>
//                 <div class="detail-item"><strong>Invoice No:</strong> ${invoiceData.invoiceNo}</div>
//                 <div class="detail-item"><strong>Date:</strong> ${invoiceData.invoiceDate}</div>
//                 <div class="detail-item"><strong>Service:</strong> ${invoiceData.serviceName}</div>
//                 ${invoiceData.destination ? `<div class="detail-item"><strong>Destination:</strong> ${invoiceData.destination}</div>` : ''}
//               </div>
//             </div>
//           </div>
          
//           ${(invoiceData.departureDate || invoiceData.arrivalDate) ? `
//           <div class="travel-details">
//             <h4>TRAVEL DATES</h4>
//             <div class="travel-grid">
//               ${invoiceData.departureDate ? `
//               <div class="travel-item">
//                 <div class="travel-label">Departure (Travel Date)</div>
//                 <div class="travel-value">${invoiceData.departureDate}</div>
//               </div>
//               ` : ''}
//               ${invoiceData.arrivalDate ? `
//               <div class="travel-item">
//                 <div class="travel-label">Arrival (Return Date)</div>
//                 <div class="travel-value">${invoiceData.arrivalDate}</div>
//               </div>
//               ` : ''}
//             </div>
//           </div>
//           ` : ''}
          
//           <div class="details-grid">
//             <div class="detail-section">
//               <h3>PAYMENT STATUS</h3>
//               <div class="detail-content">
//                 <div class="detail-item">
//                   <span class="status-badge status-${invoiceData.paymentStatus.toLowerCase().replace(' ', '')}">
//                     ${invoiceData.paymentStatus}
//                   </span>
//                 </div>
//                 <div class="detail-item"><strong>Amount Paid:</strong> ${formatPKR(invoiceData.paidAmount).replace('₨ ', 'PKR ')}</div>
//                 <div class="detail-item"><strong>Remaining Due:</strong> ${formatPKR(invoiceData.remainingAmount).replace('₨ ', 'PKR ')}</div>
//               </div>
//             </div>
            
//             <div class="detail-section">
//               <h3>CONTACT INFORMATION</h3>
//               <div class="detail-content">
//                 <div class="detail-item"><strong>Agency:</strong> ${invoiceData.agencyName}</div>
//                 ${invoiceData.agencyPhone ? `<div class="detail-item"><strong>Phone:</strong> ${invoiceData.agencyPhone}</div>` : ''}
//                 ${invoiceData.agencyEmail ? `<div class="detail-item"><strong>Email:</strong> ${invoiceData.agencyEmail}</div>` : ''}
//               </div>
//             </div>
//           </div>
          
//           <table class="invoice-table">
//             <thead>
//               <tr>
//                 <th>SERVICE</th>
//                 <th>QTY</th>
//                 <th>PRICE</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>${invoiceData.serviceName}</td>
//                 <td>1</td>
//                 <td>${formatPKR(invoiceData.servicePrice).replace('₨ ', 'PKR ')}</td>
//               </tr>
//             </tbody>
//           </table>
          
//           <div class="amounts-section">
//             <!-- ✅ FIXED: Now showing Service Price instead of Sub Total -->
//             <div class="amount-row">
//               <span class="amount-label">Service Price:</span>
//               <span class="amount-value">${formatPKR(invoiceData.servicePrice).replace('₨ ', 'PKR ')}</span>
//             </div>
            
//             ${invoiceData.discount > 0 ? `
//               <div class="amount-row">
//                 <span class="amount-label">Discount:</span>
//                 <span class="amount-value">- ${formatPKR(invoiceData.discount).replace('₨ ', 'PKR ')}</span>
//               </div>
//             ` : ''}
            
//             <div class="amount-row total-row">
//               <span class="total-label">TOTAL AMOUNT:</span>
//               <span class="total-value">${formatPKR(invoiceData.total).replace('₨ ', 'PKR ')}</span>
//             </div>
//           </div>
          
//           <div class="footer">
//             <p>This is a confirmation of your booking. For any queries, please contact ${invoiceData.agencyName}</p>
//             <p>Document generated on ${new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
//           </div>
//         </div>
        
//         <script>
//           window.onload = function() {
//             // Auto-print if needed (optional)
//             // window.print();
//           };
//         </script>
//       </body>
//       </html>
//     `;
    
//     printWindow.document.write(invoiceHTML);
//     printWindow.document.close();
    
//     toast.success('Booking confirmation opened in new window. Click the print button to print.');
//   };

//   const clearFilters = () => {
//     setFilters({
//       start_date: '',
//       end_date: '',
//       payment_status: '',
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="text-center">
//           <div className="relative">
//             <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
//             <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//           </div>
//           <p className="mt-4 text-gray-600 font-medium">Loading onboard bookings...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 animate-in slide-in-from-left-4 duration-500">
//             Onboard Bookings
//           </h1>
//           <p className="text-gray-600 mt-2 animate-in slide-in-from-left-4 duration-700">
//             Confirmed bookings ready for travel
//           </p>
//         </div>
        
//         <div className="flex items-center space-x-3">
//           {Object.values(filters).some(value => value) && (
//             <button
//               onClick={clearFilters}
//               className="flex items-center px-4 py-2.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 animate-in fade-in duration-300"
//             >
//               <X className="w-4 h-4 mr-2" />
//               Clear Filters
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in-50 duration-500">
//         <div className="flex items-center mb-4">
//           <Filter className="w-5 h-5 text-gray-500 mr-2" />
//           <h3 className="text-lg font-medium text-gray-900">Filter Bookings</h3>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Travel Date From
//             </label>
//             <input
//               type="date"
//               value={filters.start_date}
//               onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Travel Date To
//             </label>
//             <input
//               type="date"
//               value={filters.end_date}
//               onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Payment Status
//             </label>
//             <select
//               value={filters.payment_status}
//               onChange={(e) => setFilters({ ...filters, payment_status: e.target.value })}
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//             >
//               <option value="">All Status</option>
//               <option value="PAID">Paid</option>
//               <option value="HALF_PAID">Half Paid</option>
//               <option value="PENDING">Pending</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in-50 duration-700">
//         {bookings.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-100">
//               <thead className="bg-gray-50/50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Booking
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Client
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Service
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Travel Dates
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Payment
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-100">
//                 {bookings.map((booking, index) => (
//                   <tr 
//                     key={booking.id} 
//                     className="hover:bg-gray-50/50 transition-colors duration-150 animate-in slide-in-from-bottom-2"
//                     style={{ animationDelay: `${index * 50}ms` }}
//                   >
//                     <td className="px-6 py-4">
//                       <div>
//                         <div className="text-sm font-semibold text-gray-900">#{booking.id}</div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           Created: {formatDate(booking.created_at)}
//                         </div>
//                       </div>
//                     </td>
                    
//                     <td className="px-6 py-4">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           {booking.client_details?.name || 'N/A'}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {booking.client_details?.phone_number || ''}
//                         </div>
//                       </div>
//                     </td>
                    
//                     <td className="px-6 py-4">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           {booking.service_details?.service_name || 'N/A'}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {booking.service_details?.destination || ''}
//                         </div>
//                       </div>
//                     </td>
                    
//                     <td className="px-6 py-4">
//                       <div className="space-y-2">
//                         <div className="flex items-center text-sm">
//                           <Calendar className="w-4 h-4 mr-2 text-gray-400" />
//                           <div>
//                             <div className="text-xs text-gray-500">Departure:</div>
//                             <span className={booking.departure_date ? "text-gray-900 font-medium" : "text-gray-400"}>
//                               {booking.departure_date ? formatDate(booking.departure_date) : 'Not set'}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="flex items-center text-sm">
//                           <Calendar className="w-4 h-4 mr-2 text-gray-400" />
//                           <div>
//                             <div className="text-xs text-gray-500">Arrival:</div>
//                             <span className={booking.arrival_date ? "text-gray-900 font-medium" : "text-gray-400"}>
//                               {booking.arrival_date ? formatDate(booking.arrival_date) : 'Not set'}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </td>
                    
//                     <td className="px-6 py-4">
//                       <div className="space-y-2">
//                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                           booking.payment_status === 'PAID'
//                             ? 'bg-green-100 text-green-800'
//                             : booking.payment_status === 'HALF_PAID'
//                             ? 'bg-amber-100 text-amber-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {booking.payment_status_display}
//                         </span>
                        
//                         <div className="space-y-1">
//                           <div className="text-xs font-medium text-green-600">
//                             Paid: {formatPKR(booking.paid_amount)}
//                           </div>
//                           <div className="text-xs font-medium text-red-600">
//                             Due: {formatPKR(booking.remaining_amount)}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
                    
//                     <td className="px-6 py-4">
//                       <button
//                         onClick={() => printInvoice(booking)}
//                         className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
//                         title="Print Booking Confirmation"
//                       >
//                         <Printer className="w-4 h-4 mr-2" />
//                         Print
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="p-12 text-center">
//             <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//               <Calendar className="w-8 h-8 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No confirmed bookings found</h3>
//             <p className="text-gray-500">
//               {Object.values(filters).some(value => value) 
//                 ? 'Try adjusting your filters'
//                 : 'All confirmed bookings will appear here'}
//             </p>
//             {Object.values(filters).some(value => value) && (
//               <button
//                 onClick={clearFilters}
//                 className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
//               >
//                 Clear filters
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Onboard;

import { useEffect, useState, useRef } from 'react';
import { onboardAPI, agencyAPI, clientsAPI, servicesAPI } from '../services/api';
import { Calendar, Search, Printer, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Onboard = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    payment_status: '',
  });
  const [bookingIdSearch, setBookingIdSearch] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [filters]);

  useEffect(() => {
    // Initially show all bookings
    setFilteredBookings(bookings);
  }, [bookings]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;
      if (filters.payment_status) params.payment_status = filters.payment_status;

      const [onboardRes, clientsRes, servicesRes, agencyRes] = await Promise.all([
        onboardAPI.getOnboard(params),
        clientsAPI.getClients(),
        servicesAPI.getServices(),
        agencyAPI.getAgency()
      ]);

      const bookingsData = onboardRes.data.results || onboardRes.data;
      setBookings(bookingsData);
      setFilteredBookings(bookingsData);
      setClients(clientsRes.data.results || clientsRes.data);
      setServices(servicesRes.data.results || servicesRes.data);
      setAgency(agencyRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load onboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!bookingIdSearch.trim()) {
      // If search is empty, show all bookings
      setFilteredBookings(bookings);
      return;
    }

    setSearchLoading(true);
    
    // Simulate search delay for better UX
    setTimeout(() => {
      const searchTerm = bookingIdSearch.trim().toLowerCase();
      
      // Search in bookings array
      const foundBookings = bookings.filter(booking => {
        // Check booking ID
        if (booking.id.toString().includes(searchTerm)) {
          return true;
        }
        
        // Check client name
        if (booking.client_details?.name?.toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        // Check service name
        if (booking.service_details?.service_name?.toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        return false;
      });
      
      setFilteredBookings(foundBookings);
      setSearchLoading(false);
      
      if (foundBookings.length === 0 && bookingIdSearch.trim() !== '') {
        toast.error(`No booking found for "${bookingIdSearch}"`);
      }
    }, 300);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setBookingIdSearch('');
    setFilteredBookings(bookings);
    toast.success('Search cleared');
  };

  const formatPKR = (amount) => {
    if (!amount && amount !== 0) return '₨ 0';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₨ ${num.toLocaleString('en-PK')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatInvoiceDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const generateInvoiceData = (booking) => {
    const client = clients.find(c => c.id === booking.client);
    const service = services.find(s => s.id === booking.service);
    
    const originalPrice = service?.service_total_price || booking.service_details?.service_total_price || booking.total_amount || 0;
    const discount = booking.discount || 0;
    const finalPrice = originalPrice - discount;
    const paid = booking.paid_amount || 0;
    const remaining = finalPrice - paid;
    
    return {
      bookingId: booking.id,
      invoiceNo: `INV-${String(booking.id).padStart(5, '0')}`,
      invoiceDate: formatInvoiceDate(booking.created_at),
      
      clientName: client?.name || booking.client_details?.name || 'N/A',
      clientPhone: client?.phone_number || booking.client_details?.phone_number || '',
      clientAltPhone: client?.alternative_phone_number || '',
      clientEmail: client?.email || '',
      clientAddress: client?.address || '',
      
      agencyName: agency?.name || 'Your Agency Name',
      agencyPhone: agency?.phone_number || '',
      agencyEmail: agency?.email || '',
      agencyAddress: agency?.address || '',
      
      serviceName: service?.service_name || booking.service_details?.service_name || 'N/A',
      serviceQty: 1,
      servicePrice: originalPrice,
      
      paymentStatus: booking.payment_status === 'PAID' ? 'PAID' : 
                    booking.payment_status === 'HALF_PAID' ? 'HALF PAID' : 'PENDING',
      
      departureDate: formatInvoiceDate(booking.departure_date),
      arrivalDate: formatInvoiceDate(booking.arrival_date),
      destination: service?.destination || booking.service_details?.destination || '',
      
      subTotal: originalPrice,
      discount: discount,
      total: finalPrice,
      paidAmount: paid,
      remainingAmount: remaining,
      
      additionalServices: []
    };
  };

  const printInvoice = (booking) => {
    const invoiceData = generateInvoiceData(booking);
    
    const printWindow = window.open('', '_blank');
    
    const invoiceHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation #${invoiceData.bookingId}</title>
        <style>
          /* PRINT STYLES - Single Page Optimization */
          @media print {
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            
            body {
              margin: 0 !important;
              padding: 0 !important;
              font-size: 10px !important;
              line-height: 1.2 !important;
              font-family: Arial, sans-serif !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .no-print {
              display: none !important;
            }
            
            .invoice-container {
              max-width: 100% !important;
              padding: 0 !important;
              border: none !important;
              box-shadow: none !important;
            }
            
            /* COMPACT HEADER */
            .invoice-header {
              text-align: center;
              margin-bottom: 8mm !important;
              padding-bottom: 4mm !important;
              border-bottom: 1px solid #000 !important;
            }
            
            .invoice-header h1 {
              margin: 2mm 0 !important;
              font-size: 20px !important;
              letter-spacing: 1px !important;
            }
            
            .invoice-header h2 {
              margin: 1mm 0 !important;
              font-size: 12px !important;
              font-weight: normal !important;
            }
            
            /* COMPACT AGENCY INFO */
            .agency-info {
              text-align: center;
              margin-bottom: 6mm !important;
              padding-bottom: 3mm !important;
              border-bottom: 1px solid #ddd !important;
            }
            
            .agency-info h3 {
              margin: 2mm 0 !important;
              font-size: 14px !important;
            }
            
            .agency-info p {
              margin: 1mm 0 !important;
              font-size: 10px !important;
            }
            
            /* COMPACT DETAILS GRID */
            .details-grid {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 6mm !important;
              margin-bottom: 6mm !important;
            }
            
            .detail-section h3 {
              margin: 0 0 2mm !important;
              font-size: 12px !important;
              padding-bottom: 1mm !important;
              border-bottom: 1px solid #eee !important;
            }
            
            .detail-content {
              font-size: 10px !important;
              line-height: 1.3 !important;
            }
            
            .detail-item {
              margin-bottom: 1mm !important;
            }
            
            /* COMPACT TRAVEL DETAILS */
            .travel-details {
              margin: 4mm 0 !important;
              padding: 3mm !important;
              background: #f8fafc !important;
              border: 0.5px solid #ddd !important;
              border-radius: 2px !important;
            }
            
            .travel-details h4 {
              margin: 0 0 3mm !important;
              font-size: 12px !important;
              text-align: center !important;
              padding-bottom: 1mm !important;
              border-bottom: 0.5px solid #ddd !important;
            }
            
            .travel-grid {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 3mm !important;
            }
            
            .travel-item {
              text-align: center !important;
            }
            
            .travel-label {
              font-size: 9px !important;
              color: #666 !important;
              text-transform: uppercase !important;
              margin-bottom: 2px !important;
            }
            
            .travel-value {
              font-size: 11px !important;
              font-weight: 600 !important;
              color: #333 !important;
            }
            
            /* COMPACT TABLE */
            .invoice-table {
              width: 100% !important;
              border-collapse: collapse !important;
              margin: 4mm 0 !important;
              font-size: 10px !important;
            }
            
            .invoice-table th {
              background: #f5f5f5 !important;
              padding: 3mm 2mm !important;
              border: 0.5px solid #ddd !important;
              font-weight: 600 !important;
              text-align: left !important;
            }
            
            .invoice-table td {
              padding: 2.5mm 2mm !important;
              border: 0.5px solid #ddd !important;
              text-align: left !important;
            }
            
            /* COMPACT STATUS BADGES */
            .status-badge {
              display: inline-block !important;
              padding: 1mm 2mm !important;
              border-radius: 10px !important;
              font-size: 8px !important;
              font-weight: 600 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.3px !important;
            }
            
            .status-paid {
              background: #d1fae5 !important;
              color: #065f46 !important;
            }
            
            .status-half {
              background: #fef3c7 !important;
              color: #92400e !important;
            }
            
            .status-pending {
              background: #fee2e2 !important;
              color: #991b1b !important;
            }
            
            /* COMPACT AMOUNTS SECTION */
            .amounts-section {
              margin-top: 4mm !important;
              background: #f9f9f9 !important;
              padding: 3mm !important;
              border: 0.5px solid #ddd !important;
              border-radius: 2px !important;
            }
            
            .amount-row {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              margin-bottom: 1.5mm !important;
              padding-bottom: 1.5mm !important;
              border-bottom: 0.5px dashed #ddd !important;
            }
            
            .amount-row:last-child {
              border-bottom: none !important;
            }
            
            .amount-label {
              font-size: 10px !important;
              font-weight: 500 !important;
            }
            
            .amount-value {
              font-size: 10px !important;
              font-weight: 600 !important;
            }
            
            .total-row {
              border-top: 1px solid #000 !important;
              padding-top: 2mm !important;
              margin-top: 2mm !important;
            }
            
            .total-label {
              font-size: 12px !important;
              font-weight: 700 !important;
            }
            
            .total-value {
              font-size: 14px !important;
              font-weight: 700 !important;
            }
            
            /* COMPACT FOOTER */
            .footer {
              margin-top: 6mm !important;
              text-align: center !important;
              color: #666 !important;
              font-size: 8px !important;
              border-top: 0.5px solid #ddd !important;
              padding-top: 2mm !important;
            }
            
            /* Hide unnecessary elements for print */
            .print-button {
              display: none !important;
            }
          }
          
          /* SCREEN STYLES */
          @media screen {
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
              background: #f5f5f5;
            }
            
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #eee;
              padding: 30px;
              background: white;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .invoice-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #4f46e5;
              padding-bottom: 20px;
            }
            
            .invoice-header h1 {
              margin: 0;
              color: #4f46e5;
              font-size: 28px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            
            .invoice-header h2 {
              margin: 5px 0 0 0;
              color: #666;
              font-size: 16px;
              font-weight: normal;
            }
            
            .agency-info {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 1px solid #eee;
            }
            
            .agency-info h3 {
              margin: 0 0 10px 0;
              color: #4f46e5;
              font-size: 18px;
            }
            
            .agency-info p {
              margin: 4px 0;
              color: #666;
              font-size: 14px;
            }
            
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 30px;
            }
            
            .detail-section h3 {
              margin: 0 0 10px 0;
              color: #4f46e5;
              font-size: 16px;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            
            .detail-content {
              font-size: 14px;
              line-height: 1.6;
            }
            
            .detail-item {
              margin-bottom: 5px;
            }
            
            .travel-details {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
            }
            
            .travel-details h4 {
              margin: 0 0 10px 0;
              color: #4f46e5;
              font-size: 16px;
              text-align: center;
            }
            
            .travel-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            
            .travel-item {
              text-align: center;
            }
            
            .travel-label {
              font-size: 12px;
              color: #666;
              text-transform: uppercase;
              margin-bottom: 5px;
            }
            
            .travel-value {
              font-size: 14px;
              font-weight: 600;
              color: #333;
            }
            
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin: 30px 0;
            }
            
            .invoice-table th {
              background: #f8fafc;
              padding: 12px;
              text-align: left;
              border: 1px solid #e2e8f0;
              font-weight: 600;
              color: #4f46e5;
            }
            
            .invoice-table td {
              padding: 12px;
              border: 1px solid #e2e8f0;
            }
            
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .status-paid {
              background: #d1fae5;
              color: #065f46;
            }
            
            .status-half {
              background: #fef3c7;
              color: #92400e;
            }
            
            .status-pending {
              background: #fee2e2;
              color: #991b1b;
            }
            
            .amounts-section {
              margin-top: 30px;
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            
            .amount-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
              padding: 8px 0;
              border-bottom: 1px dashed #e2e8f0;
            }
            
            .amount-label {
              color: #666;
              font-size: 15px;
              font-weight: 500;
            }
            
            .amount-value {
              font-weight: 600;
              font-size: 15px;
            }
            
            .total-row {
              border-top: 2px solid #e2e8f0;
              padding-top: 15px;
              margin-top: 15px;
              border-bottom: none;
            }
            
            .total-label {
              color: #4f46e5;
              font-size: 18px;
              font-weight: 700;
            }
            
            .total-value {
              color: #4f46e5;
              font-size: 24px;
              font-weight: 700;
            }
            
            .print-button {
              position: fixed;
              top: 20px;
              right: 20px;
              padding: 10px 20px;
              background: #4f46e5;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-weight: 600;
            }
            
            .print-button:hover {
              background: #4338ca;
            }
            
            .footer {
              margin-top: 50px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #eee;
              padding-top: 20px;
            }
          }
        </style>
      </head>
      <body>
        <button class="print-button no-print" onclick="window.print()">🖨️ Print Invoice</button>
        
        <div class="invoice-container">
          <div class="invoice-header">
            <h1>BOOKING CONFIRMATION</h1>
            <h2>Onboard Booking Receipt</h2>
          </div>
          
          <div class="agency-info">
            <h3>${invoiceData.agencyName}</h3>
            ${invoiceData.agencyPhone ? `<p>📞 ${invoiceData.agencyPhone}</p>` : ''}
            ${invoiceData.agencyEmail ? `<p>✉️ ${invoiceData.agencyEmail}</p>` : ''}
            ${invoiceData.agencyAddress ? `<p>📍 ${invoiceData.agencyAddress}</p>` : ''}
          </div>
          
          <div class="details-grid">
            <div class="detail-section">
              <h3>CLIENT DETAILS</h3>
              <div class="detail-content">
                <div class="detail-item"><strong>${invoiceData.clientName}</strong></div>
                ${invoiceData.clientPhone ? `<div class="detail-item">📞 ${invoiceData.clientPhone}</div>` : ''}
                ${invoiceData.clientAltPhone ? `<div class="detail-item">📞 ${invoiceData.clientAltPhone} (Alt)</div>` : ''}
                ${invoiceData.clientEmail ? `<div class="detail-item">✉️ ${invoiceData.clientEmail}</div>` : ''}
                ${invoiceData.clientAddress ? `<div class="detail-item">📍 ${invoiceData.clientAddress}</div>` : ''}
              </div>
            </div>
            
            <div class="detail-section">
              <h3>BOOKING DETAILS</h3>
              <div class="detail-content">
                <div class="detail-item"><strong>Booking ID:</strong> ${invoiceData.bookingId}</div>
                <div class="detail-item"><strong>Invoice No:</strong> ${invoiceData.invoiceNo}</div>
                <div class="detail-item"><strong>Date:</strong> ${invoiceData.invoiceDate}</div>
                <div class="detail-item"><strong>Service:</strong> ${invoiceData.serviceName}</div>
                ${invoiceData.destination ? `<div class="detail-item"><strong>Destination:</strong> ${invoiceData.destination}</div>` : ''}
              </div>
            </div>
          </div>
          
          ${(invoiceData.departureDate || invoiceData.arrivalDate) ? `
          <div class="travel-details">
            <h4>TRAVEL DATES</h4>
            <div class="travel-grid">
              ${invoiceData.departureDate ? `
              <div class="travel-item">
                <div class="travel-label">Departure (Travel Date)</div>
                <div class="travel-value">${invoiceData.departureDate}</div>
              </div>
              ` : ''}
              ${invoiceData.arrivalDate ? `
              <div class="travel-item">
                <div class="travel-label">Arrival (Return Date)</div>
                <div class="travel-value">${invoiceData.arrivalDate}</div>
              </div>
              ` : ''}
            </div>
          </div>
          ` : ''}
          
          <div class="details-grid">
            <div class="detail-section">
              <h3>PAYMENT STATUS</h3>
              <div class="detail-content">
                <div class="detail-item">
                  <span class="status-badge status-${invoiceData.paymentStatus.toLowerCase().replace(' ', '')}">
                    ${invoiceData.paymentStatus}
                  </span>
                </div>
                <div class="detail-item"><strong>Amount Paid:</strong> ${formatPKR(invoiceData.paidAmount).replace('₨ ', 'PKR ')}</div>
                <div class="detail-item"><strong>Remaining Due:</strong> ${formatPKR(invoiceData.remainingAmount).replace('₨ ', 'PKR ')}</div>
              </div>
            </div>
            
            <div class="detail-section">
              <h3>CONTACT INFORMATION</h3>
              <div class="detail-content">
                <div class="detail-item"><strong>Agency:</strong> ${invoiceData.agencyName}</div>
                ${invoiceData.agencyPhone ? `<div class="detail-item"><strong>Phone:</strong> ${invoiceData.agencyPhone}</div>` : ''}
                ${invoiceData.agencyEmail ? `<div class="detail-item"><strong>Email:</strong> ${invoiceData.agencyEmail}</div>` : ''}
              </div>
            </div>
          </div>
          
          <table class="invoice-table">
            <thead>
              <tr>
                <th>SERVICE</th>
                <th>QTY</th>
                <th>PRICE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${invoiceData.serviceName}</td>
                <td>1</td>
                <td>${formatPKR(invoiceData.servicePrice).replace('₨ ', 'PKR ')}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="amounts-section">
            <div class="amount-row">
              <span class="amount-label">Service Price:</span>
              <span class="amount-value">${formatPKR(invoiceData.servicePrice).replace('₨ ', 'PKR ')}</span>
            </div>
            
            ${invoiceData.discount > 0 ? `
              <div class="amount-row">
                <span class="amount-label">Discount:</span>
                <span class="amount-value">- ${formatPKR(invoiceData.discount).replace('₨ ', 'PKR ')}</span>
              </div>
            ` : ''}
            
            <div class="amount-row total-row">
              <span class="total-label">TOTAL AMOUNT:</span>
              <span class="total-value">${formatPKR(invoiceData.total).replace('₨ ', 'PKR ')}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>This is a confirmation of your booking. For any queries, please contact ${invoiceData.agencyName}</p>
            <p>Document generated on ${new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            // Auto-print if needed (optional)
            // window.print();
          };
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    toast.success('Booking confirmation opened in new window. Click the print button to print.');
  };

  const clearFilters = () => {
    setFilters({
      start_date: '',
      end_date: '',
      payment_status: '',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading onboard bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 animate-in slide-in-from-left-4 duration-500">
            Onboard Bookings
          </h1>
          <p className="text-gray-600 mt-2 animate-in slide-in-from-left-4 duration-700">
            Confirmed bookings ready for travel
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {Object.values(filters).some(value => value) && (
            <button
              onClick={clearFilters}
              className="flex items-center px-4 py-2.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 animate-in fade-in duration-300"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in-50 duration-500">
        <div className="flex items-center mb-4">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Search Booking</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Booking ID, Client Name, or Service
            </label>
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={bookingIdSearch}
                onChange={(e) => setBookingIdSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter booking ID, client name, or service..."
                className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
              {bookingIdSearch && (
                <button
                  onClick={clearSearch}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleSearch}
                disabled={searchLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Search booking"
              >
                {searchLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Type full or partial booking ID, client name, or service name and press Enter or click search icon
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in-50 duration-500">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Filter Bookings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Travel Date From
            </label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Travel Date To
            </label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status
            </label>
            <select
              value={filters.payment_status}
              onChange={(e) => setFilters({ ...filters, payment_status: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="">All Status</option>
              <option value="PAID">Paid</option>
              <option value="HALF_PAID">Half Paid</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in-50 duration-700">
        {filteredBookings.length > 0 ? (
          <>
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Showing {filteredBookings.length} of {bookings.length} bookings
                  </span>
                  {bookingIdSearch && (
                    <span className="ml-3 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      Search: "{bookingIdSearch}"
                    </span>
                  )}
                </div>
                {bookingIdSearch && (
                  <button
                    onClick={clearSearch}
                    className="text-sm text-gray-600 hover:text-gray-800 flex items-center transition-colors duration-200"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear search
                  </button>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Travel Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredBookings.map((booking, index) => (
                    <tr 
                      key={booking.id} 
                      className="hover:bg-gray-50/50 transition-colors duration-150 animate-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">#{booking.id}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Created: {formatDate(booking.created_at)}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.client_details?.name || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.client_details?.phone_number || ''}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.service_details?.service_name || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.service_details?.destination || ''}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            <div>
                              <div className="text-xs text-gray-500">Departure:</div>
                              <span className={booking.departure_date ? "text-gray-900 font-medium" : "text-gray-400"}>
                                {booking.departure_date ? formatDate(booking.departure_date) : 'Not set'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            <div>
                              <div className="text-xs text-gray-500">Arrival:</div>
                              <span className={booking.arrival_date ? "text-gray-900 font-medium" : "text-gray-400"}>
                                {booking.arrival_date ? formatDate(booking.arrival_date) : 'Not set'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            booking.payment_status === 'PAID'
                              ? 'bg-green-100 text-green-800'
                              : booking.payment_status === 'HALF_PAID'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.payment_status_display}
                          </span>
                          
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-green-600">
                              Paid: {formatPKR(booking.paid_amount)}
                            </div>
                            <div className="text-xs font-medium text-red-600">
                              Due: {formatPKR(booking.remaining_amount)}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <button
                          onClick={() => printInvoice(booking)}
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                          title="Print Booking Confirmation"
                        >
                          <Printer className="w-4 h-4 mr-2" />
                          Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {bookingIdSearch 
                ? `No bookings found for "${bookingIdSearch}"`
                : 'No confirmed bookings found'}
            </h3>
            <p className="text-gray-500">
              {Object.values(filters).some(value => value) || bookingIdSearch
                ? 'Try adjusting your filters or search term'
                : 'All confirmed bookings will appear here'}
            </p>
            {(Object.values(filters).some(value => value) || bookingIdSearch) && (
              <div className="mt-4 space-x-3">
                {bookingIdSearch && (
                  <button
                    onClick={clearSearch}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                  >
                    Clear search
                  </button>
                )}
                {Object.values(filters).some(value => value) && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboard;