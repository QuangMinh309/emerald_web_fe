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

export const deleteManyInvoices = async (ids: number[]) => {
  const response = await axiosInstance.post(`/invoices/delete-many`, { ids });
  return response.data;
};

export const getInvoiceById = async (id: number) => {
  const response = await axiosInstance.get(`/invoices/${id}`);
  return response.data.data as InvoiceDetail;
};

export const verifyInvoice = async (data: {
  invoiceId: number;
  meterReadings: {
    feeTypeId: number;
    newIndex: number;
  }[];
}) => {
  const response = await axiosInstance.post(`/invoices/verify-invoice-readings`, data);
  return response.data.data as Invoice;
};
export const getInvoicesMadeByClient = async () => {
  const response = await axiosInstance.get("/invoices/made-by-client/list");
  return response.data.data as InvoiceDetail[];
};

export const getInvoiceDetailMadeByClient = async (id: number) => {
  const response = await axiosInstance.get(`/invoices/client-created/${id}`);
  return response.data.data as InvoiceDetail & {
    meterReadings?: Array<{
      id: number;
      feeTypeId: number;
      feeTypeName?: string;
      oldIndex: number;
      newIndex: number;
      imageProofUrl: string | null;
    }>;
  };
};
