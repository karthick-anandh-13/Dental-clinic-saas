import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

function ProtectedRoute({ children }) {
  const location = useLocation();

  // ✅ reactive + safe read
  const token = useAuthStore((state) => state.token);

  // ⏳ prevent false redirect during initial render
  if (token === undefined) {
    return null; // or loading spinner if you want
  }

  // 🔒 not authenticated → redirect
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ✅ authenticated → render children
  return children;
}

export default ProtectedRoute;