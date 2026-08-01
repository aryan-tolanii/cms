import { Outlet } from "react-router-dom";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950 dark:text-slate-50">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;