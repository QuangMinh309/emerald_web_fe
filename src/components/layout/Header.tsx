import type React from "react";
import { useState } from "react";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";

interface HeaderProps {
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  userName = "User",
  userEmail = "user@example.com",
  avatarUrl,
  onLogout,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="h-16 bg-white border-b border-border flex items-center justify-end px-6 gap-4">
      <button type="button" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <Bell className="w-5 h-5" />
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 transition-colors"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={userName} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          )}
          <ChevronDown className="w-4 h-4" />
        </button>

        {showDropdown && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
              aria-label="Close dropdown overlay"
            />
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg border border-border z-20 py-2">
              <div className="px-4 py-3 border-b border-border">
                <p className="font-medium text-sm">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowDropdown(false);
                  onLogout?.();
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
