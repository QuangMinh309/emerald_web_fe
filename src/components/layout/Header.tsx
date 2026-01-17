import type React from "react";
import { useState } from "react";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

interface HeaderProps {
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  userName = "Admin User",
  userEmail = "admin@emerald.com",
  avatarUrl,
  onLogout,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { items, unreadCount } = useAppSelector((state) => state.notification);
  return (
    <div className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-end px-6 gap-4 fixed top-0 left-64 right-0 z-40 transition-all duration-300">
      <button
        type="button"
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />

        {/* badge */}
        {unreadCount > 0 && (
          <span
            className="
            absolute -top-1 -right-1
            min-w-[18px] h-[18px]
            px-1
            bg-red-500
            text-white
            text-[11px]
            font-semibold
            rounded-full
            flex items-center justify-center
            leading-none
          "
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1.5 pr-3 transition-colors border border-transparent hover:border-gray-200"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
              <User className="w-5 h-5 text-gray-500" />
            </div>
          )}
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-gray-700 leading-none">{userName}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>

        {showDropdown && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-10 cursor-default"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                <p className="font-semibold text-sm text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>
              <div className="p-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    onLogout?.();
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 rounded-md flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
