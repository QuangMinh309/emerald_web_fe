import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-third/20 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-block mb-10 text-main hover:underline">
          ← Về trang chủ
        </Link>

        <h1 className="text-3xl md:text-5xl font-bold text-main mb-10 text-center">
          Về Emerald Residence
        </h1>

        <div className="space-y-12 text-base leading-relaxed text-gray-700">
          <p className="text-center text-lg italic">"Nơi mỗi ngày đều là một ngày đẹp để sống."</p>

          <section>
            <h2 className="text-2xl font-semibold text-main mb-6">Tầm nhìn</h2>
            <p>
              Emerald Residence không chỉ là nơi ở – mà là một cộng đồng sống hiện đại, nơi cư dân
              được chăm sóc từng chi tiết nhỏ nhất. Chúng tôi xây dựng không gian sống xanh, an toàn
              và tiện nghi bậc nhất.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-main mb-6">Giá trị cốt lõi</h2>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="bg-white p-8 rounded-2xl shadow-md">
                <h3 className="text-lg font-bold text-main mb-3">Minh bạch</h3>
                <p>Mọi thông tin phí, thông báo đều được công khai rõ ràng</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-md">
                <h3 className="text-lg font-bold text-main mb-3">Tiện lợi</h3>
                <p>Tất cả dịch vụ chỉ cách bạn một cú click</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-md">
                <h3 className="text-lg font-bold text-main mb-3">An toàn</h3>
                <p>Hệ thống an ninh 24/7, bảo vệ cư dân mọi lúc</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-md">
                <h3 className="text-lg font-bold text-main mb-3">Cộng đồng</h3>
                <p>Kết nối cư dân qua sự kiện, thông báo chung</p>
              </div>
            </div>
          </section>

          <div className="text-center mt-16">
            <p className="text-xl font-medium text-main">
              Chào mừng bạn đến với ngôi nhà thực sự của mình
            </p>
            <Heart className="w-12 h-12 mx-auto mt-6 text-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Heart({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      role="img"
      aria-label="Heart"
    >
      <title>Heart</title>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}
