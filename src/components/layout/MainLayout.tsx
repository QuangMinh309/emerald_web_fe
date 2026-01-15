import type React from "react";
import { Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Spinner from "@components/common/Spinner";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "@/contexts/AuthContext";
const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const userName = user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";

  return (
    <div className="flex min-h-screen bg-gray-50 font-inter text-gray-900">
      <Sidebar />

      <Header userName={userName} userEmail={userEmail} onLogout={handleLogout} />

      <main className="ml-64 mt-16 p-8 flex-1 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto">
          <Suspense
            fallback={
              <div className="w-full h-[calc(100vh-100px)] flex items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
