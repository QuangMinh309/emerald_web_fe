"use client";

import { useEffect } from "react";
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
import { useVerifyInvoice } from "@/hooks/data/useInvoices";
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
      form.reset({
        waterIndex:
          Number(invoice.invoiceDetails.find((d) => d.feeTypeName === "Tiền nước")?.amount) || 0,
        electricityIndex:
          Number(invoice.invoiceDetails.find((d) => d.feeTypeName === "Tiền điện")?.amount) || 0,
      });
    }
  }, [open, invoice, form]);

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  function onSubmit(values: VerifyInvoiceFormValues) {
    if (!invoice?.id) return;
    const waterIndexId = invoice.invoiceDetails.find(
      (d) => d.feeTypeName === "Tiền nước",
    )?.feeTypeId;
    const electricityIndexId = invoice.invoiceDetails.find(
      (d) => d.feeTypeName === "Tiền điện",
    )?.feeTypeId;

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
          feeTypeId: waterIndexId!,
          newIndex: values.waterIndex,
        },
        {
          feeTypeId: electricityIndexId!,
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
      onLoading={isPending}
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
              disabled={isPending}
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
              disabled={isPending}
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
