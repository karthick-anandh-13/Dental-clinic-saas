import { useState, useEffect } from "react";
import API from "../../api/axios";
import AddAppointmentModal from "../../components/appointments/AddAppointmentModal";
import toast from "react-hot-toast";
import { useLanguage } from "../../context/LanguageContext";

function AppointmentsPage() {
  const { t } = useLanguage();

  const [appointments, setAppointments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH APPOINTMENTS
  ========================= */
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await API.get("/v1/appointments");

      setAppointments(res.data || []);

    } catch (error) {
      console.error("Failed to fetch appointments", error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    fetchAppointments();
  }, []);

  /* =========================
     DELETE APPOINTMENT
  ========================= */
  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;

    try {
      await API.delete(`/v1/appointments/${id}`);
      toast.success("Appointment deleted");
      fetchAppointments();
    } catch (error) {
      toast.error("Delete failed");
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-violet-600">{t("appointmentsTitle")}</h1>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {t("addAppointment")}
        </button>
      </div>

      {/* MODAL */}
      <AddAppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        refreshAppointments={fetchAppointments}
      />

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-600">
              <th className="p-4">Patient</th>
              <th className="p-4">Dentist</th>
              <th className="p-4">Start Time</th>
              <th className="p-4">End Time</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  {t("loading")}
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  {t("noAppointmentsFound")}
                </td>
              </tr>
            ) : (
              appointments.map((a) => (
                <tr
                  key={a.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4 text-violet-600">{a.patient_name}</td>
                  <td className="p-4 text-violet-600">{a.dentist_name}</td>
                  <td className="p-4 text-violet-600">{new Date(a.start_time).toLocaleString()}</td>
                  <td className="p-4 text-violet-600">{new Date(a.end_time).toLocaleString()}</td>

                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => deleteAppointment(a.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
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

export default AppointmentsPage;