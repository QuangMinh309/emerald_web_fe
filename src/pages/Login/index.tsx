import { AuthCard } from "@/components/common/AuthCard";
import { LoginForm } from "./loginform";

export default function LoginPage() {
  return (

    <div className={"min-h-screen bg-[#f5f5f5]"}>
      <main className="flex min-h-[calc(100vh-96px)] items-center justify-center px-4">
        <AuthCard title="Đăng nhập">
          <LoginForm forgotHref="/forgot-password" />
        </AuthCard>      
      </main>
    </div>
  );
}
