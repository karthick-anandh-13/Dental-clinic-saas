import { useState, useEffect } from "react";
import API from "../../api/axios";
import AddInvoiceModal from "../../components/invoices/AddInvoiceModal";
import InvoicePreviewModal from "../../components/invoices/InvoicePreviewModal";
import toast from "react-hot-toast";

function InvoicesPage() {

  const [invoices, setInvoices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH INVOICES
  ========================= */
  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const res = await API.get("/v1/invoices");

      setInvoices(res.data || []);

    } catch (error) {
      console.error("Failed to fetch invoices", error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    fetchInvoices();
  }, []);

  /* =========================
     PREVIEW INVOICE
  ========================= */
  const previewInvoicePDF = (invoice) => {
    setPreviewInvoice(invoice);
    setPreviewOpen(true);
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-violet-600">Invoices</h1>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add Invoice
        </button>
      </div>

      {/* MODALS */}
      <AddInvoiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        refreshInvoices={fetchInvoices}
      />

      <InvoicePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        invoiceData={previewInvoice}
      />

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-600">
              <th className="p-4">Patient</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Payment Method</th>
              <th className="p-4">Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No invoices found
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-violet-600">{inv.patient_name}</td>
                  <td className="p-4 text-violet-600">${parseFloat(inv.amount).toFixed(2)}</td>
                  <td className="p-4 text-violet-600">{inv.payment_method}</td>
                  <td className="p-4 text-violet-600">
                    {new Date(inv.created_at).toLocaleDateString()}
                  </td>

                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => previewInvoicePDF(inv)}
                      className="text-blue-500 hover:underline"
                    >
                      View & Download
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InvoicesPage;