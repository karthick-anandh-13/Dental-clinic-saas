import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* Layout */
import DashboardLayout from "./layouts/DashboardLayout";

/* Pages */
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import PatientsPage from "./pages/patients/PatientsPage";
import PatientProfilePage from "./pages/patients/PatientProfilePage";

/* Auth */
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTE */}
        <Route path="/login" element={<LoginPage />} />

        {/* PROTECTED WRAPPER */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Patients */}
          <Route path="/patients" element={<PatientsPage />} />

          {/* Patient Profile */}
          <Route path="/patients/:id" element={<PatientProfilePage />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;