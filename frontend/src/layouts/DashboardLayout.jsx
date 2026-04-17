import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ChatVoiceWidget from "../components/ChatVoiceWidget";

function DashboardLayout() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <main className="p-6 bg-gray-100 min-h-screen relative">
          <Outlet />
          <ChatVoiceWidget />
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;