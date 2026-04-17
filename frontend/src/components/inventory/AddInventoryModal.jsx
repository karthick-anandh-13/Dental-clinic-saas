import { useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { useLanguage } from "../../context/LanguageContext";

function AddInventoryModal({ isOpen, onClose, refreshInventory }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    item_name: "",
    category: "Consumables",
    quantity: "",
    reorder_level: "",
    unit: "pcs",
    notes: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.item_name || form.quantity === "") {
      toast.error(t("inventoryItemRequired"));
      return;
    }

    try {
      await API.post("/v1/inventory", {
        ...form,
        quantity: Number(form.quantity),
        reorder_level: Number(form.reorder_level || 0)
      });

      toast.success(t("inventoryCreated"));
      refreshInventory();
      onClose();
      setForm({ item_name: "", category: "Consumables", quantity: "", reorder_level: "", unit: "pcs", notes: "" });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || t("inventoryCreateFailed"));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-black rounded-xl p-6 w-96 shadow-xl">
        <h2 className="text-lg font-semibold mb-4 text-violet-600">{t("addInventoryItemTitle")}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="item_name"
            value={form.item_name}
            onChange={handleChange}
            placeholder={t("inventoryItemNameLabel")}
            className="w-full border rounded-lg px-3 py-2 text-violet-600"
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder={t("inventoryCategoryLabel")}
            className="w-full border rounded-lg px-3 py-2 text-violet-600"
          />
          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            placeholder={t("inventoryQuantityLabel")}
            className="w-full border rounded-lg px-3 py-2 text-violet-600"
          />
          <input
            name="reorder_level"
            type="number"
            value={form.reorder_level}
            onChange={handleChange}
            placeholder={t("inventoryReorderLevelLabel")}
            className="w-full border rounded-lg px-3 py-2 text-violet-600"
          />
          <input
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder={t("inventoryUnitLabel")}
            className="w-full border rounded-lg px-3 py-2 text-violet-600"
          />
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder={t("inventoryNotesLabel")}
            className="w-full border rounded-lg px-3 py-2 text-violet-600"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 border rounded-lg">
              {t("cancel")}
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              {t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddInventoryModal;
