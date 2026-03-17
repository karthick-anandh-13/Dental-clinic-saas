import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

function DashboardPage() {

  const [stats, setStats] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!stats) return <div className="p-6">Loading dashboard...</div>;

  return (

    <div className="p-6 space-y-6">

      {/* STATS CARDS */}
      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-gray-500 text-sm">Total Patients</p>
          <h2 className="text-2xl font-semibold">{stats.total_patients}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-gray-500 text-sm">Appointments Today</p>
          <h2 className="text-2xl font-semibold">{stats.appointments_today}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-gray-500 text-sm">Revenue</p>
          <h2 className="text-2xl font-semibold">₹{stats.total_revenue || 0}</h2>
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-6">

        {/* REVENUE CHART */}
        <div className="bg-white p-4 rounded-xl border">
          <h3 className="mb-4 font-medium">Monthly Revenue</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthly_revenue}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" />
            </LineChart>
          </ResponsiveContainer>

        </div>

        {/* TOP TREATMENTS */}
        <div className="bg-white p-4 rounded-xl border">
          <h3 className="mb-4 font-medium">Top Treatments</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.top_treatments}>
              <XAxis dataKey="treatment_type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );
}

export default DashboardPage;