import API from "../../api/axios";
import toast from "react-hot-toast";

function InvoicePreviewModal({ isOpen, onClose, invoiceData }) {

  const handleGeneratePDF = async () => {
    try {
      const response = await API.get(`/v1/invoices/${invoiceData.id}/download`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceData.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("PDF downloaded successfully");
      onClose();

    } catch (error) {
      console.error("Failed to download PDF", error);
      toast.error("Failed to download PDF");
    }
  };

  if (!isOpen || !invoiceData) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 text-violet-600">Invoice Preview</h2>

        <div className="border-2 border-gray-300 p-6 rounded-lg mb-6 bg-gray-50">
          {/* Invoice Header */}
          <div className="text-center mb-8 pb-4 border-b-2">
            <h1 className="text-3xl font-bold text-violet-600">INVOICE</h1>
            <p className="text-gray-600 mt-2">SmileCare Dental Clinic</p>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-sm text-gray-600">Invoice Number</p>
              <p className="text-lg font-semibold text-violet-600">INV-{invoiceData.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="text-lg font-semibold text-violet-600">
                {new Date(invoiceData.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Patient Info */}
          <div className="mb-8 pb-4 border-b-2">
            <p className="text-sm text-gray-600 mb-2">Bill To:</p>
            <p className="text-lg font-semibold text-violet-600">{invoiceData.patient_name}</p>
          </div>

          {/* Items Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2 text-violet-600">Description</th>
                <th className="text-right py-2 text-violet-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-gray-700">Treatment Services</td>
                <td className="text-right py-3 text-gray-700">${parseFloat(invoiceData.amount).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          {/* Total */}
          <div className="flex justify-end mb-8">
            <div className="w-48">
              <div className="flex justify-between py-2 border-t-2 border-b-2 mb-3">
                <span className="font-semibold text-violet-600">Total:</span>
                <span className="font-bold text-lg text-violet-600">${parseFloat(invoiceData.amount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-8 pb-4 border-b">
            <p className="text-sm text-gray-600">Payment Method: <span className="font-semibold text-violet-600">{invoiceData.payment_method.toUpperCase()}</span></p>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500">
            <p>Thank you for your business!</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleGeneratePDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvoicePreviewModal;