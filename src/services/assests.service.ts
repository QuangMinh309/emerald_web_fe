import axiosInstance from "@/lib/axios";
import type { Asset, AssetType } from "@/types/asset";
// nao chi can sua service là xong
export const getAssets = async () => {
  const response = await axiosInstance.get("/assets");
  return response.data.data as Asset[];
};
export const getAssetTypes = async (): Promise<AssetType[]> => {
  const response = await axiosInstance.get("/asset-types");
  return response.data.data as AssetType[];
};
export const createAsset = async (assetData: {
  name: string;
  typeId: number;
  blockId: number;
  floor: number;
  locationDetail: string;
  status: string;
  installationDate: string;
  warrantyYears: number;
  note?: string;
}) => {
  const response = await axiosInstance.post("/assets", assetData);
  console.log("Created asset response:", assetData);
  return response.data.data as Asset;
};
export const createAssetType = async (assetTypeData: { name: string; description?: string }) => {
  const response = await axiosInstance.post("/asset-types", assetTypeData);
  return response.data;
};
export const deleteAsset = async (assetId: number) => {
  const response = await axiosInstance.delete(`/assets/${assetId}`);
  return response.data;
};
