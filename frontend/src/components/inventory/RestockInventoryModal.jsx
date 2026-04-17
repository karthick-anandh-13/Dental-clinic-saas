import { useState, useEffect } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { useLanguage } from "../../context/LanguageContext";

function RestockInventoryModal({ isOpen, onClose, item, refreshInventory }) {
  const { t } = useLanguage();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setAmount(0);
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      toast.error(t("inventoryRestockAmountRequired"));
      return;
    }

    try {
      await API.post(`/v1/inventory/${item.id}/restock`, { restock_amount: amount });
      toast.success(t("inventoryRestocked"));
      refreshInventory();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || t("inventoryRestockFailed"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-black rounded-xl p-6 w-96 shadow-xl">
        <h2 className="text-lg font-semibold mb-4 text-violet-600">{t("restockInventoryTitle")}</h2>
        <p className="mb-4 text-gray-300">{item.item_name}</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder={t("restockQuantityLabel")}
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

export default RestockInventoryModal;
