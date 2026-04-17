import { LayoutDashboard, Users, Calendar, FileText, Stethoscope, Box } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Sidebar() {
  const { t } = useLanguage();

  return (
    <div className="w-64 h-screen bg-black-50 border-r p-4">

      <h2 className="text-2xl font-bold mb-8 text-blue-600">
        Dental SaaS
      </h2>

      <nav className="space-y-4">

        <Link to="/dashboard" className="flex items-center gap-2 hover:text-blue-600">
          <LayoutDashboard size={20} />
          {t("dashboardTitle")}
        </Link>

        <Link to="/patients" className="flex items-center gap-2 hover:text-blue-600">
          <Users size={20} />
          {t("patientsTitle")}
        </Link>

        <Link to="/appointments" className="flex items-center gap-2 hover:text-blue-600">
          <Calendar size={20} />
          {t("appointmentsTitle")}
        </Link>

        <Link to="/inventory" className="flex items-center gap-2 hover:text-blue-600">
          <Box size={20} />
          {t("inventoryTitle")}
        </Link>

        <Link to="/invoices" className="flex items-center gap-2 hover:text-blue-600">
          <FileText size={20} />
          {t("invoicesTitle")}
        </Link>

        <Link to="/consultation" className="flex items-center gap-2 hover:text-blue-600">
          <Stethoscope size={20} />
          {t("consultationTitle")}
        </Link>

      </nav>

    </div>
  );
}

export default Sidebar;
