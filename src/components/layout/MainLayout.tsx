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
      <div className="flex-1 flex flex-col">
        <Header
          userName="Nguyễn Văn A"
          userEmail="nguyenvana@example.com"
          onLogout={handleLogout}
        />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
