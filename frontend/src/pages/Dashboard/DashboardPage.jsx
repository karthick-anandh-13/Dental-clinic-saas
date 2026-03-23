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
  Bar,
  CartesianGrid
} from "recharts";

function DashboardPage() {

  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    revenue: 0
  });
  
  const [chartData, setChartData] = useState([]);
  const fetchDashboard = async () => {
    try {
      const res = await API.get("/v1/dashboard");
      setStats(res.data.stats);
      setChartData(res.data.chart);
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

        <div className="bg-white p-6 rounded-xl border">
          <p className="text-gray-500">Patients</p>
          <h2 className="text-2xl font-bold">{stats.patients}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <p className="text-gray-500">Appointments</p>
          <h2 className="text-2xl font-bold">{stats.appointments}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <p className="text-gray-500">Revenue</p>
          <h2 className="text-2xl font-bold">₹{stats.revenue}</h2>
        </div>

      </div>

      {/* CHART */}

      <div className="bg-white p-6 rounded-xl border">

        <h2 className="mb-4 font-semibold">Appointments Trend</h2>

        <LineChart width={600} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" />
        </LineChart>

      </div>

    </div>

  );
}

export default DashboardPage;