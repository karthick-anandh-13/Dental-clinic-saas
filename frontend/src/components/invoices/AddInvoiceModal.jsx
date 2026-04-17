import { useState, useEffect } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

function AddInvoiceModal({ isOpen, onClose, refreshInvoices }) {

  const [form, setForm] = useState({
    patient_id: "",
    treatment_id: "",
    amount: "",
    payment_method: "cash"
  });

  const [patients, setPatients] = useState([]);
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchPatients();
      fetchTreatments();
    }
  }, [isOpen]);

  const fetchPatients = async () => {
    try {
      const res = await API.get("/v1/patients?page=1&limit=100");
      setPatients(res.data.data.results || []);
    } catch (error) {
      console.error("Failed to fetch patients", error);
    }
  };

  const fetchTreatments = async () => {
    try {
      const res = await API.get("/v1/treatments");
      setTreatments(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch treatments", error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.patient_id || !form.treatment_id || !form.amount) {
      toast.error("All fields are required");
      return;
    }

    try {
      await API.post("/v1/invoices", form);

      toast.success("Invoice created successfully");

      refreshInvoices();
      onClose();

      setForm({
        patient_id: "",
        treatment_id: "",
        amount: "",
        payment_method: "cash"
      });

    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to create invoice");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-black rounded-xl p-6 w-96 shadow-xl">
        <h2 className="text-lg font-semibold mb-4 text-violet-600">Add Invoice</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            name="patient_id"
            className="w-full border rounded-lg px-3 py-2 text-violet-600"
            value={form.patient_id}
            onChange={handleChange}
          >
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            name="treatment_id"
            className="w-full border rounded-lg px-3 py-2 text-violet-600"
            value={form.treatment_id}
            onChange={handleChange}
          >
            <option value="">Select Treatment</option>
            {treatments.map((t) => (
              <option key={t.id} value={t.id}>{t.treatment_type} - ${t.cost}</option>
            ))}
          </select>

          <input
            name="amount"
            type="number"
            step="0.01"
            placeholder="Amount"
            className="w-full border rounded-lg px-3 py-2 text-violet-600"
            value={form.amount}
            onChange={handleChange}
          />

          <select
            name="payment_method"
            className="w-full border rounded-lg px-3 py-2 text-violet-600"
            value={form.payment_method}
            onChange={handleChange}
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="insurance">Insurance</option>
          </select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddInvoiceModal;