import axiosInstance from "@/lib/axios";
import type { Resident, ResidentDetail } from "@/types/resident";
// nao chi can sua service là xong
export const getResidents = async () => {
  const response = await axiosInstance.get("/residents");
  return response.data.data as Resident[];
};
export const createResident = async (residentData: {
  email: string;
  fullName: string;
  citizenId: string;
  dob: string;
  gender: string;
  phoneNumber: string;
  nationality: string;
  ward: string;
  district: string;
  province: string;
  detailAddress?: string;
  image?: File;
}) => {
  const formData = new FormData();
  formData.append("email", residentData.email);
  formData.append("fullName", residentData.fullName);
  formData.append("citizenId", residentData.citizenId);
  formData.append("dob", residentData.dob);
  formData.append("gender", residentData.gender);
  formData.append("phoneNumber", residentData.phoneNumber);
  formData.append("nationality", residentData.nationality);
  formData.append("ward", residentData.ward);
  formData.append("district", residentData.district);
  formData.append("province", residentData.province);
  if (residentData.detailAddress) {
    formData.append("detailAddress", residentData.detailAddress);
  }
  if (residentData.image) {
    formData.append("image", residentData.image);
  }
  const response = await axiosInstance.post("/residents", formData);
  console.log("Created resident response:", response.data);
  return response.data.data as Resident;
};
export const updateAsset = async ({
  id,
  residentData,
}: {
  id: number;
  residentData: {
    fullName: string;
    citizenId: string;
    dob: string;
    gender: string;
    phoneNumber: string;
    nationality: string;
    ward: string;
    district: string;
    province: string;
    detailAddress?: string;
    image?: File;
  };
}) => {
  const formData = new FormData();
  formData.append("fullName", residentData.fullName);
  formData.append("citizenId", residentData.citizenId);
  formData.append("dob", residentData.dob);
  formData.append("gender", residentData.gender);
  formData.append("phoneNumber", residentData.phoneNumber);
  formData.append("nationality", residentData.nationality);
  formData.append("ward", residentData.ward);
  formData.append("district", residentData.district);
  formData.append("province", residentData.province);
  if (residentData.detailAddress) {
    formData.append("detailAddress", residentData.detailAddress);
  }
  if (residentData.image) {
    formData.append("image", residentData.image);
  }
  const response = await axiosInstance.patch(`/residents/${id}`, formData);
  return response.data.data as Resident;
};
export const deleteResident = async (residentId: number) => {
  const response = await axiosInstance.delete(`/residents/${residentId}`);
  return response.data;
};
export const getResidentById = async (id: number) => {
  const response = await axiosInstance.get(`/residents/${id}`);
  return response.data.data as ResidentDetail;
};
