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
import { useCreateInvoice } from "@/hooks/data/useInvoices";
import { useApartments } from "@/hooks/data/useApartments";
import { toast } from "sonner";
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

interface ModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

// 1. Schema với thông báo lỗi thân thiện
const CreateInvoiceSchema = z.object({
  apartmentId: z.string().min(1, "Vui lòng chọn căn hộ"),
  period: z.date({
    message: "Vui lòng nhập kỳ thanh toán (YYYY-MM)",
  }),
  waterIndex: z.number().min(0, "Chỉ số nước phải >= 0"),
  electricityIndex: z.number().min(0, "Chỉ số điện phải >= 0"),
});

type InvoiceFormValues = z.infer<typeof CreateInvoiceSchema>;

const CreateInvoiceModal = ({ open, setOpen }: ModalProps) => {
  const { data: apartments } = useApartments();
  const { mutate: createInvoice, isPending } = useCreateInvoice();

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(CreateInvoiceSchema),
    defaultValues: {
      apartmentId: "",
      period: undefined,
      waterIndex: 0,
      electricityIndex: 0,
    },
  });

  function onSubmit(values: InvoiceFormValues) {
    // Convert period from YYYY-MM to ISO date (first day of month)
    const periodDate = new Date(`${values.period}-01`).toISOString();

    createInvoice(
      {
        apartmentId: Number(values.apartmentId),
        period: periodDate,
        waterIndex: values.waterIndex,
        electricityIndex: values.electricityIndex,
      },
      {
        onSuccess: () => {
          toast.success("Hóa đơn đã được tạo thành công");
          handleClose();
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message}`);
        },
      },
    );
  }

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };
  const apartmentOptions = apartments?.map((item) => ({
    value: item.id.toString(),
    label: `${item.roomName} - ${item.block}`,
  }));
  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Tạo hóa đơn mới"
      submitText="Tạo mới"
      onLoading={isPending}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
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
                      type="number"
                      placeholder="Nhập chỉ số điện"
                      {...field}
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

export default CreateInvoiceModal;
