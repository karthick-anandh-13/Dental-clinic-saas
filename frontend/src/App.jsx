import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* Layouts */
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";

/* Pages */
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import PatientsPage from "./pages/patients/PatientsPage";
import PatientProfilePage from "./pages/patients/PatientProfilePage";
import AppointmentsPage from "./pages/appointments/AppointmentsPage";
import InvoicesPage from "./pages/invoices/InvoicesPage";

/* Auth */
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔥 AUTH ROUTES (with premium background) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* 🔒 PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Dashboard */}
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Patients */}
          <Route path="patients" element={<PatientsPage />} />
          <Route path="patients/:id" element={<PatientProfilePage />} />

          {/* Appointments */}
          <Route path="appointments" element={<AppointmentsPage />} />

          {/* Invoices */}
          <Route path="invoices" element={<InvoicesPage />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;