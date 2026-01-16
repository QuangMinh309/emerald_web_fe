import { useEffect, useState } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { toast } from "sonner";
import { AuthCard } from "@/components/common/AuthCard";
import { LoginForm } from "./loginform";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login, logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const from = "/blocks";

  useEffect(() => {
    if (!isAuthenticated) return;

    if (user?.role === "RESIDENT") {
      toast.error("Tài khoản này dùng cho ứng dụng cư dân (mobile).");
      logout();
      return;
    }

    navigate(from, { replace: true });
  }, [isAuthenticated, user, from, navigate, logout]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsSubmitting(true);
    try {
      const profile = await login(values.email, values.password);
      if (profile.role === "RESIDENT") {
        toast.error("Tài khoản này dùng cho ứng dụng cư dân (mobile).");
        logout();
        return;
      }
      navigate(from, { replace: true });
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Đăng nhập thất bại";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={"min-h-screen bg-[#f5f5f5]"}>
      <main className="flex min-h-[calc(100vh-96px)] items-center justify-center px-4">
        <AuthCard title="Đăng nhập">
          <LoginForm
            forgotHref="/forgot-password"
            onSubmit={handleSubmit}
            isPending={isSubmitting}
          />
        </AuthCard>
      </main>
    </div>
  );
}
