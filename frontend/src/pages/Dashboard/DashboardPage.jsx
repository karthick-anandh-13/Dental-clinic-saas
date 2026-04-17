import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { useLanguage } from "../../context/LanguageContext";

function DashboardPage() {
  const { t } = useLanguage();

  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    revenue: 0,
    outstanding: 0
  });
  
  const [chartData, setChartData] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const fetchDashboard = async () => {
    try {
      const res = await API.get("/v1/dashboard");
      setStats(res.data.data.stats);
      setChartData(res.data.data.chart);
      setUpcoming(res.data.data.upcoming);
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

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-xl border">
          <p className="text-gray-500">{t("patientsTitle")}</p>
          <h2 className="text-2xl font-bold">{stats.patients}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <p className="text-gray-500">{t("todayAppointments")}</p>
          <h2 className="text-2xl font-bold">{stats.appointments}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <p className="text-gray-500">{t("revenue")}</p>
          <h2 className="text-2xl font-bold">₹{stats.revenue}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <p className="text-gray-500">{t("outstanding")}</p>
          <h2 className="text-2xl font-bold">₹{stats.outstanding}</h2>
        </div>

      </div>

      {/* CHART */}

      <div className="bg-white p-6 rounded-xl border mb-6">

        <h2 className="mb-4 font-semibold">{t("appointmentsTrend")}</h2>

        {chartData.length === 0 ? (
          <div className="text-gray-500">No appointment data available yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4f46e5" />
            </LineChart>
          </ResponsiveContainer>
        )}

      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <h2 className="mb-4 font-semibold">{t("upcomingAppointments")}</h2>
          {upcoming.length === 0 ? (
            <p className="text-gray-500">{t("noAppointmentsFound")}</p>
          ) : (
            <ul className="space-y-4">
              {upcoming.map((appt) => (
                <li key={appt.id} className="border rounded-lg p-4">
                  <p className="font-semibold text-violet-600">{appt.patient_name}</p>
                  <p className="text-sm text-gray-600">with {appt.dentist_name}</p>
                  <p className="text-sm text-gray-600">{new Date(appt.start_time).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <h2 className="mb-4 font-semibold">{t("notesTitle")}</h2>
          <p className="text-gray-600">{t("notesText")}</p>
        </div>
      </div>

    </div>

  );
}

export default DashboardPage;