import type { Asset } from "@/pages/Assets/view-assets/columns";

const data: Asset[] = [
  {
    id: "1",
    code: "TS-001",
    name: "Thang máy A01",
    type: "Thang máy",
    location: "Tòa A - Sảnh",
    status: "good",
    lastMaintenance: "02/12/2025",
  },
  {
    id: "2",
    code: "TS-002",
    name: "Tủ điện tổng",
    type: "Điện",
    location: "Tòa A - Hầm",
    status: "broken",
    lastMaintenance: "01/12/2025",
  },
];
// nao chi can sua service là xong
export const getAssets = async (): Promise<Asset[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 800); // 800ms delay
  });
};
