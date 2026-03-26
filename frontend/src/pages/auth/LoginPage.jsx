import { useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/v1/auth/login", {
        email,
        password,
      });

      setAuth(res.data.token, res.data.clinic);

      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">

      {/* 🔥 Login Card */}
      <div className="glass rounded-2xl p-8 w-[380px] shadow-2xl">

        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          Clinic Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg input-premium"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg input-premium"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg btn-premium font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default LoginPage;