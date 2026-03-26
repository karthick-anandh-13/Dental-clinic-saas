import { useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

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

    /* 🔥 Frontend validation */
    if (!form.name || !form.phone || !form.age) {
      toast.error("Please fill required fields");
      return;
    }

    try {

      const payload = {
        name: form.name,
        phone_number: form.phone,   // ✅ FIXED KEY
        age: Number(form.age),      // ✅ ensure number
        address: form.address
      };

      console.log("Sending payload:", payload); // 🔍 DEBUG

      await API.post("/v1/patients", payload);

      toast.success("Patient added successfully");

      refreshPatients();
      onClose();

      // 🔥 Reset form
      setForm({
        name: "",
        phone: "",
        age: "",
        address: ""
      });

    } catch (error) {

      console.error("Add patient error:", error.response?.data || error.message);

      toast.error(
        error.response?.data?.message || "Failed to add patient"
      );

    }
  };

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-xl p-6 w-96 shadow-xl">

        <h2 className="text-lg font-semibold mb-4">
          Add Patient
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            name="name"
            placeholder="Patient Name"
            className="w-full border rounded-lg px-3 py-2"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone"
            className="w-full border rounded-lg px-3 py-2"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            name="age"
            placeholder="Age"
            type="number"
            className="w-full border rounded-lg px-3 py-2"
            value={form.age}
            onChange={handleChange}
          />

          <input
            name="address"
            placeholder="Address"
            className="w-full border rounded-lg px-3 py-2"
            value={form.address}
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