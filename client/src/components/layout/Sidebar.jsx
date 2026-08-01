import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderKanban } from "lucide-react";

import { ROUTES } from "@/constants/routes";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: ROUTES.DASHBOARD,
  },
  {
    label: "Projects",
    icon: FolderKanban,
    path: ROUTES.PROJECTS,
  },
];

const Sidebar = () => {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="border-b p-6">
        <h1 className="text-xl font-bold">
          Portfolio CMS
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-black text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={18} />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;