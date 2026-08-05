import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderKanban, X } from "lucide-react";

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

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-screen w-full flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 p-6">
          <h1 className="text-xl font-bold">
            Portfolio CMS
          </h1>
          <button
            className="lg:hidden p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                }`
              }
            >
              <Icon size={18} />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      </div>
    </aside>
  );
};

export default Sidebar;