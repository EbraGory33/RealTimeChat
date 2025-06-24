import { useAuthStore } from "../store/auth/useAuthFunction";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="fixed top-0 w-full z-50 border-b backdrop-blur-md bg-white/70 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity">
            <img src="/logo.jpeg" alt="Logo" className="w-6 h-6 rounded-md" />
            <h1 className="text-xl font-semibold">Ebrahim's GrapeVine chat app</h1>
          </div>
        </div>

        <nav className="flex items-center space-x-4">
          {user && (
            <button
              onClick={logout}
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-700 transition-colors"
              aria-label="Log out"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:block">Sign Out</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;