import { useState, useEffect } from "react";
import API from "../../api/axios";
import AddPatientModal from "../../components/patients/AddPatientModal";
import { useNavigate } from "react-router-dom";
function PatientsPage() {

  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const limit = 10;

  const fetchPatients = async () => {

    try {

      setLoading(true);

      const res = await API.get(
        `/v1/patients?page=${page}&limit=${limit}&search=${search}`
      );

      const data = res.data.results || res.data;

      setPatients(data);

      setLoading(false);

    } catch (error) {

      console.error("Failed to fetch patients", error);
      setLoading(false);

    }

  };

  useEffect(() => {
    fetchPatients();
  }, [search, page]);

  const deletePatient = async (id) => {

    if (!confirm("Delete this patient?")) return;

    try {

      await API.delete(`/v1/patients/${id}`);

      fetchPatients();

    } catch (error) {

      console.error("Delete failed", error);

    }

  };

  return (

    <div className="p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-semibold">
          Patients
        </h1>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Patient
        </button>

      </div>

      {/* SEARCH BAR */}

      <div className="mb-4">

        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-64"
        />

      </div>

      {/* ADD PATIENT MODAL */}

      <AddPatientModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
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
                  Loading patients...
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

                <tr key={p.id} 
                  onClick={() => navigate(`/patients/${p.id}`)}
                  className="border-t hover:bg-gray-50 cursor-pointer">

                  <td className="p-4">{p.name}</td>
                  <td className="p-4">{p.phone}</td>
                  <td className="p-4">{p.age}</td>
                  <td className="p-4">{p.address}</td>

                  <td className="p-4">

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
          className="px-3 py-1 border rounded"
        >
          Next
        </button>

      </div>

    </div>

  );

}

export default PatientsPage;