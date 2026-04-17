const pool = require("../config/db");
const bcrypt = require("bcrypt");

async function seedAdminClinic() {

  try {

    const email = "smilecare@gmail.com";
    const password = "123456";

    const existing = await pool.query(
      "SELECT * FROM clinics WHERE email=$1",
      [email]
    );

    if (existing.rows.length === 0) {

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await pool.query(
        `INSERT INTO clinics (clinic_name,email,password)
         VALUES ($1,$2,$3)`,
        ["SmileCare Dental", email, hashedPassword]
      );

      console.log("✅ Dev admin clinic created");

    } else {

      console.log("✅ Dev admin clinic already exists");

    }

    // Seed sample dentists
    const clinic = await pool.query("SELECT id FROM clinics WHERE email=$1", [email]);
    if (clinic.rows.length > 0) {
      const clinic_id = clinic.rows[0].id;

      const dentists = [
        { name: "Dr. John Smith", email: "john@smilecare.com" },
        { name: "Dr. Sarah Johnson", email: "sarah@smilecare.com" },
        { name: "Dr. Michael Brown", email: "michael@smilecare.com" }
      ];

      for (const dentist of dentists) {
        const existingDentist = await pool.query(
          "SELECT * FROM users WHERE email=$1 AND clinic_id=$2",
          [dentist.email, clinic_id]
        );

        if (existingDentist.rows.length === 0) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash("123456", salt);

          await pool.query(
            `INSERT INTO users (clinic_id, name, email, password)
             VALUES ($1,$2,$3,$4)`,
            [clinic_id, dentist.name, dentist.email, hashedPassword]
          );

          console.log(`✅ Dentist ${dentist.name} created`);
        }
      }

      // Seed sample treatments
      const treatments = [
        { treatment_type: "Cleaning", cost: 50 },
        { treatment_type: "Filling", cost: 150 },
        { treatment_type: "Root Canal", cost: 500 },
        { treatment_type: "Extraction", cost: 200 },
        { treatment_type: "Whitening", cost: 300 },
        { treatment_type: "Braces", cost: 2000 },
        { treatment_type: "Crown", cost: 800 },
        { treatment_type: "Implant", cost: 3000 },
        { treatment_type: "Dentures", cost: 1500 },
        { treatment_type: "Orthodontics", cost: 100 }
      ];

      for (const treatment of treatments) {
        const existingTreatment = await pool.query(
          "SELECT * FROM treatments WHERE treatment_type=$1 AND clinic_id=$2",
          [treatment.treatment_type, clinic_id]
        );

        if (existingTreatment.rows.length === 0) {
          await pool.query(
            `INSERT INTO treatments (clinic_id, treatment_type, cost)
             VALUES ($1,$2,$3)`,
            [clinic_id, treatment.treatment_type, treatment.cost]
          );

          console.log(`✅ Treatment ${treatment.treatment_type} created`);
        }
      }
    }

  } catch (error) {

  }

}

// Create consultation_requests table if not exists
async function createConsultationTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS consultation_requests (
        id SERIAL PRIMARY KEY,
        clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE,
        patient_name VARCHAR(255) NOT NULL,
        patient_phone VARCHAR(20) NOT NULL,
        patient_email VARCHAR(255),
        specialist_type VARCHAR(100) NOT NULL,
        consultation_details TEXT,
        urgency_level VARCHAR(20) DEFAULT 'normal',
        status VARCHAR(20) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ Consultation requests table ready");
  } catch (error) {
    console.error("❌ Error creating consultation table:", error);
  }
}

// Create users table if not exists
async function createUsersTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ Users table ready");
  } catch (error) {
    console.error("❌ Error creating users table:", error);
  }
}

// Create clinics table if not exists
async function createClinicsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clinics (
        id SERIAL PRIMARY KEY,
        clinic_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ Clinics table ready");
  } catch (error) {
    console.error("❌ Error creating clinics table:", error);
  }
}

// Create patients table if not exists
async function createPatientsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        age INTEGER,
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ Patients table ready");
  } catch (error) {
    console.error("❌ Error creating patients table:", error);
  }
}

// Create treatments table if not exists
async function createTreatmentsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS treatments (
        id SERIAL PRIMARY KEY,
        clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        cost DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ Treatments table ready");
  } catch (error) {
    console.error("❌ Error creating treatments table:", error);
  }
}

// Create inventory_items table if not exists
async function createInventoryTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inventory_items (
        id SERIAL PRIMARY KEY,
        clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE,
        item_name VARCHAR(255) NOT NULL,
        category VARCHAR(100) DEFAULT 'Consumables',
        quantity INTEGER DEFAULT 0,
        reorder_level INTEGER DEFAULT 0,
        unit VARCHAR(50) DEFAULT 'pcs',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ Inventory table ready");
  } catch (error) {
    console.error("❌ Error creating inventory table:", error);
  }
}

// Create appointments table if not exists
async function createAppointmentsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE,
        patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
        dentist_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'scheduled',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ Appointments table ready");
  } catch (error) {
    console.error("❌ Error creating appointments table:", error);
  }
}

// Create invoices table if not exists
async function createInvoicesTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE,
        patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
        appointment_id INTEGER REFERENCES appointments(id) ON DELETE SET NULL,
        treatment_name VARCHAR(255) NOT NULL,
        cost DECIMAL(10,2) NOT NULL,
        paid DECIMAL(10,2) DEFAULT 0,
        payment_method VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ Invoices table ready");
  } catch (error) {
    console.error("❌ Error creating invoices table:", error);
  }
}

// Create medical_history table if not exists
async function createMedicalHistoryTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS medical_history (
        id SERIAL PRIMARY KEY,
        clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE,
        patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ Medical history table ready");
  } catch (error) {
    console.error("❌ Error creating medical history table:", error);
  }
}

// Create audit_logs table if not exists
async function createAuditLogsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(50) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id INTEGER,
        details JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ Audit logs table ready");
  } catch (error) {
    console.error("❌ Error creating audit logs table:", error);
  }
}

async function seedAdminClinic() {
  await createClinicsTable();
  await createUsersTable();
  await createPatientsTable();
  await createTreatmentsTable();
  await createInventoryTable();
  await createAppointmentsTable();
  await createInvoicesTable();
  await createMedicalHistoryTable();
  await createAuditLogsTable();
  await createConsultationTable();

  try {

    const email = "smilecare@gmail.com";
    const password = "123456";

    const existing = await pool.query(
      "SELECT * FROM clinics WHERE email=$1",
      [email]
    );

    if (existing.rows.length === 0) {

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await pool.query(
        `INSERT INTO clinics (clinic_name,email,password)
         VALUES ($1,$2,$3)`,
        ["SmileCare Dental", email, hashedPassword]
      );

      console.log("✅ Dev admin clinic created");

    } else {

      console.log("✅ Dev admin clinic already exists");

    }

    // Seed sample dentists
    const clinic = await pool.query("SELECT id FROM clinics WHERE email=$1", [email]);
    if (clinic.rows.length > 0) {
      const clinic_id = clinic.rows[0].id;

      const dentists = [
        { name: "Dr. John Smith", email: "john@smilecare.com" },
        { name: "Dr. Sarah Johnson", email: "sarah@smilecare.com" },
        { name: "Dr. Michael Brown", email: "michael@smilecare.com" }
      ];

      for (const dentist of dentists) {
        const existingDentist = await pool.query(
          "SELECT * FROM users WHERE email=$1 AND clinic_id=$2",
          [dentist.email, clinic_id]
        );

        if (existingDentist.rows.length === 0) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          await pool.query(
            `INSERT INTO users (clinic_id, name, email, password, role)
             VALUES ($1, $2, $3, $4, $5)`,
            [clinic_id, dentist.name, dentist.email, hashedPassword, "dentist"]
          );

          console.log(`✅ Dentist ${dentist.name} seeded`);
        }
      }

      // Seed treatments
      const treatments = [
        { name: "Teeth Cleaning", cost: 500 },
        { name: "Fillings", cost: 800 },
        { name: "Root Canal", cost: 2000 },
        { name: "Braces", cost: 5000 },
        { name: "Tooth Extraction", cost: 300 },
        { name: "Dental Implants", cost: 15000 },
        { name: "Crowns", cost: 2500 },
        { name: "Wisdom Teeth Removal", cost: 1200 },
        { name: "Dentures", cost: 8000 },
        { name: "Orthodontic Consultation", cost: 200 }
      ];

      for (const treatment of treatments) {
        const existingTreatment = await pool.query(
          "SELECT * FROM treatments WHERE name=$1 AND clinic_id=$2",
          [treatment.name, clinic_id]
        );

        if (existingTreatment.rows.length === 0) {
          await pool.query(
            `INSERT INTO treatments (clinic_id, name, cost)
             VALUES ($1, $2, $3)`,
            [clinic_id, treatment.name, treatment.cost]
          );

          console.log(`✅ Treatment ${treatment.name} seeded`);
        }
      }

      const inventoryItems = [
        { item_name: "Gloves", category: "Consumables", quantity: 150, reorder_level: 50, unit: "boxes" },
        { item_name: "Mask", category: "Consumables", quantity: 220, reorder_level: 60, unit: "boxes" },
        { item_name: "Anesthetic", category: "Medications", quantity: 45, reorder_level: 20, unit: "vials" },
        { item_name: "Filling Material", category: "Materials", quantity: 30, reorder_level: 15, unit: "packs" },
        { item_name: "Syringes", category: "Consumables", quantity: 90, reorder_level: 40, unit: "boxes" }
      ];

      for (const item of inventoryItems) {
        const existingItem = await pool.query(
          "SELECT * FROM inventory_items WHERE item_name=$1 AND clinic_id=$2",
          [item.item_name, clinic_id]
        );

        if (existingItem.rows.length === 0) {
          await pool.query(
            `INSERT INTO inventory_items
             (clinic_id, item_name, category, quantity, reorder_level, unit)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [clinic_id, item.item_name, item.category, item.quantity, item.reorder_level, item.unit]
          );
          console.log(`✅ Inventory item ${item.item_name} seeded`);
        }
      }

    }

  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
}

module.exports = seedAdminClinic;