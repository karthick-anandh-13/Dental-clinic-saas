import { LayoutDashboard, Users, Calendar, FileText } from "lucide-react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white border-r p-4">

      <h2 className="text-2xl font-bold mb-8 text-blue-600">
        Dental SaaS
      </h2>

      <nav className="space-y-4">

        <Link to="/dashboard" className="flex items-center gap-2 hover:text-blue-600">
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link to="/patients" className="flex items-center gap-2 hover:text-blue-600">
          <Users size={20} />
          Patients
        </Link>

        <Link to="/appointments" className="flex items-center gap-2 hover:text-blue-600">
          <Calendar size={20} />
          Appointments
        </Link>

        <Link to="/invoices" className="flex items-center gap-2 hover:text-blue-600">
          <FileText size={20} />
          Invoices
        </Link>

      </nav>

    </div>
  );
}

export default Sidebar;