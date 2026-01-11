interface Asset {
  id: number;
  name: string;
  typeName: string;
  blockName: string;
  floor: number;
  locationDetail: string;
  status: string;
  nextMaintenanceDate: string;
  isWarrantyValid: boolean;
}
interface AssetType {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
export type { Asset, AssetType };
