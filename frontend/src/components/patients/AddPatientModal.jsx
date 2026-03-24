import { useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast"; // ✅ IMPORTANT

function AddPatientModal({ isOpen, onClose, refreshPatients }) {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    address: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await API.post("/v1/patients", form);

      toast.success("Patient added successfully"); // ✅ CORRECT PLACE

      refreshPatients();
      onClose();

    } catch (error) {

      toast.error("Failed to add patient"); // ✅ ADD THIS
      console.error(error);

    }
  };

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">

      <div className="bg-white rounded-xl p-6 w-96">

        <h2 className="text-lg font-semibold mb-4">
          Add Patient
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            name="name"
            placeholder="Patient Name"
            className="w-full border rounded-lg px-3 py-2"
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone"
            className="w-full border rounded-lg px-3 py-2"
            onChange={handleChange}
            required
          />

          <input
            name="age"
            placeholder="Age"
            type="number"
            className="w-full border rounded-lg px-3 py-2"
            onChange={handleChange}
            required
          />

          <input
            name="address"
            placeholder="Address"
            className="w-full border rounded-lg px-3 py-2"
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

export default AddPatientModal;