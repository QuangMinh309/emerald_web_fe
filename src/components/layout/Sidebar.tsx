import type React from "react";
import {
  Users,
  FileText,
  Bell,
  FileBox,
  Wrench,
  BarChart3,
  TrendingUp,
  Settings,
  Building2,
} from "lucide-react";
import type { MenuItem } from "@/types";
import Logo from "@assets/logo.svg";

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menuId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuChange }) => {
  const menuItems: MenuItem[] = [
    { id: "apartments", icon: Building2, label: "Quản lý căn hộ" },
    { id: "residents", icon: Users, label: "Quản lý cư dân" },
    { id: "feedback", icon: FileText, label: "Phản ánh, yêu cầu" },
    { id: "notifications", icon: Bell, label: "Thông báo" },
    { id: "assets", icon: FileBox, label: "Tài sản, thiết bị" },
    { id: "maintenance", icon: Wrench, label: "Bảo trì" },
    { id: "rules", icon: FileText, label: "Biểu quyết" },
    { id: "services", icon: Settings, label: "Dịch vụ" },
    { id: "amenities", icon: BarChart3, label: "Tiện ích" },
    { id: "reports", icon: TrendingUp, label: "Báo cáo thống kê" },
  ];

  return (
    <div className="w-60 bg-main min-h-screen text-white flex flex-col fixed top-0 left-0">
      <div className="p-6 border-b border-white/20 flex flex-col items-center">
        <div className="mb-3">
          <img src={Logo} alt="Emerald Tower Logo" className="w-14 h-14" />
        </div>
        <h1 className="font-semibold text-lg text-center">Emerald Tower</h1>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onMenuChange(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                activeMenu === item.id ? "bg-white/10 border-r-4 border-white" : "hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
