import { useState, useEffect } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

function AddAppointmentModal({ isOpen, onClose, refreshAppointments }) {

  const [form, setForm] = useState({
    patient_id: "",
    dentist_id: "",
    start_time: "",
    end_time: ""
  });

  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchPatients();
      fetchDentists();
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

  const fetchDentists = async () => {
    try {
      const res = await API.get("/v1/users");
      setDentists(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch dentists", error);
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

    if (!form.patient_id || !form.dentist_id || !form.start_time || !form.end_time) {
      toast.error("All fields are required");
      return;
    }

    try {
      await API.post("/v1/appointments", form);

      toast.success("Appointment created successfully");

      refreshAppointments();
      onClose();

      setForm({
        patient_id: "",
        dentist_id: "",
        start_time: "",
        end_time: ""
      });

    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to create appointment");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-black rounded-xl p-6 w-96 shadow-xl">
        <h2 className="text-lg font-semibold mb-4 text-violet-600">Add Appointment</h2>

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
            name="dentist_id"
            className="w-full border rounded-lg px-3 py-2 text-violet-600"
            value={form.dentist_id}
            onChange={handleChange}
          >
            <option value="">Select Dentist</option>
            {dentists.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <input
            name="start_time"
            type="datetime-local"
            className="w-full border rounded-lg px-3 py-2 text-violet-600"
            value={form.start_time}
            onChange={handleChange}
          />

          <input
            name="end_time"
            type="datetime-local"
            className="w-full border rounded-lg px-3 py-2 text-violet-600"
            value={form.end_time}
            onChange={handleChange}
          />

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

export default AddAppointmentModal;