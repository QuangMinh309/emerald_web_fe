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
      apartments: "/apartments",
      residents: "/residents",
      feedback: "/feedback",
      notifications: "/notifications",
      assets: "/assets",
      maintenance: "/maintenance",
      rules: "/rules",
      services: "/services",
      amenities: "/amenities",
      reports: "/reports",
    };

    if (routeMap[menuId]) {
      navigate(routeMap[menuId]);
    }
  };

  const handleLogout = () => {
    // logic
    console.log("Logging out...");
  };

  return (
    <div className="flex min-h-screen bg-third font-inter">
      <Sidebar activeMenu={activeMenu} onMenuChange={handleMenuChange} />

      <Header userName="Nguyễn Văn A" userEmail="nguyenvana@example.com" onLogout={handleLogout} />

      <main className="ml-60 mt-16 p-8 flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
