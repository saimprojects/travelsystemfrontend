import { useEffect, useState, useRef } from "react";
import {
  bookingsAPI,
  clientsAPI,
  servicesAPI,
  agencyAPI,
} from "../services/api";
import {
  Plus,
  Edit,
  DollarSign,
  Search,
  AlertCircle,
  Calendar,
  Clock,
  Briefcase,
  X,
  Save,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  Printer,
  Hash,
  User,
  Phone,
  Mail,
  MapPin,
  Tag,
  CreditCard,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false); // New state for view modal
  const [viewingBooking, setViewingBooking] = useState(null); // New state for booking to view
  const [editingBooking, setEditingBooking] = useState(null);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingIdSearch, setBookingIdSearch] = useState("");
  const [bookingIdQuery, setBookingIdQuery] = useState("");
  const [missingOnly, setMissingOnly] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [printingBooking, setPrintingBooking] = useState(null);
  
  // New states for dropdown search
  const [clientSearch, setClientSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  const searchInputRef = useRef(null);
  const bookingIdInputRef = useRef(null);

  const [datesSummary, setDatesSummary] = useState({
    missing_any: 0,
    missing_arrival: 0,
    missing_departure: 0,
  });

  const [formData, setFormData] = useState({
    client: "",
    service: "",
    discount: "0",
    booking_status: "pending",
    paid_amount: "0",
    payment_method: "",
    arrival_date: "",
    departure_date: "",
  });

  const [paymentData, setPaymentData] = useState({
    paid_amount: "",
    payment_method: "",
    notes: "",
  });

  // Filtered lists for dropdowns
  const filteredClients = clients.filter(client => 
    clientSearch === "" || 
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (client.phone_number && client.phone_number.includes(clientSearch))
  );

  const filteredServices = services
    .filter(s => s.status === "active")
    .filter(service => 
      serviceSearch === "" || 
      service.service_name.toLowerCase().includes(serviceSearch.toLowerCase())
    );

  // Initial data fetch (without any search)
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch when search queries change
  useEffect(() => {
    if (searchQuery || bookingIdQuery || missingOnly) {
      fetchData();
    }
  }, [searchQuery, bookingIdQuery, missingOnly]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showClientDropdown || showServiceDropdown) {
        setShowClientDropdown(false);
        setShowServiceDropdown(false);
        setClientSearch("");
        setServiceSearch("");
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showClientDropdown, showServiceDropdown]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch main data in parallel
      const [bookingsRes, clientsRes, servicesRes, summaryRes] =
        await Promise.all([
          bookingsAPI.getBookings({}),
          clientsAPI.getClients(),
          servicesAPI.getServices(),
          bookingsAPI.getDatesSummary(),
        ]);

      // Set main data immediately
      setBookings(bookingsRes.data.results || bookingsRes.data || []);
      setClients(clientsRes.data.results || clientsRes.data || []);
      setServices(servicesRes.data.results || servicesRes.data || []);
      setDatesSummary(
        summaryRes?.data || {
          missing_any: 0,
          missing_arrival: 0,
          missing_departure: 0,
        },
      );

      // Fetch agency data separately (with fallback)
      try {
        const agencyRes = await agencyAPI.getAgency();
        setAgency(agencyRes.data);
      } catch (agencyError) {
        console.warn("⚠️ Could not fetch agency data:", agencyError.message);
        const defaultAgency = {
          name: "Travel Agency",
          phone_number: "+92 300 1234567",
          email: "info@travelagency.com",
          address: "Karachi, Pakistan",
          status: "active",
        };
        setAgency(defaultAgency);
      }
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      let errorMessage = "Failed to load bookings data. ";
      if (error.message.includes("Network error")) {
        errorMessage += "Please check your internet connection.";
      } else if (error.message.includes("Session expired")) {
        errorMessage = "Session expired. Please login again.";
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else if (error.message.includes("permission")) {
        errorMessage = "You do not have permission to view bookings.";
      } else {
        errorMessage += error.message;
      }
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setSearchLoading(true);
      const bookingsParams = {
        search: searchQuery,
        booking_id: bookingIdQuery,
        ...(missingOnly ? { missing_dates: 1 } : {}),
      };

      const bookingsRes = await bookingsAPI.getBookings(bookingsParams);
      setBookings(bookingsRes.data.results || bookingsRes.data || []);
      
    } catch (error) {
      console.error("❌ Error searching bookings:", error);
      toast.error("Failed to search bookings", { duration: 3000 });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSearchQuery(searchTerm.trim());
      setSearchLoading(true);
    }
  };

  const handleBookingIdKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setBookingIdQuery(bookingIdSearch.trim());
      setSearchLoading(true);
    }
  };

  const handleSearchClick = () => {
    setSearchQuery(searchTerm.trim());
    setSearchLoading(true);
  };

  const handleBookingIdSearchClick = () => {
    setBookingIdQuery(bookingIdSearch.trim());
    setSearchLoading(true);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleClearBookingIdSearch = () => {
    setBookingIdSearch("");
    setBookingIdQuery("");
    if (bookingIdInputRef.current) {
      bookingIdInputRef.current.focus();
    }
  };

  const handleClearAllFilters = () => {
    setSearchTerm("");
    setSearchQuery("");
    setBookingIdSearch("");
    setBookingIdQuery("");
    setMissingOnly(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    fetchInitialData();
  };

  const formatPKR = (amount) => {
    if (!amount && amount !== 0) return "₨ 0";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return `₨ ${num.toLocaleString("en-PK")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatInvoiceDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
      case "PAID":
        return "bg-green-100 text-green-800";
      case "pending":
      case "HALF_PAID":
        return "bg-amber-100 text-amber-800";
      case "rejected":
      case "UNPAID":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
      case "PAID":
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case "pending":
      case "HALF_PAID":
        return <Clock className="w-4 h-4 mr-1" />;
      case "rejected":
      case "UNPAID":
        return <XCircle className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  const openViewModal = (booking) => {
    setViewingBooking(booking);
    setShowViewModal(true);
  };

  const generateInvoiceData = (booking) => {
    const client = clients.find((c) => c.id === booking.client);
    const service = services.find((s) => s.id === booking.service);
    
    const originalPrice = service?.service_total_price || booking.service_details?.service_total_price || booking.total_amount || 0;
    const discount = booking.discount || 0;
    const finalPrice = originalPrice - discount;
    const paid = booking.paid_amount || 0;
    const remaining = finalPrice - paid;

    return {
      bookingId: booking.id,
      invoiceNo: `INV-${String(booking.id).padStart(5, "0")}`,
      invoiceDate: formatInvoiceDate(booking.created_at),

      clientName: client?.name || booking.client_details?.name || "N/A",
      clientPhone: client?.phone_number || booking.client_details?.phone_number || "",
      clientAltPhone: client?.alternative_phone_number || "",
      clientEmail: client?.email || "",
      clientAddress: client?.address || "",

      agencyName: agency?.name || "Your Agency Name",
      agencyPhone: agency?.phone_number || "",
      agencyEmail: agency?.email || "",
      agencyAddress: agency?.address || "",

      serviceName: service?.service_name || booking.service_details?.service_name || "N/A",
      serviceQty: 1,
      servicePrice: originalPrice,

      paymentStatus: booking.payment_status === "PAID" ? "PAID" : 
                    booking.payment_status === "HALF_PAID" ? "HALF PAID" : "PENDING",

      departureDate: formatInvoiceDate(booking.departure_date),
      arrivalDate: formatInvoiceDate(booking.arrival_date),

      subTotal: originalPrice,
      discount: discount,
      total: finalPrice,
      paidAmount: paid,
      remainingAmount: remaining,

      additionalServices: []
    };
  };

  // ── Shared action buttons + WhatsApp script (injected into every template) ──
  const buildInvoiceActions = (invoiceData) => `
    <div class="action-buttons no-print">
      <button class="action-button btn-print" onclick="window.print()">🖨️ Print Invoice</button>
      <button class="action-button btn-pdf" onclick="window.print()">📄 Download PDF</button>
      <button class="action-button btn-wa" onclick="shareOnWhatsApp()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style="margin-right:6px"><path d="M20.52 3.49C18.18 1.14 15.09 0 12 0 5.37 0 0 5.37 0 12c0 2.04.5 4.08 1.51 5.92L0 24l6.33-1.55c1.77.97 3.77 1.55 5.92 1.55 6.63 0 12-5.37 12-12 0-3.09-1.14-6.18-3.49-8.51zM12 21.6c-1.94 0-3.83-.55-5.46-1.58l-.39-.23-3.96 1.03 1.06-3.84-.25-.39A9.57 9.57 0 0 1 2.4 12c0-5.3 4.3-9.6 9.6-9.6 2.56 0 5.12.98 7.07 2.93s2.93 4.51 2.93 7.07c0 5.3-4.3 9.6-9.6 9.6zm5.26-7.18c-.15-.08-1.23-.61-1.42-.67-.19-.07-.33-.1-.47.1-.14.19-.55.67-.68.81-.13.14-.26.16-.49.05-.23-.11-.97-.36-1.84-1.15-.68-.61-1.14-1.36-1.27-1.59-.13-.23-.01-.36.1-.47.1-.1.23-.26.34-.39.12-.13.16-.23.24-.39.08-.16.04-.3-.02-.42-.06-.12-.47-1.14-.64-1.56-.17-.42-.35-.36-.47-.37-.12-.01-.26-.01-.39-.01s-.36.05-.55.26c-.19.21-.73.71-.73 1.73s.75 2.01.85 2.15c.1.14 1.47 2.25 3.58 3.15.49.21.87.34 1.17.43.49.16.93.14 1.28.08.39-.06 1.23-.5 1.4-.99.17-.48.17-.9.12-.99-.05-.09-.2-.14-.35-.22z"/></svg>
        WhatsApp
      </button>
    </div>
    <script>
      function shareOnWhatsApp() {
        const msg = \`*Invoice #${invoiceData.invoiceNo}*\\n\\n*Client:* ${invoiceData.clientName}\\n*Service:* ${invoiceData.serviceName}\\n*Total:* PKR ${invoiceData.total.toLocaleString()}\\n*Paid:* PKR ${invoiceData.paidAmount.toLocaleString()}\\n*Due:* PKR ${invoiceData.remainingAmount.toLocaleString()}\\n*Status:* ${invoiceData.paymentStatus}\\n\\nThank you for choosing ${invoiceData.agencyName}!\`;
        window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
      }
    <\/script>
  `;

  const buildStatusBadge = (status) => {
    const cls = status === "PAID" ? "status-paid" : status === "HALF PAID" ? "status-half" : "status-pending";
    return `<span class="status-badge ${cls}">${status}</span>`;
  };

  // ── TEMPLATE 1: Classic Blue ────────────────────────────────────────────────
  const buildClassicTemplate = (invoiceData) => `<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8"><title>Invoice ${invoiceData.invoiceNo}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      @page{size:A4 portrait;margin:12mm}
      body{font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;background:#f1f5f9;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      .wrap{max-width:780px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.1)}
      .top-bar{background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:28px 32px;display:flex;align-items:center;justify-content:space-between}
      .top-bar-left{display:flex;align-items:center;gap:16px}
      .logo-box{width:64px;height:64px;border-radius:10px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0}
      .logo-box img{width:100%;height:100%;object-fit:contain}
      .agency-name{color:#fff;font-size:20px;font-weight:700;letter-spacing:.3px}
      .agency-sub{color:rgba(255,255,255,.75);font-size:12px;margin-top:3px}
      .invoice-title{text-align:right}
      .invoice-title h1{color:#fff;font-size:36px;font-weight:800;letter-spacing:3px;text-transform:uppercase}
      .invoice-title p{color:rgba(255,255,255,.8);font-size:13px;margin-top:4px}
      .contact-strip{background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:10px 32px;display:flex;gap:24px;font-size:12px;color:#64748b}
      .contact-strip span{display:flex;align-items:center;gap:6px}
      .body{padding:28px 32px}
      .meta-row{display:flex;gap:20px;margin-bottom:24px}
      .meta-box{flex:1;border:1.5px solid #e2e8f0;border-radius:10px;padding:16px}
      .meta-box h3{font-size:11px;text-transform:uppercase;letter-spacing:1.2px;color:#94a3b8;margin-bottom:10px;font-weight:600}
      .meta-box p{font-size:14px;color:#1e293b;margin-bottom:4px}
      .meta-box p strong{font-weight:700}
      .meta-box .big{font-size:18px;font-weight:700;color:#4f46e5}
      table{width:100%;border-collapse:collapse;margin:20px 0}
      table th{background:#f8fafc;color:#4f46e5;font-size:11px;text-transform:uppercase;letter-spacing:1px;padding:11px 14px;text-align:left;border:1px solid #e2e8f0}
      table td{padding:12px 14px;border:1px solid #e2e8f0;font-size:13px;color:#334155}
      table tr:nth-child(even) td{background:#f8faff}
      .totals{margin-top:16px;border:1.5px solid #e2e8f0;border-radius:10px;overflow:hidden}
      .t-row{display:flex;justify-content:space-between;padding:10px 18px;border-bottom:1px dashed #e2e8f0;font-size:13px}
      .t-row:last-child{border-bottom:none;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;padding:14px 18px}
      .t-row:last-child span{font-size:16px;font-weight:800}
      .pay-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}
      .pay-card{border-radius:10px;padding:14px 16px;border:1.5px solid}
      .pay-card.total{border-color:#c7d2fe;background:#eef2ff}
      .pay-card.paid{border-color:#bbf7d0;background:#f0fdf4}
      .pay-card.due{border-color:#fecaca;background:#fef2f2}
      .pay-card.status{border-color:#e2e8f0;background:#f8fafc}
      .pay-card label{font-size:11px;text-transform:uppercase;letter-spacing:.8px;font-weight:600;color:#64748b;display:block;margin-bottom:6px}
      .pay-card .val{font-size:18px;font-weight:800}
      .pay-card.total .val{color:#4f46e5}
      .pay-card.paid .val{color:#16a34a}
      .pay-card.due .val{color:#dc2626}
      .status-badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
      .status-paid{background:#dcfce7;color:#15803d}
      .status-half{background:#fef9c3;color:#a16207}
      .status-pending{background:#fee2e2;color:#b91c1c}
      .note{margin-top:16px;padding:13px 16px;border-radius:8px;font-size:12px;text-align:center;border:1px solid}
      .note.warn{background:#fffbeb;border-color:#fcd34d;color:#92400e}
      .note.ok{background:#f0fdf4;border-color:#86efac;color:#166534}
      .footer{margin-top:24px;padding:16px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#94a3b8}
      .action-buttons{position:fixed;top:16px;right:16px;display:flex;gap:8px;z-index:999}
      .action-button{padding:9px 18px;border:none;border-radius:7px;cursor:pointer;font-weight:600;font-size:13px;display:flex;align-items:center;color:#fff;gap:4px}
      .btn-print{background:#4f46e5}.btn-pdf{background:#3b82f6}.btn-wa{background:#25D366}
      @media print{.action-buttons,.no-print{display:none!important}.wrap{box-shadow:none;border-radius:0}.body{padding:16px 20px}.top-bar{padding:16px 20px}.contact-strip{padding:6px 20px}}
    </style></head><body>
    ${buildInvoiceActions(invoiceData)}
    <div class="wrap">
      <div class="top-bar">
        <div class="top-bar-left">
          <div class="logo-box">${invoiceData.agencyLogoUrl ? `<img src="${invoiceData.agencyLogoUrl}" alt="logo">` : `<svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="1.5" width="32" height="32"><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/></svg>`}</div>
          <div><div class="agency-name">${invoiceData.agencyName}</div><div class="agency-sub">Travel Agency</div></div>
        </div>
        <div class="invoice-title"><h1>INVOICE</h1><p>${invoiceData.invoiceNo}</p></div>
      </div>
      <div class="contact-strip">
        ${invoiceData.agencyPhone ? `<span>📞 ${invoiceData.agencyPhone}</span>` : ""}
        ${invoiceData.agencyEmail ? `<span>✉️ ${invoiceData.agencyEmail}</span>` : ""}
        ${invoiceData.agencyAddress ? `<span>📍 ${invoiceData.agencyAddress}</span>` : ""}
      </div>
      <div class="body">
        <div class="meta-row">
          <div class="meta-box">
            <h3>Bill To</h3>
            <p><strong>${invoiceData.clientName}</strong></p>
            ${invoiceData.clientPhone ? `<p>📞 ${invoiceData.clientPhone}</p>` : ""}
            ${invoiceData.clientAltPhone ? `<p>📞 ${invoiceData.clientAltPhone} (Alt)</p>` : ""}
            ${invoiceData.clientEmail ? `<p>✉️ ${invoiceData.clientEmail}</p>` : ""}
            ${invoiceData.clientAddress ? `<p>📍 ${invoiceData.clientAddress}</p>` : ""}
          </div>
          <div class="meta-box">
            <h3>Invoice Details</h3>
            <p><strong>Invoice No:</strong> ${invoiceData.invoiceNo}</p>
            <p><strong>Booking ID:</strong> #${invoiceData.bookingId}</p>
            <p><strong>Date:</strong> ${invoiceData.invoiceDate}</p>
            ${invoiceData.departureDate ? `<p><strong>Departure:</strong> ${invoiceData.departureDate}</p>` : ""}
            ${invoiceData.arrivalDate ? `<p><strong>Arrival:</strong> ${invoiceData.arrivalDate}</p>` : ""}
            <p><strong>Status:</strong> ${buildStatusBadge(invoiceData.paymentStatus)}</p>
          </div>
        </div>
        <table>
          <thead><tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr></thead>
          <tbody>
            <tr><td>${invoiceData.serviceName}</td><td>1</td><td>PKR ${invoiceData.servicePrice.toLocaleString()}</td><td>PKR ${invoiceData.servicePrice.toLocaleString()}</td></tr>
          </tbody>
        </table>
        <div class="totals">
          <div class="t-row"><span>Sub Total</span><span>PKR ${invoiceData.subTotal.toLocaleString()}</span></div>
          ${invoiceData.discount > 0 ? `<div class="t-row"><span>Discount</span><span style="color:#dc2626">- PKR ${invoiceData.discount.toLocaleString()}</span></div>` : ""}
          <div class="t-row"><span>TOTAL AMOUNT</span><span>PKR ${invoiceData.total.toLocaleString()}</span></div>
        </div>
        <div class="pay-grid">
          <div class="pay-card total"><label>Total Amount</label><div class="val">PKR ${invoiceData.total.toLocaleString()}</div></div>
          <div class="pay-card paid"><label>Amount Paid</label><div class="val">PKR ${invoiceData.paidAmount.toLocaleString()}</div></div>
          <div class="pay-card due"><label>Remaining Due</label><div class="val">PKR ${invoiceData.remainingAmount.toLocaleString()}</div></div>
          <div class="pay-card status"><label>Payment Status</label><div style="margin-top:4px">${buildStatusBadge(invoiceData.paymentStatus)}</div></div>
        </div>
        <div class="note ${invoiceData.remainingAmount > 0 ? "warn" : "ok"}">
          ${invoiceData.remainingAmount > 0 ? `<strong>Note:</strong> Please clear the remaining balance of <strong>PKR ${invoiceData.remainingAmount.toLocaleString()}</strong> before departure.` : `<strong>✓ Fully Paid</strong> — Thank you! Payment has been received in full.`}
        </div>
      </div>
      <div class="footer">Thank you for choosing <strong>${invoiceData.agencyName}</strong> &nbsp;|&nbsp; Generated on ${new Date().toLocaleDateString("en-PK",{day:"numeric",month:"long",year:"numeric"})}</div>
    </div></body></html>`;

  // ── TEMPLATE 2: Gold Voucher ────────────────────────────────────────────────
  const buildGoldVoucherTemplate = (invoiceData) => `<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8"><title>Invoice ${invoiceData.invoiceNo}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      @page{size:A4 portrait;margin:10mm}
      body{font-family:'Georgia',serif;color:#1a0a00;background:#fdf8f0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      .wrap{max-width:780px;margin:0 auto;background:#fff;border:2px solid #c9a227;border-radius:4px;overflow:hidden}
      .top{display:flex;align-items:flex-start;justify-content:space-between;padding:20px 28px 16px;border-bottom:2px solid #c9a227;gap:16px}
      .top-left{display:flex;align-items:center;gap:14px}
      .logo-box{width:70px;height:70px;border:2px solid #c9a227;border-radius:4px;overflow:hidden;background:#1a0a00;display:flex;align-items:center;justify-content:center;flex-shrink:0}
      .logo-box img{width:100%;height:100%;object-fit:contain}
      .agency-name-block .name{font-size:22px;font-weight:700;color:#1a0a00;letter-spacing:.5px}
      .agency-name-block .tagline{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c9a227;margin-top:2px}
      .agency-name-block .divider{display:flex;align-items:center;gap:6px;margin:4px 0}
      .agency-name-block .divider hr{flex:1;border:none;border-top:1px solid #c9a227}
      .agency-name-block .divider span{color:#c9a227;font-size:10px}
      .top-right{text-align:right}
      .voucher-title{font-size:38px;font-weight:800;color:#1a0a00;letter-spacing:3px;text-transform:uppercase;font-family:Georgia,serif}
      .badge-row{display:flex;gap:8px;justify-content:flex-end;margin-top:8px}
      .badge{border-radius:3px;padding:4px 10px}
      .badge-dark{background:#1a0a00;color:#fff;font-size:10px;font-weight:600;letter-spacing:.5px}
      .badge-val{background:#fef3c7;border:1px solid #c9a227;color:#78350f;font-size:11px;font-weight:700}
      .contact-row{background:#fdf8f0;padding:7px 28px;border-bottom:1px solid #e8d5a3;display:flex;gap:20px;font-size:11px;color:#78350f}
      .contact-row span{display:flex;align-items:center;gap:5px}
      .info-grid{display:grid;grid-template-columns:1fr 1fr;border-bottom:2px solid #c9a227}
      .info-box{padding:16px 24px}
      .info-box:first-child{border-right:1px solid #e8d5a3}
      .info-box-header{display:flex;align-items:center;gap:8px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #e8d5a3}
      .info-box-header .icon-circle{width:28px;height:28px;border:1.5px solid #c9a227;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
      .info-box-header span{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#78350f}
      .info-row{display:flex;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px dashed #e8d5a3;font-size:12px}
      .info-row:last-child{border-bottom:none}
      .info-row .icon-sm{width:22px;height:22px;border:1px solid #d4b483;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;color:#78350f}
      .info-label{font-weight:700;color:#1a0a00;min-width:80px}
      .info-val{color:#44200a}
      .section-divider{display:flex;align-items:center;gap:12px;padding:10px 24px;background:#fdf8f0;border-bottom:1px solid #e8d5a3}
      .section-divider hr{flex:1;border:none;border-top:1px solid #c9a227}
      .section-divider .title{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#78350f}
      .section-divider .diamond{color:#c9a227;font-size:16px}
      table{width:100%;border-collapse:collapse;margin:0}
      table thead tr{background:#1a0a00}
      table th{color:#c9a227;font-size:10px;text-transform:uppercase;letter-spacing:1px;padding:10px 14px;text-align:left;font-weight:700;border:none}
      table td{padding:10px 14px;border:none;font-size:12px;color:#1a0a00;border-bottom:1px solid #f0e6d3}
      table tr:last-child td{border-bottom:none}
      .pay-section{padding:16px 24px;display:grid;grid-template-columns:1fr 1fr;gap:16px;border-top:2px solid #c9a227}
      .pay-col{}
      .pay-item{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px dashed #e8d5a3;font-size:12px}
      .pay-item:last-child{border-bottom:none}
      .pay-item .lbl{color:#78350f;font-weight:600}
      .pay-item .val{font-weight:700;color:#1a0a00}
      .pay-item .val.green{color:#15803d}
      .pay-item .val.red{color:#b91c1c}
      .status-badge{display:inline-block;padding:3px 10px;border-radius:12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;font-family:Arial,sans-serif}
      .status-paid{background:#dcfce7;color:#15803d}
      .status-half{background:#fef9c3;color:#a16207}
      .status-pending{background:#fee2e2;color:#b91c1c}
      .note-strip{background:#fdf8f0;border-top:1px solid #e8d5a3;padding:10px 24px;font-size:11px;color:#78350f;text-align:center}
      .footer{background:#1a0a00;padding:12px 24px;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#c9a227}
      .action-buttons{position:fixed;top:16px;right:16px;display:flex;gap:8px;z-index:999}
      .action-button{padding:9px 18px;border:none;border-radius:7px;cursor:pointer;font-weight:600;font-size:13px;display:flex;align-items:center;color:#fff;gap:4px}
      .btn-print{background:#78350f}.btn-pdf{background:#b45309}.btn-wa{background:#25D366}
      @media print{.action-buttons,.no-print{display:none!important}.wrap{border:none}}
    </style></head><body>
    ${buildInvoiceActions(invoiceData)}
    <div class="wrap">
      <div class="top">
        <div class="top-left">
          <div class="logo-box">${invoiceData.agencyLogoUrl ? `<img src="${invoiceData.agencyLogoUrl}" alt="logo">` : `<svg viewBox="0 0 24 24" fill="none" stroke="#c9a227" stroke-width="1.5" width="36" height="36"><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/><path d="M12 3v18M3 7l9 4 9-4"/></svg>`}</div>
          <div class="agency-name-block">
            <div class="name">${invoiceData.agencyName}</div>
            <div class="divider"><hr/><span>✦</span><hr/></div>
            <div class="tagline">Travel &amp; Tours</div>
          </div>
        </div>
        <div class="top-right">
          <div class="voucher-title">INVOICE</div>
          <div class="badge-row">
            <div class="badge badge-dark">INVOICE NO.</div>
            <div class="badge badge-val">${invoiceData.invoiceNo}</div>
          </div>
          <div class="badge-row" style="margin-top:4px">
            <div class="badge badge-dark">DATE</div>
            <div class="badge badge-val">${invoiceData.invoiceDate}</div>
          </div>
        </div>
      </div>
      <div class="contact-row">
        ${invoiceData.agencyPhone ? `<span>📞 ${invoiceData.agencyPhone}</span>` : ""}
        ${invoiceData.agencyEmail ? `<span>✉️ ${invoiceData.agencyEmail}</span>` : ""}
        ${invoiceData.agencyAddress ? `<span>📍 ${invoiceData.agencyAddress}</span>` : ""}
      </div>
      <div class="info-grid">
        <div class="info-box">
          <div class="info-box-header"><div class="icon-circle">📋</div><span>Booking Information</span></div>
          <div class="info-row"><div class="icon-sm">🧑</div><span class="info-label">Client :</span><span class="info-val"><strong>${invoiceData.clientName}</strong></span></div>
          ${invoiceData.clientPhone ? `<div class="info-row"><div class="icon-sm">📞</div><span class="info-label">Phone :</span><span class="info-val">${invoiceData.clientPhone}</span></div>` : ""}
          ${invoiceData.clientAltPhone ? `<div class="info-row"><div class="icon-sm">📞</div><span class="info-label">Alt Phone :</span><span class="info-val">${invoiceData.clientAltPhone}</span></div>` : ""}
          ${invoiceData.clientEmail ? `<div class="info-row"><div class="icon-sm">✉️</div><span class="info-label">Email :</span><span class="info-val">${invoiceData.clientEmail}</span></div>` : ""}
          ${invoiceData.clientAddress ? `<div class="info-row"><div class="icon-sm">📍</div><span class="info-label">Address :</span><span class="info-val">${invoiceData.clientAddress}</span></div>` : ""}
        </div>
        <div class="info-box">
          <div class="info-box-header"><div class="icon-circle">ℹ️</div><span>Invoice Details</span></div>
          <div class="info-row"><div class="icon-sm">#</div><span class="info-label">Booking ID :</span><span class="info-val"><strong>#${invoiceData.bookingId}</strong></span></div>
          <div class="info-row"><div class="icon-sm">📄</div><span class="info-label">Invoice No :</span><span class="info-val">${invoiceData.invoiceNo}</span></div>
          ${invoiceData.departureDate ? `<div class="info-row"><div class="icon-sm">✈️</div><span class="info-label">Departure :</span><span class="info-val">${invoiceData.departureDate}</span></div>` : ""}
          ${invoiceData.arrivalDate ? `<div class="info-row"><div class="icon-sm">🏠</div><span class="info-label">Arrival :</span><span class="info-val">${invoiceData.arrivalDate}</span></div>` : ""}
          <div class="info-row"><div class="icon-sm">💳</div><span class="info-label">Status :</span><span class="info-val">${buildStatusBadge(invoiceData.paymentStatus)}</span></div>
        </div>
      </div>
      <div class="section-divider">
        <hr/><div class="title"><span class="diamond">❖</span>Service Details<span class="diamond">❖</span></div><hr/>
      </div>
      <table>
        <thead><tr><th>Service / Description</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr></thead>
        <tbody><tr><td><strong>${invoiceData.serviceName}</strong></td><td>1</td><td>PKR ${invoiceData.servicePrice.toLocaleString()}</td><td><strong>PKR ${invoiceData.servicePrice.toLocaleString()}</strong></td></tr></tbody>
      </table>
      <div class="pay-section">
        <div class="pay-col">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#78350f;margin-bottom:8px">Payment Summary</div>
          <div class="pay-item"><span class="lbl">Sub Total :</span><span class="val">PKR ${invoiceData.subTotal.toLocaleString()}</span></div>
          ${invoiceData.discount > 0 ? `<div class="pay-item"><span class="lbl">Discount :</span><span class="val red">- PKR ${invoiceData.discount.toLocaleString()}</span></div>` : ""}
          <div class="pay-item" style="border-top:2px solid #c9a227;margin-top:6px;padding-top:8px"><span class="lbl" style="font-size:14px">Total :</span><span class="val" style="font-size:16px;color:#78350f">PKR ${invoiceData.total.toLocaleString()}</span></div>
        </div>
        <div class="pay-col">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#78350f;margin-bottom:8px">Payment Status</div>
          <div class="pay-item"><span class="lbl">Total Amount :</span><span class="val">PKR ${invoiceData.total.toLocaleString()}</span></div>
          <div class="pay-item"><span class="lbl">Amount Paid :</span><span class="val green">PKR ${invoiceData.paidAmount.toLocaleString()}</span></div>
          <div class="pay-item"><span class="lbl">Balance Due :</span><span class="val red">PKR ${invoiceData.remainingAmount.toLocaleString()}</span></div>
          <div class="pay-item"><span class="lbl">Status :</span>${buildStatusBadge(invoiceData.paymentStatus)}</div>
        </div>
      </div>
      ${invoiceData.remainingAmount > 0 ? `<div class="note-strip">⚠️ <strong>Note:</strong> All amounts must be cleared before departure date!</div>` : `<div class="note-strip">✅ <strong>Payment Complete</strong> — Thank you for your business!</div>`}
      <div class="footer">
        <span>Thank you for choosing <strong>${invoiceData.agencyName}</strong></span>
        <span>Generated: ${new Date().toLocaleDateString("en-PK",{day:"numeric",month:"short",year:"numeric"})}</span>
      </div>
    </div></body></html>`;

  // ── TEMPLATE 3: Dark Professional ──────────────────────────────────────────
  const buildDarkProTemplate = (invoiceData) => `<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8"><title>Invoice ${invoiceData.invoiceNo}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      @page{size:A4 portrait;margin:12mm}
      body{font-family:Arial,'Helvetica Neue',sans-serif;color:#1f2937;background:#e5e7eb;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      .wrap{max-width:780px;margin:0 auto;background:#fff;overflow:hidden}
      .header{background:#111827;padding:24px 32px;display:flex;align-items:center;justify-content:space-between}
      .header-left{display:flex;align-items:center;gap:16px}
      .logo-box{width:60px;height:60px;border:2px solid #f59e0b;border-radius:8px;overflow:hidden;background:#1f2937;display:flex;align-items:center;justify-content:center;flex-shrink:0}
      .logo-box img{width:100%;height:100%;object-fit:contain}
      .agency-name{color:#fff;font-size:18px;font-weight:700}
      .agency-sub{color:#9ca3af;font-size:11px;margin-top:2px;letter-spacing:1px;text-transform:uppercase}
      .header-right{text-align:right}
      .invoice-word{color:#fff;font-size:34px;font-weight:900;letter-spacing:4px}
      .invoice-ref{color:#f59e0b;font-size:13px;margin-top:4px;font-weight:600}
      .accent-bar{height:4px;background:linear-gradient(90deg,#f59e0b,#fbbf24,#f59e0b)}
      .meta-section{display:flex;align-items:flex-start;padding:20px 32px;gap:24px;background:#f9fafb;border-bottom:1px solid #e5e7eb}
      .bill-to{flex:1}
      .bill-to .label{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#6b7280;font-weight:700;margin-bottom:6px}
      .bill-to .client-name{font-size:17px;font-weight:700;color:#111827}
      .bill-to .client-info{font-size:12px;color:#4b5563;margin-top:3px}
      .balance-box{background:#111827;border-radius:8px;padding:14px 20px;text-align:center;min-width:160px}
      .balance-box .bal-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;font-weight:600}
      .balance-box .bal-amount{font-size:22px;font-weight:900;color:#f59e0b;margin-top:4px}
      .dates-row{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-bottom:1px solid #e5e7eb}
      .date-cell{padding:12px 24px;border-right:1px solid #e5e7eb;font-size:12px}
      .date-cell:last-child{border-right:none}
      .date-cell .dc-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;font-weight:600;margin-bottom:3px}
      .date-cell .dc-val{font-weight:700;color:#1f2937}
      table{width:100%;border-collapse:collapse}
      table thead tr{background:#1f2937}
      table th{color:#d1d5db;font-size:10px;text-transform:uppercase;letter-spacing:1px;padding:11px 24px;text-align:left;font-weight:700}
      table td{padding:12px 24px;font-size:13px;color:#374151;border-bottom:1px solid #f3f4f6}
      table tbody tr:last-child td{border-bottom:none}
      .totals-row{display:flex;justify-content:flex-end;padding:16px 24px;gap:0;border-top:1px solid #e5e7eb}
      .totals-table{min-width:280px}
      .tot-line{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;border-bottom:1px dashed #e5e7eb}
      .tot-line:last-child{border-bottom:none;background:#111827;color:#fff;padding:10px 12px;margin-top:6px;border-radius:6px}
      .tot-line:last-child .tl-label{font-size:14px;font-weight:700}
      .tot-line:last-child .tl-val{font-size:16px;font-weight:900;color:#f59e0b}
      .pay-summary{display:grid;grid-template-columns:1fr 1fr 1fr;border-top:3px solid #111827}
      .ps-cell{padding:16px 20px;border-right:1px solid #e5e7eb}
      .ps-cell:last-child{border-right:none}
      .ps-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;font-weight:700;margin-bottom:6px}
      .ps-val{font-size:17px;font-weight:800}
      .ps-val.green{color:#15803d}.ps-val.red{color:#dc2626}.ps-val.gray{color:#1f2937}
      .status-badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
      .status-paid{background:#dcfce7;color:#15803d}
      .status-half{background:#fef9c3;color:#a16207}
      .status-pending{background:#fee2e2;color:#b91c1c}
      .note-bar{padding:12px 24px;font-size:12px;text-align:center;border-top:1px solid #e5e7eb}
      .note-bar.warn{background:#fffbeb;color:#92400e}
      .note-bar.ok{background:#f0fdf4;color:#166534}
      .footer{background:#f9fafb;border-top:1px solid #e5e7eb;padding:12px 24px;display:flex;justify-content:space-between;font-size:11px;color:#9ca3af}
      .action-buttons{position:fixed;top:16px;right:16px;display:flex;gap:8px;z-index:999}
      .action-button{padding:9px 18px;border:none;border-radius:7px;cursor:pointer;font-weight:600;font-size:13px;display:flex;align-items:center;color:#fff;gap:4px}
      .btn-print{background:#111827}.btn-pdf{background:#374151}.btn-wa{background:#25D366}
      @media print{.action-buttons,.no-print{display:none!important}.wrap{box-shadow:none}}
    </style></head><body>
    ${buildInvoiceActions(invoiceData)}
    <div class="wrap">
      <div class="header">
        <div class="header-left">
          <div class="logo-box">${invoiceData.agencyLogoUrl ? `<img src="${invoiceData.agencyLogoUrl}" alt="logo">` : `<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="1.5" width="32" height="32"><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/></svg>`}</div>
          <div><div class="agency-name">${invoiceData.agencyName}</div><div class="agency-sub">Professional Travel Services</div></div>
        </div>
        <div class="header-right">
          <div class="invoice-word">INVOICE</div>
          <div class="invoice-ref">${invoiceData.invoiceNo} &nbsp;|&nbsp; Booking #${invoiceData.bookingId}</div>
        </div>
      </div>
      <div class="accent-bar"></div>
      <div class="meta-section">
        <div class="bill-to">
          <div class="label">Hotel Booking — Bill To</div>
          <div class="client-name">${invoiceData.clientName}</div>
          ${invoiceData.clientPhone ? `<div class="client-info">📞 ${invoiceData.clientPhone}${invoiceData.clientAltPhone ? " &nbsp;|&nbsp; " + invoiceData.clientAltPhone : ""}</div>` : ""}
          ${invoiceData.clientEmail ? `<div class="client-info">✉️ ${invoiceData.clientEmail}</div>` : ""}
          ${invoiceData.clientAddress ? `<div class="client-info">📍 ${invoiceData.clientAddress}</div>` : ""}
        </div>
        <div class="balance-box">
          <div class="bal-label">Balance Due</div>
          <div class="bal-amount">PKR ${invoiceData.remainingAmount.toLocaleString()}</div>
          <div style="margin-top:8px">${buildStatusBadge(invoiceData.paymentStatus)}</div>
        </div>
      </div>
      <div class="dates-row">
        <div class="date-cell"><div class="dc-label">Invoice Date</div><div class="dc-val">${invoiceData.invoiceDate}</div></div>
        <div class="date-cell"><div class="dc-label">Departure Date</div><div class="dc-val">${invoiceData.departureDate || "—"}</div></div>
        <div class="date-cell"><div class="dc-label">Return Date</div><div class="dc-val">${invoiceData.arrivalDate || "—"}</div></div>
      </div>
      <table>
        <thead><tr><th>Item / Service Description</th><th>Nights</th><th>Rate</th><th>Amount</th></tr></thead>
        <tbody><tr><td><strong>${invoiceData.serviceName}</strong></td><td>—</td><td>PKR ${invoiceData.servicePrice.toLocaleString()}</td><td><strong>PKR ${invoiceData.servicePrice.toLocaleString()}</strong></td></tr></tbody>
      </table>
      <div class="totals-row">
        <div class="totals-table">
          <div class="tot-line"><span class="tl-label">Sub Total:</span><span class="tl-val">PKR ${invoiceData.subTotal.toLocaleString()}</span></div>
          ${invoiceData.discount > 0 ? `<div class="tot-line"><span class="tl-label">Discount:</span><span class="tl-val" style="color:#dc2626">- PKR ${invoiceData.discount.toLocaleString()}</span></div>` : ""}
          <div class="tot-line"><span class="tl-label">Total:</span><span class="tl-val">PKR ${invoiceData.total.toLocaleString()}</span></div>
        </div>
      </div>
      <div class="pay-summary">
        <div class="ps-cell"><div class="ps-label">Total Amount</div><div class="ps-val gray">PKR ${invoiceData.total.toLocaleString()}</div></div>
        <div class="ps-cell"><div class="ps-label">Amount Paid</div><div class="ps-val green">PKR ${invoiceData.paidAmount.toLocaleString()}</div></div>
        <div class="ps-cell"><div class="ps-label">Remaining Due</div><div class="ps-val red">PKR ${invoiceData.remainingAmount.toLocaleString()}</div></div>
      </div>
      <div class="note-bar ${invoiceData.remainingAmount > 0 ? "warn" : "ok"}">
        ${invoiceData.remainingAmount > 0 ? `⚠️ <strong>Note:</strong> All amounts must be cleared before the due date!` : `✅ <strong>Fully Paid</strong> — Thank you for your business with ${invoiceData.agencyName}!`}
      </div>
      <div class="footer">
        <span>${invoiceData.agencyName} &nbsp;|&nbsp; ${invoiceData.agencyPhone || ""} &nbsp;${invoiceData.agencyEmail ? "| " + invoiceData.agencyEmail : ""}</span>
        <span>Generated: ${new Date().toLocaleDateString("en-PK",{day:"numeric",month:"short",year:"numeric"})}</span>
      </div>
    </div></body></html>`;

  // ── TEMPLATE 4: Modern Minimal ──────────────────────────────────────────────
  const buildMinimalTemplate = (invoiceData) => `<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8"><title>Invoice ${invoiceData.invoiceNo}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      @page{size:A4 portrait;margin:16mm}
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#18181b;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      .wrap{max-width:740px;margin:0 auto;padding:40px}
      .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px}
      .header-left{display:flex;align-items:center;gap:14px}
      .logo-circle{width:52px;height:52px;border-radius:50%;overflow:hidden;background:#f4f4f5;display:flex;align-items:center;justify-content:center;flex-shrink:0}
      .logo-circle img{width:100%;height:100%;object-fit:contain}
      .agency-name{font-size:16px;font-weight:700;color:#18181b;letter-spacing:-.3px}
      .agency-contact{font-size:11px;color:#a1a1aa;margin-top:2px}
      .invoice-label{font-size:42px;font-weight:200;color:#d4d4d8;letter-spacing:4px;text-transform:uppercase}
      .divider{height:1px;background:#e4e4e7;margin:0 0 28px}
      .meta-row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px}
      .bill-block .lbl{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#a1a1aa;font-weight:600;margin-bottom:8px}
      .bill-block .name{font-size:16px;font-weight:700;color:#18181b;margin-bottom:3px}
      .bill-block .info{font-size:12px;color:#71717a;margin-bottom:2px}
      .details-block{text-align:right}
      .details-block .lbl{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#a1a1aa;font-weight:600;margin-bottom:8px}
      .det-row{display:flex;justify-content:flex-end;gap:16px;font-size:12px;margin-bottom:4px}
      .det-row .dk{color:#a1a1aa}.det-row .dv{color:#18181b;font-weight:600;min-width:100px;text-align:right}
      table{width:100%;border-collapse:collapse;margin-bottom:24px}
      table thead tr th{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#a1a1aa;font-weight:600;padding:0 0 10px;border-bottom:1px solid #e4e4e7;text-align:left}
      table thead tr th:last-child{text-align:right}
      table td{padding:14px 0;font-size:13px;color:#3f3f46;border-bottom:1px solid #f4f4f5}
      table td:last-child{text-align:right;font-weight:600}
      .subtotals{border-top:1px solid #e4e4e7;padding-top:16px;display:flex;flex-direction:column;align-items:flex-end;gap:6px;margin-bottom:28px}
      .sub-row{display:flex;gap:32px;font-size:13px}
      .sub-row .sk{color:#a1a1aa;min-width:100px;text-align:right}.sub-row .sv{color:#18181b;font-weight:600;min-width:100px;text-align:right}
      .sub-row.total-row .sk{font-size:15px;font-weight:700;color:#18181b}.sub-row.total-row .sv{font-size:18px;font-weight:800;color:#18181b}
      .pay-section{background:#fafafa;border:1px solid #e4e4e7;border-radius:10px;padding:20px 24px;display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px}
      .pay-item .pk{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#a1a1aa;font-weight:600;margin-bottom:4px}
      .pay-item .pv{font-size:16px;font-weight:800;color:#18181b}
      .pay-item .pv.green{color:#16a34a}.pay-item .pv.red{color:#dc2626}
      .status-badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
      .status-paid{background:#dcfce7;color:#15803d}
      .status-half{background:#fef9c3;color:#a16207}
      .status-pending{background:#fee2e2;color:#b91c1c}
      .note{background:#fafafa;border-left:3px solid #d4d4d8;padding:12px 16px;font-size:12px;color:#71717a;margin-bottom:28px}
      .note.due{border-color:#fbbf24;background:#fffbeb;color:#92400e}
      .note.ok{border-color:#86efac;background:#f0fdf4;color:#166534}
      .footer-line{border-top:1px solid #e4e4e7;padding-top:16px;display:flex;justify-content:space-between;font-size:11px;color:#a1a1aa}
      .action-buttons{position:fixed;top:16px;right:16px;display:flex;gap:8px;z-index:999}
      .action-button{padding:9px 18px;border:none;border-radius:7px;cursor:pointer;font-weight:600;font-size:13px;display:flex;align-items:center;color:#fff;gap:4px}
      .btn-print{background:#18181b}.btn-pdf{background:#3f3f46}.btn-wa{background:#25D366}
      @media print{.action-buttons,.no-print{display:none!important}.wrap{padding:20px}}
    </style></head><body>
    ${buildInvoiceActions(invoiceData)}
    <div class="wrap">
      <div class="header">
        <div class="header-left">
          <div class="logo-circle">${invoiceData.agencyLogoUrl ? `<img src="${invoiceData.agencyLogoUrl}" alt="logo">` : `<svg viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" stroke-width="1.5" width="28" height="28"><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/></svg>`}</div>
          <div><div class="agency-name">${invoiceData.agencyName}</div><div class="agency-contact">${[invoiceData.agencyPhone, invoiceData.agencyEmail, invoiceData.agencyAddress].filter(Boolean).join(" · ")}</div></div>
        </div>
        <div class="invoice-label">Invoice</div>
      </div>
      <div class="divider"></div>
      <div class="meta-row">
        <div class="bill-block">
          <div class="lbl">Bill To</div>
          <div class="name">${invoiceData.clientName}</div>
          ${invoiceData.clientPhone ? `<div class="info">${invoiceData.clientPhone}</div>` : ""}
          ${invoiceData.clientEmail ? `<div class="info">${invoiceData.clientEmail}</div>` : ""}
          ${invoiceData.clientAddress ? `<div class="info">${invoiceData.clientAddress}</div>` : ""}
        </div>
        <div class="details-block">
          <div class="lbl">Details</div>
          <div class="det-row"><span class="dk">Invoice</span><span class="dv">${invoiceData.invoiceNo}</span></div>
          <div class="det-row"><span class="dk">Booking</span><span class="dv">#${invoiceData.bookingId}</span></div>
          <div class="det-row"><span class="dk">Date</span><span class="dv">${invoiceData.invoiceDate}</span></div>
          ${invoiceData.departureDate ? `<div class="det-row"><span class="dk">Departure</span><span class="dv">${invoiceData.departureDate}</span></div>` : ""}
          ${invoiceData.arrivalDate ? `<div class="det-row"><span class="dk">Arrival</span><span class="dv">${invoiceData.arrivalDate}</span></div>` : ""}
          <div class="det-row"><span class="dk">Status</span><span class="dv">${buildStatusBadge(invoiceData.paymentStatus)}</span></div>
        </div>
      </div>
      <table>
        <thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
        <tbody><tr><td>${invoiceData.serviceName}</td><td>1</td><td>PKR ${invoiceData.servicePrice.toLocaleString()}</td><td>PKR ${invoiceData.servicePrice.toLocaleString()}</td></tr></tbody>
      </table>
      <div class="subtotals">
        <div class="sub-row"><span class="sk">Sub Total</span><span class="sv">PKR ${invoiceData.subTotal.toLocaleString()}</span></div>
        ${invoiceData.discount > 0 ? `<div class="sub-row"><span class="sk">Discount</span><span class="sv" style="color:#dc2626">- PKR ${invoiceData.discount.toLocaleString()}</span></div>` : ""}
        <div class="sub-row total-row"><span class="sk">Total</span><span class="sv">PKR ${invoiceData.total.toLocaleString()}</span></div>
      </div>
      <div class="pay-section">
        <div class="pay-item"><div class="pk">Total Amount</div><div class="pv">PKR ${invoiceData.total.toLocaleString()}</div></div>
        <div class="pay-item"><div class="pk">Amount Paid</div><div class="pv green">PKR ${invoiceData.paidAmount.toLocaleString()}</div></div>
        <div class="pay-item"><div class="pk">Remaining Due</div><div class="pv red">PKR ${invoiceData.remainingAmount.toLocaleString()}</div></div>
        <div class="pay-item"><div class="pk">Status</div><div style="margin-top:4px">${buildStatusBadge(invoiceData.paymentStatus)}</div></div>
      </div>
      <div class="note ${invoiceData.remainingAmount > 0 ? "due" : "ok"}">
        ${invoiceData.remainingAmount > 0 ? `Please clear the remaining balance of <strong>PKR ${invoiceData.remainingAmount.toLocaleString()}</strong> before departure.` : `Payment complete — Thank you for choosing ${invoiceData.agencyName}!`}
      </div>
      <div class="footer-line">
        <span>${invoiceData.agencyName}</span>
        <span>Generated ${new Date().toLocaleDateString("en-PK",{day:"numeric",month:"long",year:"numeric"})}</span>
      </div>
    </div></body></html>`;

  // ── TEMPLATE 5: Corporate Teal ──────────────────────────────────────────────
  const buildCorporateTemplate = (invoiceData) => `<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8"><title>Invoice ${invoiceData.invoiceNo}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      @page{size:A4 portrait;margin:11mm}
      body{font-family:'Segoe UI',Arial,sans-serif;color:#134e4a;background:#f0fdfa;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      .wrap{max-width:780px;margin:0 auto;background:#fff;overflow:hidden;border-top:5px solid #0d9488}
      .header{background:linear-gradient(135deg,#0f766e,#0d9488);padding:22px 30px;display:flex;align-items:center;justify-content:space-between}
      .header-left{display:flex;align-items:center;gap:14px}
      .logo-box{width:58px;height:58px;border-radius:8px;background:rgba(255,255,255,.15);border:2px solid rgba(255,255,255,.3);overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0}
      .logo-box img{width:100%;height:100%;object-fit:contain}
      .agency-name{color:#fff;font-size:19px;font-weight:700;letter-spacing:.3px}
      .agency-sub{color:rgba(255,255,255,.7);font-size:11px;margin-top:2px;letter-spacing:.8px;text-transform:uppercase}
      .header-right{text-align:right}
      .inv-word{color:#fff;font-size:32px;font-weight:900;letter-spacing:3px}
      .inv-meta{color:rgba(255,255,255,.8);font-size:12px;margin-top:4px}
      .emerald-strip{height:3px;background:linear-gradient(90deg,#34d399,#10b981,#059669)}
      .contact-bar{background:#f0fdfa;border-bottom:1px solid #ccfbf1;padding:8px 30px;display:flex;gap:20px;font-size:11px;color:#0f766e}
      .contact-bar span{display:flex;align-items:center;gap:5px}
      .body{padding:24px 30px}
      .info-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
      .info-card{border:1.5px solid #ccfbf1;border-radius:8px;padding:14px 16px;background:#f0fdfa}
      .info-card h3{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#0f766e;font-weight:700;margin-bottom:10px;display:flex;align-items:center;gap:6px}
      .info-card p{font-size:12px;color:#134e4a;margin-bottom:3px}
      .info-card p strong{font-weight:700}
      table{width:100%;border-collapse:collapse;margin-bottom:16px;border-radius:8px;overflow:hidden;border:1.5px solid #ccfbf1}
      table thead tr{background:#0f766e}
      table th{color:#fff;font-size:10px;text-transform:uppercase;letter-spacing:1px;padding:10px 14px;text-align:left;font-weight:700}
      table td{padding:11px 14px;font-size:12px;color:#134e4a;border-bottom:1px solid #f0fdfa}
      table tbody tr:last-child td{border-bottom:none}
      table tbody tr:nth-child(even) td{background:#f0fdfa}
      .totals-block{display:flex;justify-content:flex-end;margin-bottom:16px}
      .totals-inner{min-width:270px;border:1.5px solid #ccfbf1;border-radius:8px;overflow:hidden}
      .tot-row{display:flex;justify-content:space-between;padding:9px 16px;font-size:13px;border-bottom:1px solid #f0fdfa}
      .tot-row:last-child{background:#0f766e;border-bottom:none;padding:11px 16px}
      .tot-row:last-child span{color:#fff;font-weight:700}
      .tot-row:last-child .tv{font-size:15px;font-weight:900;color:#a7f3d0}
      .payments{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1.5px solid #ccfbf1;border-radius:8px;overflow:hidden;margin-bottom:16px}
      .pay-cell{padding:14px 16px;border-right:1px solid #ccfbf1}
      .pay-cell:last-child{border-right:none}
      .pay-cell .pc-label{font-size:9px;text-transform:uppercase;letter-spacing:1.2px;color:#0f766e;font-weight:700;margin-bottom:5px}
      .pay-cell .pc-val{font-size:14px;font-weight:800;color:#134e4a}
      .pay-cell .pc-val.green{color:#047857}.pay-cell .pc-val.red{color:#b91c1c}
      .status-badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
      .status-paid{background:#dcfce7;color:#15803d}
      .status-half{background:#fef9c3;color:#a16207}
      .status-pending{background:#fee2e2;color:#b91c1c}
      .note{padding:11px 16px;border-radius:8px;font-size:12px;text-align:center;border:1px solid;margin-bottom:16px}
      .note.warn{background:#fffbeb;border-color:#fcd34d;color:#92400e}
      .note.ok{background:#f0fdf4;border-color:#6ee7b7;color:#065f46}
      .footer{background:#0f766e;padding:12px 30px;display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,.8)}
      .action-buttons{position:fixed;top:16px;right:16px;display:flex;gap:8px;z-index:999}
      .action-button{padding:9px 18px;border:none;border-radius:7px;cursor:pointer;font-weight:600;font-size:13px;display:flex;align-items:center;color:#fff;gap:4px}
      .btn-print{background:#0f766e}.btn-pdf{background:#0d9488}.btn-wa{background:#25D366}
      @media print{.action-buttons,.no-print{display:none!important}.wrap{border-top-width:3px}.body{padding:16px 20px}}
    </style></head><body>
    ${buildInvoiceActions(invoiceData)}
    <div class="wrap">
      <div class="header">
        <div class="header-left">
          <div class="logo-box">${invoiceData.agencyLogoUrl ? `<img src="${invoiceData.agencyLogoUrl}" alt="logo">` : `<svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="1.5" width="32" height="32"><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/><path d="M12 3v18M3 7l9 4 9-4"/></svg>`}</div>
          <div><div class="agency-name">${invoiceData.agencyName}</div><div class="agency-sub">Travel &amp; Tours</div></div>
        </div>
        <div class="header-right">
          <div class="inv-word">INVOICE</div>
          <div class="inv-meta">${invoiceData.invoiceNo} &nbsp;&bull;&nbsp; ${invoiceData.invoiceDate}</div>
        </div>
      </div>
      <div class="emerald-strip"></div>
      <div class="contact-bar">
        ${invoiceData.agencyPhone ? `<span>📞 ${invoiceData.agencyPhone}</span>` : ""}
        ${invoiceData.agencyEmail ? `<span>✉️ ${invoiceData.agencyEmail}</span>` : ""}
        ${invoiceData.agencyAddress ? `<span>📍 ${invoiceData.agencyAddress}</span>` : ""}
      </div>
      <div class="body">
        <div class="info-row">
          <div class="info-card">
            <h3>🧑 Client Information</h3>
            <p><strong>${invoiceData.clientName}</strong></p>
            ${invoiceData.clientPhone ? `<p>📞 ${invoiceData.clientPhone}</p>` : ""}
            ${invoiceData.clientAltPhone ? `<p>📞 ${invoiceData.clientAltPhone} (Alt)</p>` : ""}
            ${invoiceData.clientEmail ? `<p>✉️ ${invoiceData.clientEmail}</p>` : ""}
            ${invoiceData.clientAddress ? `<p>📍 ${invoiceData.clientAddress}</p>` : ""}
          </div>
          <div class="info-card">
            <h3>📄 Invoice Details</h3>
            <p><strong>Booking ID:</strong> #${invoiceData.bookingId}</p>
            <p><strong>Invoice No:</strong> ${invoiceData.invoiceNo}</p>
            <p><strong>Issue Date:</strong> ${invoiceData.invoiceDate}</p>
            ${invoiceData.departureDate ? `<p><strong>Departure:</strong> ${invoiceData.departureDate}</p>` : ""}
            ${invoiceData.arrivalDate ? `<p><strong>Return:</strong> ${invoiceData.arrivalDate}</p>` : ""}
            <p><strong>Status:</strong> ${buildStatusBadge(invoiceData.paymentStatus)}</p>
          </div>
        </div>
        <table>
          <thead><tr><th>Service Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
          <tbody><tr><td><strong>${invoiceData.serviceName}</strong></td><td>1</td><td>PKR ${invoiceData.servicePrice.toLocaleString()}</td><td><strong>PKR ${invoiceData.servicePrice.toLocaleString()}</strong></td></tr></tbody>
        </table>
        <div class="totals-block">
          <div class="totals-inner">
            <div class="tot-row"><span>Sub Total:</span><span>PKR ${invoiceData.subTotal.toLocaleString()}</span></div>
            ${invoiceData.discount > 0 ? `<div class="tot-row"><span>Discount:</span><span style="color:#dc2626">- PKR ${invoiceData.discount.toLocaleString()}</span></div>` : ""}
            <div class="tot-row"><span>TOTAL DUE:</span><span class="tv">PKR ${invoiceData.total.toLocaleString()}</span></div>
          </div>
        </div>
        <div class="payments">
          <div class="pay-cell"><div class="pc-label">Total Amount</div><div class="pc-val">PKR ${invoiceData.total.toLocaleString()}</div></div>
          <div class="pay-cell"><div class="pc-label">Amount Paid</div><div class="pc-val green">PKR ${invoiceData.paidAmount.toLocaleString()}</div></div>
          <div class="pay-cell"><div class="pc-label">Balance Due</div><div class="pc-val red">PKR ${invoiceData.remainingAmount.toLocaleString()}</div></div>
          <div class="pay-cell"><div class="pc-label">Status</div><div style="margin-top:4px">${buildStatusBadge(invoiceData.paymentStatus)}</div></div>
        </div>
        <div class="note ${invoiceData.remainingAmount > 0 ? "warn" : "ok"}">
          ${invoiceData.remainingAmount > 0 ? `⚠️ Please clear the remaining balance of <strong>PKR ${invoiceData.remainingAmount.toLocaleString()}</strong> before departure.` : `✅ <strong>Fully Paid</strong> — Thank you for choosing ${invoiceData.agencyName}!`}
        </div>
      </div>
      <div class="footer">
        <span>Thank you for your business — <strong>${invoiceData.agencyName}</strong></span>
        <span>Generated: ${new Date().toLocaleDateString("en-PK",{day:"numeric",month:"short",year:"numeric"})}</span>
      </div>
    </div></body></html>`;

  const printInvoice = (booking) => {
    setPrintingBooking(booking);
    const invoiceData = generateInvoiceData(booking);

    // Attach logo URL from agency state
    invoiceData.agencyLogoUrl = agency?.logo_url || null;

    const template = agency?.invoice_template || "classic";
    let invoiceHTML;
    switch (template) {
      case "gold_voucher":   invoiceHTML = buildGoldVoucherTemplate(invoiceData); break;
      case "dark_pro":       invoiceHTML = buildDarkProTemplate(invoiceData);     break;
      case "minimal":        invoiceHTML = buildMinimalTemplate(invoiceData);     break;
      case "corporate":      invoiceHTML = buildCorporateTemplate(invoiceData);   break;
      default:               invoiceHTML = buildClassicTemplate(invoiceData);     break;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    toast.success("Invoice opened — use buttons to print or share on WhatsApp.");
  };

  const buildBookingPayload = () => {
    const payload = { ...formData };

    payload.discount = payload.discount === "" ? "0.00" : payload.discount;
    payload.paid_amount =
      payload.paid_amount === "" ? "0.00" : payload.paid_amount;
    payload.arrival_date = payload.arrival_date || null;
    payload.departure_date = payload.departure_date || null;
    payload.payment_method = payload.payment_method?.trim() || null;

    return payload;
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.client) {
      errors.client = "Please select a client";
    }

    if (!formData.service) {
      errors.service = "Please select a service";
    }

    const maxDiscount = getMaxDiscount();
    if (parseFloat(formData.discount) > parseFloat(maxDiscount)) {
      errors.discount = `Discount cannot exceed ${formatPKR(maxDiscount)}`;
    }

    if (formData.arrival_date && formData.departure_date) {
      const departure = new Date(formData.departure_date);
      const arrival = new Date(formData.arrival_date);
      
      const departureDate = new Date(departure.getFullYear(), departure.getMonth(), departure.getDate());
      const arrivalDate = new Date(arrival.getFullYear(), arrival.getMonth(), arrival.getDate());
      
      if (arrivalDate < departureDate) {
        errors.arrival_date = "Return date cannot be before travel date";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setSubmitting(true);
    try {
      const payload = buildBookingPayload();

      if (editingBooking) {
        await bookingsAPI.updateBooking(editingBooking.id, payload);
        toast.success("Booking updated successfully");
      } else {
        await bookingsAPI.createBooking(payload);
        toast.success("Booking created successfully");
      }

      setShowModal(false);
      resetForm();
      fetchInitialData();
    } catch (error) {
      console.error("Error saving booking:", error);
      const errorMsg = error.response?.data?.detail || "Failed to save booking";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentUpdate = async (e) => {
    e.preventDefault();

    setPaymentSubmitting(true);
    try {
      const payload = {
        ...paymentData,
        paid_amount: paymentData.paid_amount || "0.00",
        payment_method: paymentData.payment_method?.trim() || null,
        notes:
          typeof paymentData.notes === "string"
            ? paymentData.notes.trim()
            : paymentData.notes || null,
      };

      await bookingsAPI.updatePayment(paymentBooking.id, payload);
      toast.success("Payment updated successfully");

      setShowPaymentModal(false);
      setPaymentBooking(null);
      setPaymentData({ paid_amount: "", payment_method: "", notes: "" });
      fetchInitialData();
    } catch (error) {
      console.error("Error updating payment:", error);
      const errorMsg =
        error.response?.data?.detail || "Failed to update payment";
      toast.error(errorMsg);
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (booking) => {
    setEditingBooking(booking);
    setFormData({
      client: booking.client,
      service: booking.service,
      discount: booking.discount,
      booking_status: booking.booking_status,
      paid_amount: booking.paid_amount,
      payment_method: booking.payment_method || "",
      arrival_date: booking.arrival_date || "",
      departure_date: booking.departure_date || "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openPaymentModal = (booking) => {
    setPaymentBooking(booking);
    setPaymentData({
      paid_amount: booking.paid_amount,
      payment_method: booking.payment_method || "",
      notes: "",
    });
    setShowPaymentModal(true);
  };

  const resetForm = () => {
    setFormData({
      client: "",
      service: "",
      discount: "0",
      booking_status: "pending",
      paid_amount: "0",
      payment_method: "",
      arrival_date: "",
      departure_date: "",
    });
    setFormErrors({});
    setEditingBooking(null);
    setSubmitting(false);
    setClientSearch("");
    setServiceSearch("");
    setShowClientDropdown(false);
    setShowServiceDropdown(false);
  };

  const getMaxDiscount = () => {
    if (!formData.service) return 0;
    const selectedService = services.find(
      (s) => s.id === parseInt(formData.service),
    );
    if (!selectedService) return 0;
    return (parseFloat(selectedService.service_profit) * 0.5).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 animate-in fade-in-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 animate-in slide-in-from-left-4 duration-500">
            Bookings Management
          </h1>
          <p className="text-gray-600 mt-2 animate-in slide-in-from-left-4 duration-700">
            Manage client bookings and payments
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            onClick={() => {
              setMissingOnly((prev) => !prev);
              if (!missingOnly) {
                setSearchLoading(true);
              }
            }}
            className={`flex items-center px-4 py-2.5 rounded-xl border transition-all duration-200 ${
              missingOnly
                ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 shadow-sm"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            {missingOnly ? "Showing Missing Dates" : "Filter Missing Dates"}
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Booking
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 animate-in fade-in-50 duration-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">
                Total Bookings
              </p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {bookings.length}
              </p>
            </div>
            <Briefcase className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 animate-in fade-in-50 duration-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Confirmed</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {
                  bookings.filter((b) => b.booking_status === "confirmed")
                    .length
                }
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4 animate-in fade-in-50 duration-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700">Pending</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">
                {bookings.filter((b) => b.booking_status === "pending").length}
              </p>
            </div>
            <Clock className="w-10 h-10 text-amber-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4 animate-in fade-in-50 duration-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Missing Dates</p>
              <p className="text-2xl font-bold text-red-900 mt-1">
                {datesSummary.missing_any}
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-red-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Search Section - Two Search Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in fade-in-50 duration-500">
        {/* General Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by Client Name, Phone, Service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="w-full pl-12 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleSearchClick}
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
          <p className="mt-2 text-sm text-gray-500">
            Press Enter or click Search button to search
          </p>
        </div>

        {/* Booking ID Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={bookingIdInputRef}
              type="text"
              placeholder="Search by Booking ID (e.g., 123)"
              value={bookingIdSearch}
              onChange={(e) => setBookingIdSearch(e.target.value)}
              onKeyPress={handleBookingIdKeyPress}
              className="w-full pl-12 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              {bookingIdSearch && (
                <button
                  onClick={() => setBookingIdSearch("")}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleBookingIdSearchClick}
                disabled={searchLoading}
                className="flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {searchLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Hash className="w-4 h-4 mr-1" />
                    Find Booking
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Press Enter or click Find button to search
          </p>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || bookingIdQuery || missingOnly) && (
        <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-800">
                Active Filters:
              </span>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    <Search className="w-3 h-3 mr-1" />
                    Search: "{searchQuery}"
                    <button
                      onClick={handleClearSearch}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {bookingIdQuery && (
                  <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    <Hash className="w-3 h-3 mr-1" />
                    Booking ID: {bookingIdQuery}
                    <button
                      onClick={handleClearBookingIdSearch}
                      className="ml-2 text-purple-500 hover:text-purple-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {missingOnly && (
                  <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    <Filter className="w-3 h-3 mr-1" />
                    Missing Dates Only
                    <button
                      onClick={() => setMissingOnly(false)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleClearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All Filters
            </button>
          </div>
          <p className="mt-2 text-sm text-blue-600">
            Showing {bookings.length} booking(s)
          </p>
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in-50 duration-700">
        {searchLoading ? (
          <div className="p-12 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 font-medium">Searching bookings...</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr className="animate-in fade-in-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50/50 transition-colors duration-150 animate-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <Briefcase className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              #{booking.id} •{" "}
                              {booking.service_details?.service_name || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Created: {formatDate(booking.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-3">
                          {booking.client_details?.name?.charAt(0) || "C"}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.client_details?.name || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.client_details?.phone_number || ""}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatPKR(booking.total_amount)}
                        </div>
                        <div className="flex items-center text-xs">
                          <span className="text-green-600 font-medium">
                            Paid: {formatPKR(booking.paid_amount)}
                          </span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-red-600 font-medium">
                            Due: {formatPKR(booking.remaining_amount)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            booking.booking_status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.booking_status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.booking_status === "confirmed" && (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {booking.booking_status === "pending" && (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {booking.booking_status === "rejected" && (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {booking.booking_status_display}
                        </span>

                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            booking.payment_status === "PAID"
                              ? "bg-green-100 text-green-800"
                              : booking.payment_status === "HALF_PAID"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.payment_status_display}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs">
                          <Calendar className="w-3 h-3 mr-2 text-gray-400" />
                          {booking.arrival_date
                            ? formatDate(booking.arrival_date)
                            : "Not set"}
                        </div>
                        <div className="flex items-center text-xs">
                          <Calendar className="w-3 h-3 mr-2 text-gray-400" />
                          {booking.departure_date
                            ? formatDate(booking.departure_date)
                            : "Not set"}
                        </div>
                        {!booking.arrival_date || !booking.departure_date ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Missing
                          </span>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(booking)}
                          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openPaymentModal(booking)}
                          className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                          title="Update Payment"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => printInvoice(booking)}
                          className="p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                          title="Print Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openViewModal(booking)}
                          className="p-1.5 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || bookingIdQuery || missingOnly
                ? "No bookings found"
                : "No bookings yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? `No bookings found for "${searchQuery}". Try a different search term.`
                : bookingIdQuery
                  ? `No booking found with ID "${bookingIdQuery}". Please check the ID.`
                  : missingOnly
                    ? "No bookings with missing dates found"
                    : "Create your first booking to get started"}
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5 mr-2" />
              {searchQuery || bookingIdQuery || missingOnly
                ? "Create New Booking"
                : "Create First Booking"}
            </button>
            {(searchQuery || bookingIdQuery || missingOnly) && (
              <button
                onClick={handleClearAllFilters}
                className="ml-3 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-in fade-in duration-200"></div>

          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {editingBooking ? (
                      <Edit className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Plus className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {editingBooking ? "Edit Booking" : "Create New Booking"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {editingBooking
                        ? "Update booking details"
                        : "Create a new booking for a client"}
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

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Client and Service with Searchable Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Dropdown with Search */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client *
                    </label>
                    
                    <div className="relative">
                      <div 
                        className={`flex items-center justify-between w-full px-4 py-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                          formErrors.client ? "border-red-300" : "border-gray-300"
                        } ${showClientDropdown ? "ring-2 ring-blue-500 border-blue-500" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowClientDropdown(!showClientDropdown);
                          setShowServiceDropdown(false);
                        }}
                      >
                        <div className="flex-1 truncate">
                          {formData.client ? (
                            clients.find(c => c.id === parseInt(formData.client))?.name || "Select Client"
                          ) : (
                            <span className="text-gray-400">Select Client</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-2">
                          <Search className="w-4 h-4 text-gray-400" />
                          <svg 
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showClientDropdown ? "rotate-180" : ""}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      
                      {showClientDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                          onClick={(e) => e.stopPropagation()}>
                          {/* Search Input */}
                          <div className="sticky top-0 bg-white p-2 border-b">
                            <div className="relative">
                              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                value={clientSearch}
                                onChange={(e) => setClientSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                placeholder="Search client by name or phone..."
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                autoFocus
                              />
                            </div>
                          </div>
                          
                          {/* Clients List */}
                          <div className="py-1">
                            {filteredClients.length > 0 ? (
                              filteredClients.map((client) => (
                                <div
                                  key={client.id}
                                  className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                                    formData.client === client.id.toString() ? "bg-blue-50 text-blue-700" : ""
                                  }`}
                                  onClick={() => {
                                    setFormData({ ...formData, client: client.id.toString() });
                                    setShowClientDropdown(false);
                                    setClientSearch("");
                                    if (formErrors.client) {
                                      setFormErrors({ ...formErrors, client: "" });
                                    }
                                  }}
                                >
                                  <div className="font-medium">{client.name}</div>
                                  <div className="text-sm text-gray-500">{client.phone_number}</div>
                                  {client.email && (
                                    <div className="text-xs text-gray-400 truncate">{client.email}</div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-center text-gray-500">
                                No clients found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {formErrors.client && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {formErrors.client}
                      </p>
                    )}
                  </div>

                  {/* Service Dropdown with Search */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service *
                    </label>
                    
                    <div className="relative">
                      <div 
                        className={`flex items-center justify-between w-full px-4 py-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                          formErrors.service ? "border-red-300" : "border-gray-300"
                        } ${showServiceDropdown ? "ring-2 ring-blue-500 border-blue-500" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowServiceDropdown(!showServiceDropdown);
                          setShowClientDropdown(false);
                        }}
                      >
                        <div className="flex-1 truncate">
                          {formData.service ? (
                            <div className="flex justify-between items-center">
                              <span>{services.find(s => s.id === parseInt(formData.service))?.service_name || "Select Service"}</span>
                              <span className="text-sm font-semibold text-blue-600 ml-2">
                                {services.find(s => s.id === parseInt(formData.service)) && 
                                  formatPKR(services.find(s => s.id === parseInt(formData.service)).service_total_price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">Select Service</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-2">
                          <Search className="w-4 h-4 text-gray-400" />
                          <svg 
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showServiceDropdown ? "rotate-180" : ""}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      
                      {showServiceDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                          onClick={(e) => e.stopPropagation()}>
                          {/* Search Input */}
                          <div className="sticky top-0 bg-white p-2 border-b">
                            <div className="relative">
                              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                value={serviceSearch}
                                onChange={(e) => setServiceSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                placeholder="Search service by name..."
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                autoFocus
                              />
                            </div>
                          </div>
                          
                          {/* Services List */}
                          <div className="py-1">
                            {filteredServices.length > 0 ? (
                              filteredServices.map((service) => (
                                <div
                                  key={service.id}
                                  className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                                    formData.service === service.id.toString() ? "bg-blue-50 text-blue-700" : ""
                                  }`}
                                  onClick={() => {
                                    setFormData({ ...formData, service: service.id.toString() });
                                    setShowServiceDropdown(false);
                                    setServiceSearch("");
                                    if (formErrors.service) {
                                      setFormErrors({ ...formErrors, service: "" });
                                    }
                                  }}
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="font-medium">{service.service_name}</div>
                                    <div className="font-semibold text-blue-600">
                                      {formatPKR(service.service_total_price)}
                                    </div>
                                  </div>
                                  {service.description && (
                                    <div className="text-xs text-gray-500 mt-1 truncate">
                                      {service.description}
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-center text-gray-500">
                                No services found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {formErrors.service && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {formErrors.service}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount (PKR)
                      <span className="text-xs text-gray-500 ml-2">
                        Max: {formatPKR(getMaxDiscount())}
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">
                        ₨
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.discount}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            discount: e.target.value,
                          });
                          if (formErrors.discount)
                            setFormErrors({ ...formErrors, discount: "" });
                        }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          formErrors.discount
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {formErrors.discount && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {formErrors.discount}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking Status *
                    </label>
                    <select
                      value={formData.booking_status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          booking_status: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Initial Payment (PKR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">
                        ₨
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.paid_amount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paid_amount: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <input
                      type="text"
                      value={formData.payment_method}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_method: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="e.g., Cash, Card, Bank Transfer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Travel Date (Departure) *
                    </label>
                    <input
                      type="date"
                      value={formData.departure_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          departure_date: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Return Date (Arrival) *
                    </label>
                    <input
                      type="date"
                      value={formData.arrival_date}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          arrival_date: e.target.value,
                        });
                        if (formErrors.arrival_date)
                          setFormErrors({ ...formErrors, arrival_date: "" });
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        formErrors.arrival_date
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.arrival_date && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {formErrors.arrival_date}
                      </p>
                    )}
                  </div>
                </div>

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
                        {editingBooking ? "Update Booking" : "Create Booking"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Booking Details Modal */}
      {showViewModal && viewingBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-in fade-in duration-200"></div>

          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Booking Details
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Booking #{viewingBooking.id} • View Only
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => printInvoice(viewingBooking)}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    title="Print Invoice"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Invoice
                  </button>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Header Info */}
                <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-blue-900">
                        {viewingBooking.service_details?.service_name || "Service"}
                      </h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Created on {formatDateTime(viewingBooking.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(viewingBooking.booking_status)}`}>
                        {getStatusIcon(viewingBooking.booking_status)}
                        {viewingBooking.booking_status_display}
                      </span>
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(viewingBooking.payment_status)}`}>
                        {getStatusIcon(viewingBooking.payment_status)}
                        {viewingBooking.payment_status_display}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Client Details */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Client Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Client Name</p>
                          <p className="text-base font-semibold text-gray-900">
                            {viewingBooking.client_details?.name || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Phone Number</p>
                          <p className="text-base font-semibold text-gray-900">
                            {viewingBooking.client_details?.phone_number || "N/A"}
                          </p>
                        </div>
                      </div>
                      {viewingBooking.client_details?.email && (
                        <div className="flex items-start">
                          <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Email Address</p>
                            <p className="text-base font-semibold text-gray-900">
                              {viewingBooking.client_details.email}
                            </p>
                          </div>
                        </div>
                      )}
                      {viewingBooking.client_details?.address && (
                        <div className="flex items-start">
                          <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Address</p>
                            <p className="text-base font-semibold text-gray-900">
                              {viewingBooking.client_details.address}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                      Service Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Service Name</p>
                        <p className="text-lg font-bold text-gray-900">
                          {viewingBooking.service_details?.service_name || "N/A"}
                        </p>
                        {viewingBooking.service_details?.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {viewingBooking.service_details.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dates Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-amber-600" />
                      Travel Dates
                    </h3>
                    <div className="space-y-4">
                      <div className={`p-4 rounded-lg ${!viewingBooking.departure_date ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Departure Date</p>
                            <p className={`text-lg font-bold ${!viewingBooking.departure_date ? 'text-red-700' : 'text-blue-900'}`}>
                              {viewingBooking.departure_date ? formatDate(viewingBooking.departure_date) : "Not Set"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`p-4 rounded-lg ${!viewingBooking.arrival_date ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-green-600 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Arrival Date</p>
                            <p className={`text-lg font-bold ${!viewingBooking.arrival_date ? 'text-red-700' : 'text-green-900'}`}>
                              {viewingBooking.arrival_date ? formatDate(viewingBooking.arrival_date) : "Not Set"}
                            </p>
                          </div>
                        </div>
                      </div>
                      {(!viewingBooking.departure_date || !viewingBooking.arrival_date) && (
                        <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          <span>Missing travel dates. Please update the booking.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                      Financial Details
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Total Amount</p>
                          <p className="text-xl font-bold text-gray-900">
                            {formatPKR(viewingBooking.total_amount)}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Discount</p>
                          <p className="text-lg font-bold text-red-600">
                            -{formatPKR(viewingBooking.discount)}
                          </p>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Net Amount</p>
                            <p className="text-2xl font-bold text-blue-900">
                              {formatPKR(viewingBooking.total_amount - viewingBooking.discount)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-700">Payment Status</p>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewingBooking.payment_status)}`}>
                              {viewingBooking.payment_status_display}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Amount Paid</span>
                          <span className="text-lg font-bold text-green-700">
                            {formatPKR(viewingBooking.paid_amount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Remaining Due</span>
                          <span className="text-lg font-bold text-red-700">
                            {formatPKR(viewingBooking.remaining_amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Payment Method</p>
                      <p className="text-base font-semibold text-gray-900">
                        {viewingBooking.payment_method || "Not Specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Last Updated</p>
                      <p className="text-base font-semibold text-gray-900">
                        {viewingBooking.updated_at ? formatDateTime(viewingBooking.updated_at) : "N/A"}
                      </p>
                    </div>
                  </div>
                 
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => openEditModal(viewingBooking)}
                    className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Booking
                  </button>
                  <button
                    onClick={() => {
                      openPaymentModal(viewingBooking);
                      setShowViewModal(false);
                    }}
                    className="flex items-center px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Update Payment
                  </button>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && paymentBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-in fade-in duration-200"></div>

          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Update Payment
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Booking #{paymentBooking.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentBooking(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handlePaymentUpdate} className="p-6 space-y-6">
                <div className="bg-gray-50/50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatPKR(paymentBooking.total_amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Already Paid:</span>
                    <span className="text-lg font-medium text-green-600">
                      {formatPKR(paymentBooking.paid_amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                    <span className="text-sm font-medium text-gray-700">
                      Remaining:
                    </span>
                    <span className="text-lg font-bold text-red-600">
                      {formatPKR(paymentBooking.remaining_amount)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to Add (PKR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">
                      ₨
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={paymentData.paid_amount}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          paid_amount: e.target.value,
                        })
                      }
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={paymentData.payment_method}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        payment_method: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="">Select Method</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="EasyPaisa">EasyPaisa</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentBooking(null);
                    }}
                    disabled={paymentSubmitting}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={paymentSubmitting}
                    className="flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {paymentSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Payment
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

export default Bookings;