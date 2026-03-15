import { useEffect, useState } from "react";
import API from "../../api/axios";

function DashboardPage() {

  const [stats, setStats] = useState({
    total_patients: 0,
    appointments_today: 0,
    monthly_revenue: [],
    top_treatments: []
  });

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const res = await API.get("/dashboard");

        setStats(res.data);

      } catch (error) {

        console.error("Dashboard fetch failed", error);

      }

    };

    fetchDashboard();

  }, []);

  return (

    <div>

      <h1 className="text-2xl font-semibold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Total Patients</p>
          <h2 className="text-2xl font-semibold">
            {stats.total_patients}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Appointments Today</p>
          <h2 className="text-2xl font-semibold">
            {stats.appointments_today}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Top Treatments</p>
          <h2 className="text-2xl font-semibold">
            {stats.top_treatments.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Monthly Revenue</p>
          <h2 className="text-2xl font-semibold">
            ₹{stats.monthly_revenue.reduce((a,b)=>a + Number(b.revenue),0)}
          </h2>
        </div>

      </div>

    </div>

  );

}

export default DashboardPage;