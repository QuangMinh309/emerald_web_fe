import type React from "react";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Spinner from "@components/common/Spinner";
import Sidebar from "./Sidebar";
import Header from "./Header";
const MainLayout: React.FC = () => {
  const handleLogout = () => {
    console.log("Logout clicked");
    // thêm logic
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-inter text-gray-900">
      <Sidebar />

      <Header userName="Ban Quản Lý" userEmail="admin@emerald-tower.com" onLogout={handleLogout} />

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
