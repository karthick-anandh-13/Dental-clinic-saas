import { useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { useLanguage } from "../../context/LanguageContext";

function ConsultationRequestPage() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    patient_name: "",
    patient_phone: "",
    patient_email: "",
    specialist_type: "",
    consultation_details: "",
    urgency_level: "normal"
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/v1/consultations", formData);
      toast.success("Consultation request submitted successfully!");
      setFormData({
        patient_name: "",
        patient_phone: "",
        patient_email: "",
        specialist_type: "",
        consultation_details: "",
        urgency_level: "normal"
      });
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">{t("consultationRequestTitle")}</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <p className="text-gray-600 mb-4">
          {t("consultationDescription")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("fullNameLabel")}</label>
            <input
              type="text"
              name="patient_name"
              value={formData.patient_name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg"
              placeholder={t("fullNameLabel")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("phoneLabel")}</label>
            <input
              type="tel"
              name="patient_phone"
              value={formData.patient_phone}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg"
              placeholder={t("phoneLabel")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("emailLabel")}</label>
            <input
              type="email"
              name="patient_email"
              value={formData.patient_email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              placeholder={t("emailLabel")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("specialistTypeLabel")}</label>
            <select
              name="specialist_type"
              value={formData.specialist_type}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="">Select specialist</option>
              <option value="orthodontist">Orthodontist</option>
              <option value="oral_surgeon">Oral Surgeon</option>
              <option value="periodontist">Periodontist</option>
              <option value="endodontist">Endodontist</option>
              <option value="pediatric_dentist">Pediatric Dentist</option>
              <option value="prosthodontist">Prosthodontist</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("consultationDetailsLabel")}</label>
            <textarea
              name="consultation_details"
              value={formData.consultation_details}
              onChange={handleChange}
              rows={4}
              className="w-full border px-3 py-2 rounded-lg"
              placeholder={t("consultationDetailsLabel")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("urgencyLevelLabel")}</label>
            <select
              name="urgency_level"
              value={formData.urgency_level}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? t("submitting") : t("submitRequest")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ConsultationRequestPage;