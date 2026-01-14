export const formatVND = (n?: number | null) => {
  if (n == null || !Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("vi-VN").format(n);
};