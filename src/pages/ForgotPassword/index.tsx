import { AuthCard } from "@/components/common/AuthCard";
import { ForgotPasswordForm } from "./forgotform";

export default function LoginPage() {
  return (

    <div className={"min-h-screen bg-[#f5f5f5]"}>
      <main className="flex min-h-[calc(100vh-96px)] items-center justify-center px-4">
        <AuthCard title="Quên mật khẩu">
          <ForgotPasswordForm loginHref="/login" />
        </AuthCard>      
      </main>
    </div>
  );
}
