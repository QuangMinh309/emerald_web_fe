import axiosInstance from "@/lib/axios";
import type { Invoice, InvoiceDetail } from "@/types/invoice";

// nao chi can sua service là xong
export const getInvoices = async () => {
  const response = await axiosInstance.get("/invoices");
  return response.data.data as Invoice[];
};
export const createInvoiceByAdmin = async (data: {
  waterIndex: number;
  electricityIndex: number;
  apartmentId: number;
  period: string;
}) => {
  const response = await axiosInstance.post("/invoices/admin", data);
  return response.data.data as Invoice;
};
export const updateInvoice = async ({
  data,
  id,
}: {
  id: number;
  data: {
    waterIndex: number;
    electricityIndex: number;
    apartmentId: number;
    period: string;
  };
}) => {
  console.log("Updating invoice with data:", data);
  const response = await axiosInstance.patch(`/invoices/${id}`, data);
  return response.data.data as Invoice;
};
export const deleteInvoice = async (id: number) => {
  const response = await axiosInstance.delete(`/invoices/${id}`);
  return response.data.data as Invoice;
};
export const getInvoiceById = async (id: number) => {
  const response = await axiosInstance.get(`/invoices/${id}`);
  return response.data.data as InvoiceDetail;
};
