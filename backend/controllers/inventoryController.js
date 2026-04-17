const pool = require("../config/db");
const apiResponse = require("../utils/apiResponse");
const auditService = require("../services/auditService");

exports.getInventoryItems = async (req, res, next) => {
  try {
    const clinic_id = req.clinic.clinic_id;
    const items = await pool.query(
      `SELECT * FROM inventory_items WHERE clinic_id = $1 ORDER BY updated_at DESC`,
      [clinic_id]
    );

    return apiResponse.success(res, items.rows, "Inventory retrieved successfully");
  } catch (err) {
    next(err);
  }
};

exports.createInventoryItem = async (req, res, next) => {
  try {
    const clinic_id = req.clinic.clinic_id;
    const user_id = req.clinic.user_id || null;
    const { item_name, category, quantity, reorder_level, unit, notes } = req.body;

    if (!item_name || quantity == null) {
      return apiResponse.error(res, "Item name and quantity are required", 400);
    }

    const newItem = await pool.query(
      `INSERT INTO inventory_items
        (clinic_id, item_name, category, quantity, reorder_level, unit, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [clinic_id, item_name, category || "General", quantity, reorder_level || 0, unit || "pcs", notes || ""]
    );

    await auditService.logAction(clinic_id, user_id, "CREATE", "INVENTORY", newItem.rows[0].id);

    return apiResponse.success(res, newItem.rows[0], "Inventory item created successfully", 201);
  } catch (err) {
    next(err);
  }
};

exports.restockInventoryItem = async (req, res, next) => {
  try {
    const clinic_id = req.clinic.clinic_id;
    const user_id = req.clinic.user_id || null;
    const { id } = req.params;
    const { restock_amount } = req.body;

    const amount = Number(restock_amount);
    if (!amount || amount <= 0) {
      return apiResponse.error(res, "Restock amount must be greater than zero", 400);
    }

    const existing = await pool.query(
      `SELECT * FROM inventory_items WHERE id = $1 AND clinic_id = $2`,
      [id, clinic_id]
    );

    if (existing.rows.length === 0) {
      return apiResponse.error(res, "Inventory item not found", 404);
    }

    const updated = await pool.query(
      `UPDATE inventory_items
       SET quantity = quantity + $1,
           updated_at = NOW()
       WHERE id = $2 AND clinic_id = $3
       RETURNING *`,
      [amount, id, clinic_id]
    );

    await auditService.logAction(clinic_id, user_id, "RESTOCK", "INVENTORY", Number(id));

    return apiResponse.success(res, updated.rows[0], "Inventory restocked successfully");
  } catch (err) {
    next(err);
  }
};
