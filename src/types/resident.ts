import type { GenderType } from "@/constants/genderType";

export interface Resident {
  id: number;
  accountId: number;
  account: {
    id: number;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  fullName: string;
  citizenId: string;
  imageUrl: null | string;
  dob: string;
  gender: GenderType;
  phoneNumber: string;
  nationality: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: null | string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResidentDetail {
  id: number;
  accountId: number;
  account: {
    id: number;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  fullName: string;
  citizenId: string;
  imageUrl: null;
  dob: string;
  gender: GenderType;
  phoneNumber: string;
  nationality: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
