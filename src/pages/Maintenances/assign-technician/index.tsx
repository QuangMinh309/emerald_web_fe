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
import { useAssignTechnician } from "@/hooks/data/useMaintenance";
import { toast } from "sonner";
import { TicketPriorityOptions } from "@/constants/ticketPriority";

interface ModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  ticketId?: number;
}

const AssignTechnicianSchema = z.object({
  technicianId: z.string().min(1, "Vui lòng chọn kỹ thuật viên"),
  priority: z.string().optional(),
  assignedDate: z.string().optional(),
});

type AssignFormValues = z.infer<typeof AssignTechnicianSchema>;

const AssignTechnicianModal = ({ open, setOpen, ticketId }: ModalProps) => {
  const { mutate: assignTechnician, isPending } = useAssignTechnician();

  const form = useForm<AssignFormValues>({
    resolver: zodResolver(AssignTechnicianSchema),
    defaultValues: {
      technicianId: "",
      priority: "",
      assignedDate: "",
    },
  });

  // TODO: Lấy danh sách technicians từ API
  // Tạm thời hardcode để demo
  const technicians = [
    { id: 1, name: "Nguyễn Văn A" },
    { id: 2, name: "Trần Văn B" },
    { id: 3, name: "Lê Thị C" },
  ];

  function onSubmit(values: AssignFormValues) {
    if (!ticketId) return;

    assignTechnician(
      {
        id: ticketId,
        data: {
          technicianId: Number(values.technicianId),
          priority: values.priority ? (values.priority as any) : undefined,
          assignedDate: values.assignedDate || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đã giao việc cho kỹ thuật viên thành công");
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
      title="Giao việc cho kỹ thuật viên"
      submitText="Giao việc"
      onLoading={isPending}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <form className="space-y-4">
          {/* Kỹ thuật viên */}
          <FormField
            disabled={isPending}
            control={form.control}
            name="technicianId"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel isRequired>Kỹ thuật viên</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn kỹ thuật viên" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {technicians.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id.toString()}>
                        {tech.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Độ ưu tiên */}
          <FormField
            disabled={isPending}
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel>Độ ưu tiên</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn độ ưu tiên" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TicketPriorityOptions.map((option) => (
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

          {/* Ngày giao việc */}
          <FormField
            disabled={isPending}
            control={form.control}
            name="assignedDate"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel>Ngày giao việc</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Modal>
  );
};

export default AssignTechnicianModal;
