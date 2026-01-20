"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/common/Modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import type { InvoiceDetail } from "@/types/invoice";
import { useVerifyInvoice, useGetInvoiceDetailMadeByClient } from "@/hooks/data/useInvoices";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Info } from "@/pages/Invoices/detail-invoice";

interface VerifyInvoiceModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  invoice: InvoiceDetail | null;
}

/* ================= Schema ================= */

const VerifyInvoiceSchema = z.object({
  waterIndex: z.number().min(0, "Chỉ số nước phải >= 0"),
  electricityIndex: z.number().min(0, "Chỉ số điện phải >= 0"),
});

type VerifyInvoiceFormValues = z.infer<typeof VerifyInvoiceSchema>;

/* ================= Component ================= */

const VerifyInvoiceModal = ({ open, setOpen, invoice }: VerifyInvoiceModalProps) => {
  const { mutate: verifyInvoice, isPending } = useVerifyInvoice();
  const [fullInvoiceDetails, setFullInvoiceDetails] = useState<any>(null);

  // Fetch full invoice details if it's a client invoice
  const { data: clientInvoiceData, isLoading: isLoadingClientDetails } =
    useGetInvoiceDetailMadeByClient(open && invoice?.imageUrl ? invoice.id : -1);

  const form = useForm<VerifyInvoiceFormValues>({
    resolver: zodResolver(VerifyInvoiceSchema),
    defaultValues: {
      waterIndex: 0,
      electricityIndex: 0,
    },
  });

  /* Init form when modal opens */
  useEffect(() => {
    if (open && invoice?.invoiceDetails) {
      // For client invoices, use data from API if available
      const dataToUse = clientInvoiceData || invoice;

      form.reset({
        waterIndex:
          Number(
            dataToUse.invoiceDetails?.find((d: any) => d.feeTypeName === "Tiền nước")?.amount,
          ) || 0,
        electricityIndex:
          Number(
            dataToUse.invoiceDetails?.find((d: any) => d.feeTypeName === "Tiền điện")?.amount,
          ) || 0,
      });

      // Store full details for reference
      if (clientInvoiceData) {
        setFullInvoiceDetails(clientInvoiceData);
      }
    }
  }, [open, invoice, form, clientInvoiceData]);

  const handleClose = () => {
    setOpen(false);
    form.reset();
    setFullInvoiceDetails(null);
  };

  function onSubmit(values: VerifyInvoiceFormValues) {
    if (!invoice?.id) return;

    // Use full details if available (client invoice)
    const detailsToUse = fullInvoiceDetails || invoice;

    const waterIndexId = detailsToUse.invoiceDetails?.find(
      (d: any) => d.feeTypeName === "Tiền nước",
    )?.feeTypeId;
    const electricityIndexId = detailsToUse.invoiceDetails?.find(
      (d: any) => d.feeTypeName === "Tiền điện",
    )?.feeTypeId;

    if (!waterIndexId || !electricityIndexId) {
      toast.error("Không tìm thấy loại phí nước hoặc điện");
      return;
    }

    const data: {
      invoiceId: number;
      meterReadings: {
        feeTypeId: number;
        newIndex: number;
      }[];
    } = {
      invoiceId: invoice.id,
      meterReadings: [
        {
          feeTypeId: waterIndexId,
          newIndex: values.waterIndex,
        },
        {
          feeTypeId: electricityIndexId,
          newIndex: values.electricityIndex,
        },
      ],
    };
    verifyInvoice(data, {
      onSuccess: () => {
        toast.success("Xác nhận chỉ số thành công");
        handleClose();
      },
      onError: (err: any) => {
        toast.error(err?.message || "Có lỗi xảy ra");
      },
    });
  }

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Xác nhận chỉ số hóa đơn"
      submitText="Xác nhận"
      onSubmit={form.handleSubmit(onSubmit)}
      onLoading={isPending || isLoadingClientDetails}
    >
      <Form {...form}>
        <form className="space-y-4">
          {/* Invoice Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 border p-4 rounded-lg bg-gray-50   ">
            <Info label="Mã hóa đơn" value={invoice?.invoiceCode} />
            <Info label="ID căn hộ" value={invoice?.period} />
          </div>

          {/* Ảnh */}
          {invoice?.imageUrl && (
            <div className="space-y-2">
              <Label>Ảnh chỉ số từ người dùng</Label>
              <img
                src={invoice.imageUrl}
                alt="meter"
                className="w-full max-h-80 object-contain border rounded-lg"
              />
            </div>
          )}
          {/* Danh sách chỉ số */}
          <div className="space-y-3">
            {/* Chỉ số nước */}
            <FormField
              disabled={isPending || isLoadingClientDetails}
              control={form.control}
              name="waterIndex"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel isRequired>Chỉ số nước (m³)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập chỉ số nước"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Chỉ số điện */}
            <FormField
              disabled={isPending || isLoadingClientDetails}
              control={form.control}
              name="electricityIndex"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel isRequired>Chỉ số điện (kWh)</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value ?? ""}
                      type="number"
                      placeholder="Nhập chỉ số điện"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default VerifyInvoiceModal;
