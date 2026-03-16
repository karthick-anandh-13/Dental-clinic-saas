import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* Layout */
import DashboardLayout from "./layouts/DashboardLayout";

/* Pages */
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import PatientsPage from "./pages/patients/PatientsPage";

/* Auth */
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* PUBLIC ROUTE */}
        <Route path="/login" element={<LoginPage />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          {/* Default Redirect */}
          <Route index element={<Navigate to="/dashboard" />} />

          {/* Dashboard */}
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Patients */}
          <Route path="patients" element={<PatientsPage />} />

        </Route>

      </Routes>

    </BrowserRouter>

  );

}

export default App;