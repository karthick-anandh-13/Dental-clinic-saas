import { useLanguage } from "../context/LanguageContext";

function Navbar() {
  const { t } = useLanguage();

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">

      <h1 className="text-lg font-semibold">
        {t("dashboardTitle")}
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">Dr. Admin</span>
      </div>

    </div>
  );
}

export default Navbar;