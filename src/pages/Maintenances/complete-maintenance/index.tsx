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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompleteMaintenanceTicket } from "@/hooks/data/useMaintenance";
import { toast } from "sonner";
import { MaintenanceResultOptions } from "@/constants/maintenanceResult";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  ticketId?: number;
}

const CompleteMaintenanceSchema = z.object({
  result: z.string().min(1, "Vui lòng chọn kết quả"),
  resultNote: z.string().optional(),
  hasIssue: z.boolean(),
  issueDetail: z.string().optional(),
  materialCost: z.number().optional(),
  laborCost: z.number().optional(),
});

type CompleteFormValues = z.infer<typeof CompleteMaintenanceSchema>;

const CompleteMaintenanceModal = ({ open, setOpen, ticketId }: ModalProps) => {
  const { mutate: completeTicket, isPending } = useCompleteMaintenanceTicket();

  const form = useForm<CompleteFormValues>({
    resolver: zodResolver(CompleteMaintenanceSchema),
    defaultValues: {
      result: "",
      resultNote: "",
      hasIssue: false,
      issueDetail: "",
      materialCost: 0,
      laborCost: 0,
    },
  });

  const hasIssue = form.watch("hasIssue");

  function onSubmit(values: CompleteFormValues) {
    if (!ticketId) return;

    completeTicket(
      {
        id: ticketId,
        data: {
          result: values.result as any,
          resultNote: values.resultNote,
          hasIssue: values.hasIssue,
          issueDetail: values.hasIssue ? values.issueDetail : undefined,
          materialCost: values.materialCost,
          laborCost: values.laborCost,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đã hoàn thành yêu cầu bảo trì");
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

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Hoàn thành bảo trì"
      submitText="Hoàn thành"
      onLoading={isPending}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <form className="space-y-4">
          {/* Kết quả */}
          <FormField
            disabled={isPending}
            control={form.control}
            name="result"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel isRequired>Kết quả bảo trì</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn kết quả" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MaintenanceResultOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Ghi chú kết quả */}
          <FormField
            disabled={isPending}
            control={form.control}
            name="resultNote"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel>Ghi chú kết quả</FormLabel>
                <FormControl>
                  <Textarea placeholder="Nhập ghi chú về kết quả (nếu có)" rows={3} {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Có vấn đề phát sinh */}
          <FormField
            disabled={isPending}
            control={form.control}
            name="hasIssue"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <Checkbox id="hasIssue" checked={field.value} onCheckedChange={field.onChange} />
                  <Label htmlFor="hasIssue" className="cursor-pointer">
                    Có vấn đề phát sinh
                  </Label>
                </div>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Chi tiết vấn đề */}
          {hasIssue && (
            <FormField
              disabled={isPending}
              control={form.control}
              name="issueDetail"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Chi tiết vấn đề</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mô tả chi tiết vấn đề phát sinh" rows={3} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Chi phí vật liệu */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="materialCost"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Chi phí vật liệu (VNĐ)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Chi phí nhân công */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="laborCost"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Chi phí nhân công (VNĐ)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      value={field.value ?? ""}
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

export default CompleteMaintenanceModal;
