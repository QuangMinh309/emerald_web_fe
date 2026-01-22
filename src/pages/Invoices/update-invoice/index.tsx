"use client";

import { Modal } from "@/components/common/Modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Input } from "@/components/ui/input";
import { useGetInvoiceById, useUpdateInvoice } from "@/hooks/data/useInvoices";
import { useApartments } from "@/hooks/data/useApartments";
import { toast } from "sonner";
import { useEffect } from "react";
import { DatePicker } from "@/components/common/DatePicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check } from "lucide-react";

interface UpdateModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  invoiceId?: number | undefined;
}

const UpdateInvoiceSchema = z.object({
  apartmentId: z.string().min(1, "Vui lòng chọn căn hộ"),
  period: z.date({
    message: "Vui lòng nhập kỳ thanh toán (YYYY-MM)",
  }),
  waterIndex: z.number().min(0, "Chỉ số nước phải >= 0"),
  electricityIndex: z.number().min(0, "Chỉ số điện phải >= 0"),
});

type InvoiceFormValues = z.infer<typeof UpdateInvoiceSchema>;

const UpdateInvoiceModal = ({ open, setOpen, invoiceId }: UpdateModalProps) => {
  const { data: invoice } = useGetInvoiceById(invoiceId!);
  const { data: apartments } = useApartments();
  const { mutate: updateInvoice, isPending } = useUpdateInvoice();

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(UpdateInvoiceSchema),
    defaultValues: {
      apartmentId: "",
      period: undefined,
      waterIndex: 0,
      electricityIndex: 0,
    },
  });

  // Cập nhật giá trị form khi prop `invoice` thay đổi
  useEffect(() => {
    if (invoice && open) {
      // Convert ISO date to YYYY-MM format
      const periodDate = new Date(invoice.period);
      const periodString = `${periodDate.getFullYear()}-${String(
        periodDate.getMonth() + 1,
      ).padStart(2, "0")}`;
      const waterIndex =
        invoice.invoiceDetails.find((d) => d.feeTypeName === "Tiền nước")?.amount || 0;
      const electricityIndex =
        invoice.invoiceDetails.find((d) => d.feeTypeName === "Tiền điện")?.amount || 0;
      form.reset({
        apartmentId: invoice.apartmentId.toString(),
        period: new Date(periodString),
        waterIndex: Number(waterIndex), // Backend doesn't return these values
        electricityIndex: Number(electricityIndex),
      });
    }
  }, [invoice, open, form]);

  const apartmentOptions = apartments?.map((item) => ({
    value: item.id.toString(),
    label: `${item.roomName} - ${item.block}`,
  }));

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  function onSubmit(values: InvoiceFormValues) {
    if (!invoice?.id) return;

    // Convert period from YYYY-MM to ISO date
    const periodDate = new Date(`${values.period}-01`).toISOString();

    updateInvoice(
      {
        id: invoice.id,
        data: {
          apartmentId: Number(values.apartmentId),
          period: periodDate,
          waterIndex: values.waterIndex,
          electricityIndex: values.electricityIndex,
        },
      },
      {
        onSuccess: () => {
          toast.success("Cập nhật hóa đơn thành công");
          handleClose();
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Lỗi cập nhật hóa đơn");
        },
      },
    );
  }

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Chỉnh sửa hóa đơn"
      submitText="Lưu thay đổi"
      onSubmit={form.handleSubmit(onSubmit)}
      onLoading={isPending}
    >
      <Form {...form}>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {/* Căn hộ */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="apartmentId"
              render={({ field }) => {
                const selectedOwner = apartmentOptions?.find((r) => r.value === field.value);

                return (
                  <FormItem className="space-y-1.5">
                    <FormLabel isRequired>Căn hộ</FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between font-normal"
                          >
                            {selectedOwner ? selectedOwner.label : "Chọn căn hộ"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent className="p-0 w-full">
                        <Command>
                          <CommandInput placeholder="Tìm căn hộ..." />
                          <CommandList>
                            <CommandEmpty>Không tìm thấy căn hộ</CommandEmpty>
                            <CommandGroup>
                              {apartmentOptions?.map((resident) => (
                                <CommandItem
                                  key={resident.value}
                                  value={resident.label} // 👈 dùng label để search
                                  onSelect={() => {
                                    field.onChange(resident.value); // vẫn lưu id
                                  }}
                                >
                                  {resident.label}
                                  {field.value === resident.value && (
                                    <Check className="ml-auto h-4 w-4 opacity-50" />
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage className="text-xs" />
                  </FormItem>
                );
              }}
            />

            {/* Kỳ thanh toán */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel isRequired>Kỳ thanh toán</FormLabel>
                  <FormControl>
                    <DatePicker type="month" value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

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

export default UpdateInvoiceModal;
