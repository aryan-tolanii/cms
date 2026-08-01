import useAuth from "@/hooks/useAuth";

import { ModeToggle } from "@/components/mode-toggle";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white dark:bg-slate-950 px-6">
      <h2 className="text-xl font-semibold">
        Dashboard
      </h2>

      <div className="flex items-center gap-4">
        <ModeToggle />
        <div className="text-sm text-slate-600 dark:text-slate-300">
          {user?.name || "Administrator"}
        </div>
      </div>
    </header>
  );
};

export default Navbar;