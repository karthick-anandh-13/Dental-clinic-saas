import { useState, useEffect } from "react";
import API from "../../api/axios";

function EditPatientModal({ isOpen, onClose, patient, refreshPatients }) {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    address: ""
  });

  useEffect(() => {
    if (patient) {
      setForm({
        name: patient.name || "",
        phone: patient.phone || "",
        age: patient.age || "",
        address: patient.address || ""
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {

      await API.put(`/v1/patients/${patient.id}`, form);

      refreshPatients();
      onClose();

    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

      <div className="bg-black p-6 rounded-xl w-96 space-y-4">

        <h2 className="text-lg font-semibold">Edit Patient</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border px-3 py-2 rounded text-violet-600"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border px-3 py-2 rounded text-violet-600"
        />

        <input
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="Age"
          className="w-full border px-3 py-2 rounded text-violet-600"
        />

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border px-3 py-2 rounded text-violet-600"
        />

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-black-600 text-black rounded"
          >
            Update
          </button>

        </div>

      </div>

    </div>

  );
}

export default EditPatientModal;