import { useState, useEffect } from "react";
import API from "../../api/axios";
import AddInventoryModal from "../../components/inventory/AddInventoryModal";
import RestockInventoryModal from "../../components/inventory/RestockInventoryModal";
import { useLanguage } from "../../context/LanguageContext";
import toast from "react-hot-toast";

function InventoryPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [restockOpen, setRestockOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await API.get("/v1/inventory");
      setItems(res.data.data || []);
    } catch (err) {
      console.error("Failed to load inventory", err);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openRestock = (item) => {
    setSelectedItem(item);
    setRestockOpen(true);
  };

  const getStatus = (item) => {
    if (item.quantity <= item.reorder_level) {
      return t("inventoryLowStock");
    }
    return t("inventoryOnHand");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-violet-600">{t("inventoryTitle")}</h1>
          <p className="text-gray-500 mt-1">{t("inventoryDescription")}</p>
        </div>

        <button
          onClick={() => setAddOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {t("inventoryAddButton")}
        </button>
      </div>

      <AddInventoryModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        refreshInventory={fetchInventory}
      />

      <RestockInventoryModal
        isOpen={restockOpen}
        onClose={() => setRestockOpen(false)}
        item={selectedItem}
        refreshInventory={fetchInventory}
      />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-600">
              <th className="p-4">{t("inventoryName")}</th>
              <th className="p-4">{t("inventoryCategory")}</th>
              <th className="p-4">{t("inventoryQuantity")}</th>
              <th className="p-4">{t("inventoryUnit")}</th>
              <th className="p-4">{t("inventoryReorderLevel")}</th>
              <th className="p-4">{t("inventoryStatus")}</th>
              <th className="p-4">{t("inventoryActions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-500">
                  {t("loading")}
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-500">
                  {t("noInventoryFound")}
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-violet-600">{item.item_name}</td>
                  <td className="p-4 text-violet-600">{item.category}</td>
                  <td className="p-4 text-violet-600">{item.quantity}</td>
                  <td className="p-4 text-violet-600">{item.unit}</td>
                  <td className="p-4 text-violet-600">{item.reorder_level}</td>
                  <td className={`p-4 ${item.quantity <= item.reorder_level ? "text-red-500" : "text-green-600"}`}>
                    {getStatus(item)}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => openRestock(item)}
                      className="text-blue-600 hover:underline"
                    >
                      {t("inventoryRestockButton")}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryPage;
