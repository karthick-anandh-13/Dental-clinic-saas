import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/axios";

function PatientProfilePage() {

  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("overview");
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [timeline, setTimeline] = useState([]);

  /* =========================
     FETCH FUNCTIONS
  ========================= */

  const fetchPatient = async () => {
    try {
      const res = await API.get(`/v1/patients/${id}`);
      setPatient(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await API.get(`/v1/appointments?patient_id=${id}`);
      setAppointments(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTreatments = async () => {
    try {
      const res = await API.get(`/v1/treatments?patient_id=${id}`);
      setTreatments(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await API.get(`/v1/invoices?patient_id=${id}`);
      setInvoices(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await API.get(`/v1/files/${id}`);
      setFiles(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     FILE UPLOAD
  ========================= */

  const handleUpload = async () => {
    try {
      if (!selectedFile) return;

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("patient_id", id);

      await API.post("/v1/files/upload", formData);

      setSelectedFile(null);
      fetchFiles();

    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     TIMELINE BUILDER
  ========================= */

  const buildTimeline = () => {

    let events = [];

    appointments.forEach((a) => {
      events.push({
        type: "appointment",
        date: a.start_time,
        data: a
      });
    });

    treatments.forEach((t) => {
      events.push({
        type: "treatment",
        date: t.created_at,
        data: t
      });
    });

    invoices.forEach((i) => {
      events.push({
        type: "invoice",
        date: i.created_at,
        data: i
      });
    });

    events.sort((a, b) => new Date(b.date) - new Date(a.date));

    setTimeline(events);
  };

  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {
    fetchPatient();
    fetchAppointments();
    fetchTreatments();
    fetchInvoices();
    fetchFiles();
  }, [id]);

  /* =========================
     BUILD TIMELINE AFTER DATA
  ========================= */

  useEffect(() => {
    buildTimeline();
  }, [appointments, treatments, invoices]);

  /* =========================
     LOADING
  ========================= */

  if (!patient) return <div className="p-6">Loading...</div>;

  return (

    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-semibold">{patient.name}</h1>
        <p className="text-gray-500">{patient.phone}</p>
        <p className="text-gray-500">{patient.address}</p>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b pb-2">
        {["overview", "timeline", "appointments", "treatments", "invoices", "files"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize pb-2 ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="mt-6">

        {/* TIMELINE */}
        {activeTab === "timeline" && (
          <div className="space-y-4">
            {timeline.length === 0 ? (
              <p className="text-gray-500">No activity found</p>
            ) : (
              timeline.map((event, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border shadow-sm">
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(event.date).toLocaleString()}
                  </p>

                  {event.type === "appointment" && (
                    <p>🗓 Appointment with Dr. {event.data.dentist_name}</p>
                  )}

                  {event.type === "treatment" && (
                    <p>🦷 Treatment: {event.data.treatment_type}</p>
                  )}

                  {event.type === "invoice" && (
                    <p>💰 Invoice: ₹{event.data.amount}</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </div>

    </div>
  );
}

export default PatientProfilePage;