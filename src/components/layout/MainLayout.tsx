import type React from "react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState("apartments");
  const navigate = useNavigate();

  const handleMenuChange = (menuId: string) => {
    setActiveMenu(menuId);
    const routeMap: Record<string, string> = {
      building: "/building",
      apartments: "/apartments",
      debts: "/debts",
      residents: "/residents",
      assets: "/assets",
      services: "/services",
      feedback: "/feedback",
      maintenance: "/maintenance",
      voting: "/voting",
      notifications: "/notifications",
      reports: "/reports",
      permissions: "/permissions",
    };

    if (routeMap[menuId]) {
      navigate(routeMap[menuId]);
    }
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    // thêm logic
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-inter text-gray-900">
      <Sidebar activeMenu={activeMenu} onMenuChange={handleMenuChange} />

      <Header userName="Ban Quản Lý" userEmail="admin@emerald-tower.com" onLogout={handleLogout} />

      <main className="ml-64 mt-16 p-8 flex-1 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
