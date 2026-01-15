import type { InvoiceStatusType } from "@/constants/invoiceStatus";

export interface Invoice {
  id: number;
  invoiceCode: string;
  apartmentId: number;
  period: string;
  totalAmount: string;
  status: InvoiceStatusType;
  createdAt: string;
  updatedAt: string;
}
export type CalculationBreakdown = {
  [key: string]: string;
};

export interface InvoiceDetail {
  id: number;
  invoiceCode: string;
  apartmentId: number;
  period: string; // ISO date string
  totalAmount: string; // backend trả string
  status: InvoiceStatusType; // có thể mở rộng
  imageUrl: string | null;
  invoiceDetails: {
    id: number;
    feeTypeId: number;
    feeTypeName: string;
    amount: string;
    totalPrice: string;
    unitPrice: string | null;
    calculationBreakdown: CalculationBreakdown | null;
  }[];
  createdAt: string;
  updatedAt: string;
}
