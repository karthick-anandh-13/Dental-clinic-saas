import { useState, useEffect } from "react";
import API from "../../api/axios";
import AddPatientModal from "../../components/patients/AddPatientModal";
import EditPatientModal from "../../components/patients/EditPatientModal";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useLanguage } from "../../context/LanguageContext";

function PatientsPage() {
  const { t } = useLanguage();

  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const limit = 10;

  /* =========================
     FETCH PATIENTS
  ========================= */
  const fetchPatients = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/v1/patients?page=${page}&limit=${limit}&search=${debouncedSearch}`
      );

      const data = res.data.results || res.data;

      setPatients(res.data.data.results || []);

    } catch (error) {
      console.error("Failed to fetch patients", error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     REFRESH PATIENTS (reset to page 1)
  ========================= */
  const refreshPatients = () => {
    setPage(1);
    fetchPatients();
  };

  /* =========================
     SEARCH DEBOUNCE
  ========================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    fetchPatients();
  }, [debouncedSearch, page]);

  /* =========================
     DELETE PATIENT
  ========================= */
  const deletePatient = async (id) => {
    if (!window.confirm("Delete this patient?")) return;

    try {
      await API.delete(`/v1/patients/${id}`);
      toast.success("Patient deleted");
      fetchPatients();
    } catch (error) {
      toast.error("Delete failed");
      console.error(error);
    }
  };

  return (

    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{t("patientsTitle")}</h1>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {t("addPatient")}
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder={t("searchPatients")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-64"
        />
      </div>

      {/* MODALS */}
      <AddPatientModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        refreshPatients={fetchPatients}
      />

      <EditPatientModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        patient={selectedPatient}
        refreshPatients={fetchPatients}
      />

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-600">
              <th className="p-4">{t("patientsColumnName")}</th>
              <th className="p-4">{t("patientsColumnPhone")}</th>
              <th className="p-4">{t("patientsColumnAge")}</th>
              <th className="p-4">{t("patientsColumnAddress")}</th>
              <th className="p-4">{t("patientsActions")}</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  {t("loading")}
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  {t("noPatientsFound")}
                </td>
              </tr>
            ) : (
              patients.map((p) => (

                <tr
                  key={p.id}
                  onClick={() => navigate(`/patients/${p.id}`)}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                >

                  <td className="p-4 text-violet-600">{p.name}</td>
                  <td className="p-4 text-violet-600">{p.phone}</td>
                  <td className="p-4 text-violet-600">{p.age}</td>
                  <td className="p-4 text-violet-600">{p.address}</td>

                  <td className="p-4 flex gap-3">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/patients/${p.id}/history`);
                      }}
                      className="text-green-500 hover:underline"
                    >
                      {t("patientHistoryButton")}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPatient(p);
                        setEditOpen(true);
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      {t("patientEditButton")}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePatient(p.id);
                      }}
                      className="text-red-500 hover:underline"
                    >
                      {t("patientDeleteButton")}
                    </button>

                  </td>

                </tr>

              ))
            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}
      <div className="flex justify-end gap-3 mt-4">

        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded"
        >
          Previous
        </button>

        <span>Page {page}</span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={patients.length < limit}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default PatientsPage;