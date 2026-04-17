import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

function PatientHistoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [id]);

  const fetchHistory = async () => {
    try {
      setLoading(true);

      // Fetch patient details
      const patientRes = await API.get(`/v1/patients/${id}`);
      setPatient(patientRes.data.data);

      // Fetch appointments for this patient
      const apptRes = await API.get(`/v1/appointments?patient_id=${id}`);
      setAppointments(apptRes.data);

      // Fetch invoices for this patient
      const invRes = await API.get(`/v1/invoices?patient_id=${id}`);
      setInvoices(invRes.data);

    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPaid = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
  const totalTreatmentCost = invoices.reduce((sum, inv) => sum + parseFloat(inv.treatment_cost || 0), 0);
  const totalOwed = Math.max(0, totalTreatmentCost - totalPaid);

  if (loading) return <div className="p-6 text-violet-600">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-violet-600">
          History for {patient?.name}
        </h1>
        <button
          onClick={() => navigate("/patients")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Back to Patients
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-violet-600">Total Visits</h3>
          <p className="text-2xl text-violet-600">{appointments.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-violet-600">Total Paid</h3>
          <p className="text-2xl text-violet-600">${totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-violet-600">Outstanding</h3>
          <p className="text-2xl text-violet-600">${totalOwed.toFixed(2)}</p>
        </div>
      </div>

      {/* Appointments History */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-violet-600">Appointment History</h2>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="p-4">Date</th>
                <th className="p-4">Dentist</th>
                <th className="p-4">Start Time</th>
                <th className="p-4">End Time</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-500">
                    No appointments found
                  </td>
                </tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 text-violet-600">
                      {new Date(a.start_time).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-violet-600">{a.dentist_name}</td>
                    <td className="p-4 text-violet-600">
                      {new Date(a.start_time).toLocaleTimeString()}
                    </td>
                    <td className="p-4 text-violet-600">
                      {new Date(a.end_time).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-violet-600">Payment History</h2>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-6 text-gray-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 text-violet-600">
                      {new Date(inv.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-violet-600">${parseFloat(inv.amount).toFixed(2)}</td>
                    <td className="p-4 text-violet-600">{inv.payment_method}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PatientHistoryPage;