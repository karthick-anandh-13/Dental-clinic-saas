import { useState, useEffect } from "react";
import API from "../../api/axios";
import AddPatientModal from "../../components/patients/AddPatientModal";
import EditPatientModal from "../../components/patients/EditPatientModal";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function PatientsPage() {

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

      setPatients(res.data.data.patients || []);

    } catch (error) {
      console.error("Failed to fetch patients", error);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-2xl font-semibold">Patients</h1>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add Patient
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search patients..."
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
              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Age</th>
              <th className="p-4">Address</th>
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
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No patients found
                </td>
              </tr>
            ) : (
              patients.map((p) => (

                <tr
                  key={p.id}
                  onClick={() => navigate(`/patients/${p.id}`)}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                >

                  <td className="p-4">{p.name}</td>
                  <td className="p-4">{p.phone}</td>
                  <td className="p-4">{p.age}</td>
                  <td className="p-4">{p.address}</td>

                  <td className="p-4 flex gap-3">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPatient(p);
                        setEditOpen(true);
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePatient(p.id);
                      }}
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