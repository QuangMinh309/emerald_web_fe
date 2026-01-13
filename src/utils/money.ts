export const formatVND = (n?: number | null) => {
  if (n == null || !Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("vi-VN").format(n);
};
const formatVNDInput = (v: string | number | null | undefined) => {
  const s = String(v ?? "").replace(/\D/g, ""); // chỉ giữ số
  if (!s) return "";
  return new Intl.NumberFormat("vi-VN").format(Number(s));
};

const parseVNDInput = (text: string) => text.replace(/\D/g, ""); // "1.000.000" -> "1000000"
