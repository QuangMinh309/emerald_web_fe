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

import { useBlocks } from "@/hooks/data/useBlocks";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TicketPriorityOptions } from "@/constants/ticketPriority";
import { Textarea } from "@/components/ui/textarea";
import type { MaintenanceChecklistItem } from "@/types/maintenance";
import { useCompleteIncidentTicket, useMaintenanceTicketDetail } from "@/hooks/data/useMaintenance";

interface UpdateModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  ticketId?: number | undefined;
}

const UpdateMaintenanceSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  description: z.string().optional(),
  priority: z.string().optional(),
  blockId: z.string().min(1, "Vui lòng chọn tòa nhà"),
  floor: z.string().min(1, "Vui lòng chọn tầng"),
  apartmentId: z.string().optional(),
  assetId: z.string().optional(),
});

type MaintenanceFormValues = z.infer<typeof UpdateMaintenanceSchema>;

const UpdateMaintenanceModal = ({ open, setOpen, ticketId }: UpdateModalProps) => {
  const { data: ticket } = useMaintenanceTicketDetail(ticketId!);
  const { data: blocks } = useBlocks();
  const { mutate: updateTicket, isPending } = useCompleteIncidentTicket();

  const [checklistItems, setChecklistItems] = useState<MaintenanceChecklistItem[]>([]);
  const [newTask, setNewTask] = useState("");

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(UpdateMaintenanceSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "",
      blockId: "",
      floor: "",
      apartmentId: "",
      assetId: "",
    },
  });

  useEffect(() => {
    if (ticket && open) {
      form.reset({
        title: ticket.title,
        description: ticket.description || "",
        priority: ticket.priority || "",
        blockId: ticket.blockId.toString(),
        floor: ticket.floor.toString(),
        apartmentId: ticket.apartmentId?.toString() || "",
        assetId: ticket.assetId?.toString() || "",
      });
      setChecklistItems(ticket.checklistItems || []);
    }
  }, [ticket, open, form]);

  const selectedBlockId = form.watch("blockId");

  const buildingOptions = useMemo(
    () =>
      blocks?.map((item) => ({
        value: item.id.toString(),
        label: item.buildingName,
      })) || [],
    [blocks],
  );

  const floorOptions = useMemo(() => {
    if (!selectedBlockId || !blocks) return [];
    const selectedBlock = blocks.find((b) => b.id.toString() === selectedBlockId);
    if (!selectedBlock || !selectedBlock.totalFloors) return [];

    return Array.from({ length: selectedBlock.totalFloors }, (_, i) => ({
      value: (i + 1).toString(),
      label: `Tầng ${i + 1}`,
    }));
  }, [selectedBlockId, blocks]);

  const addChecklistItem = () => {
    if (!newTask.trim()) {
      toast.error("Vui lòng nhập công việc");
      return;
    }
    setChecklistItems([...checklistItems, { task: newTask, isChecked: false }]);
    setNewTask("");
  };

  const removeChecklistItem = (index: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
    setChecklistItems([]);
    setNewTask("");
  };

  function onSubmit(values: MaintenanceFormValues) {
    if (!ticketId) return;

    updateTicket(
      {
        id: ticketId,
        data: {
          title: values.title,
          description: values.description,
          priority: values.priority ? (values.priority as any) : undefined,
          blockId: Number(values.blockId),
          floor: Number(values.floor),
          apartmentId: values.apartmentId ? Number(values.apartmentId) : undefined,
          assetId: values.assetId ? Number(values.assetId) : undefined,
          checklistItems: checklistItems.length > 0 ? checklistItems : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Cập nhật yêu cầu bảo trì thành công");
          handleClose();
        },
        onError: (error: any) => {
          toast.error(`Lỗi cập nhật: ${error.message}`);
        },
      },
    );
  }

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Chỉnh sửa yêu cầu bảo trì"
      submitText="Lưu thay đổi"
      onSubmit={form.handleSubmit(onSubmit)}
      onLoading={isPending}
    >
      <Form {...form}>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {/* Tiêu đề */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-1.5 col-span-2">
                  <FormLabel isRequired>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tiêu đề yêu cầu" {...field} />
                  </FormControl>
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
                  <Select onValueChange={field.onChange} value={field.value}>
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

            {/* Tòa nhà */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="blockId"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel isRequired>Tòa</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tòa" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {buildingOptions.map((building) => (
                        <SelectItem key={building.value} value={building.value}>
                          {building.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Tầng */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="floor"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel isRequired>Tầng</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tầng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {floorOptions.map((floor) => (
                        <SelectItem key={floor.value} value={floor.value}>
                          {floor.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Mô tả */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1.5 col-span-2">
                  <FormLabel>Mô tả chi tiết</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập mô tả chi tiết (nếu có)" rows={3} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Danh sách công việc */}
          <div className="space-y-2">
            <Label>Danh sách công việc</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Nhập công việc cần làm"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addChecklistItem();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addChecklistItem}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {checklistItems.length > 0 && (
              <div className="space-y-2 mt-3">
                {checklistItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input disabled value={item.task} readOnly className="flex-1" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChecklistItem(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default UpdateMaintenanceModal;
