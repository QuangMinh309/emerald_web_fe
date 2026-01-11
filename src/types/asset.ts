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
export interface AssetDetail {
  id: number;
  name: string;
  description: string;
  note: string;
  status: string;
  type: {
    id: number;
    name: string;
    description: string;
  };
  location: {
    blockId: number;
    blockName: string;
    floor: number;
    floorDisplay: string;
    detail: string;
  };
  timeline: {
    installationDate: string;
    warrantyExpirationDate: string;
    lastMaintenanceDate: null;
    nextMaintenanceDate: string;
  };
  computed: {
    isWarrantyValid: boolean;
    isOverdueMaintenance: boolean;
    daysUntilMaintenance: number;
  };
}
interface AssetType {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
export type { Asset, AssetType };
