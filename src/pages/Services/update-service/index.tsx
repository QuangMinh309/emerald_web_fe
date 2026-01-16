"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, z } from "zod";
import { toast } from "sonner";

import type { ServiceType } from "@/types/service";
import { useGetServiceById, useUpdateService } from "@/hooks/data/useServices";

import { UploadImages } from "@/components/common/UploadImages";
import { useUploadImage } from "@/hooks/useUploadImage";

interface UpdateModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  serviceId?: number;
}
const UpdateServiceSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên dịch vụ"),
  description: z.string().optional(),

  unitPrice: z
    .string()
    .min(1, "Vui lòng nhập giá")
    .refine((v) => !Number.isNaN(Number(v)), "Giá không hợp lệ"),

  unitTimeBlock: z.string().min(1, "Vui lòng chọn đơn vị"),

  openHour: z.string().min(1, "Vui lòng chọn giờ mở cửa"),
  closeHour: z.string().min(1, "Vui lòng chọn giờ đóng cửa"),

  totalSlot: z
    .string()
    .min(1, "Vui lòng nhập sức chứa")
    .refine((v) => Number(v) > 0, "Sức chứa phải lớn hơn 0"),

  type: z.string().optional(),
  // status: z.string().min(1, "Vui lòng chọn trạng thái"),
});

type ServiceFormValues = z.infer<typeof UpdateServiceSchema>;

const UpdateServiceModal = ({ open, setOpen, serviceId }: UpdateModalProps) => {
  const { data: service } = useGetServiceById(serviceId);
  const { mutate: updateService, isPending } = useUpdateService();

  const [image, setImage] = useState<File[]>([]);
  const [existingImageUrl, setExistingImageUrl] = useState(service?.imageUrl ?? "");
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(UpdateServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      unitPrice: "",
      unitTimeBlock: "60",
      openHour: "06:00",
      closeHour: "17:00",
      totalSlot: "1",
      type: "NORMAL",
      // status: "active",
      // imageUrl: "",
    },
  });

  useEffect(() => {
    if (open) {
      setImage([]);
      setExistingImageUrl(service?.imageUrl ?? "");
      setRemoveExistingImage(false);
    }
  }, [open, service?.imageUrl]);

  const hourOptions = useMemo(() => {
    const options: { value: string; label: string }[] = [];
    for (let h = 0; h < 24; h++) {
      const hh = String(h).padStart(2, "0");
      options.push({ value: `${hh}:00`, label: `${h}h` });
      options.push({ value: `${hh}:30`, label: `${h}h30` });
    }
    return options;
  }, []);

  const unitOptions = useMemo(
    () => [
      { value: "30", label: "30 phút" },
      { value: "60", label: "60 phút" },
    ],
    [],
  );

  const typeOptions = useMemo(() => {
    const opts: { value: ServiceType; label: string }[] = [
      { value: "NORMAL", label: "Bình thường" },
      { value: "COMMUNITY", label: "Cộng đồng" },
    ];
    return opts;
  }, []);

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  useEffect(() => {
    if (open && service) {
      const normalizeTime = (t?: string) => (t ? t.slice(0, 5) : "");
      form.reset({
        name: service.name ?? "",
        description: service.description ?? "",
        unitPrice: String(service.unitPrice ?? ""),
        unitTimeBlock: String(service.unitTimeBlock ?? "60"),
        openHour: normalizeTime(service.openHour) || "06:00",
        closeHour: normalizeTime(service.closeHour) || "17:00",
        totalSlot: String(service.totalSlot ?? "1"),
        type: (service.type ?? "NORMAL") as ServiceType,
        // status: "active",
        // image: service.imageUrl ?? "",
      });
    }
  }, [open, service, form]);

  async function onSubmit(values: ServiceFormValues) {
    if (!serviceId) return;

  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("description", values.description ?? "");
  formData.append("openHour", values.openHour);
  formData.append("closeHour", values.closeHour);
  formData.append("unitPrice", values.unitPrice);
  formData.append("unitTimeBlock", values.unitTimeBlock);
  formData.append("totalSlot", values.totalSlot);
  formData.append("type", values.type ?? "NORMAL");

  if (image.length > 0) {
    formData.append("image", image[0]);
  }
    updateService(
      {
        id: serviceId,
        payload: formData,
      } as any,
      {
        onSuccess: () => {
          toast.success("Cập nhật dịch vụ thành công");
          handleClose();
        },
        onError: (error: any) => {
          toast.error(`Lỗi cập nhật: ${error?.message ?? "Có lỗi xảy ra"}`);
        },
      },
    );
  }

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Chỉnh sửa dịch vụ"
      submitText="Lưu thay đổi"
      onSubmit={form.handleSubmit(onSubmit)}
      onLoading={isPending}
    >
      <Form {...form}>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {/* Tên dịch vụ */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel isRequired>Tên dịch vụ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên dịch vụ" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Giá */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="unitPrice"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel isRequired>Giá</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="VD: 200000"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Đơn vị (block time) */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="unitTimeBlock"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel isRequired>Đơn vị</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn đơn vị" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unitOptions.map((u) => (
                        <SelectItem key={u.value} value={u.value}>
                          {u.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Loại dịch vụ (AmenityType) */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Loại dịch vụ</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? "NORMAL"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {typeOptions.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Mô tả */}
          <FormField
            disabled={isPending}
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea placeholder="Nhập mô tả..." className="resize-none h-24" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <div className="border-t pt-4" />

          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {/* Giờ mở */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="openHour"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel isRequired>Giờ mở cửa</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giờ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {hourOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Giờ đóng */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="closeHour"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel isRequired>Giờ đóng cửa</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giờ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {hourOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Sức chứa */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="totalSlot"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel isRequired>Sức chứa</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="VD: 100"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

          </div>

          {/* Image URL */}
          <UploadImages
            files={image}
            onChange={(files) => {
              setImage(files);
              if (files.length > 0) {
                setRemoveExistingImage(true);
              }
            }}
            existingUrls={
              existingImageUrl && !removeExistingImage ? [existingImageUrl] : []
            }
            onRemoveExisting={() => setRemoveExistingImage(true)}
            maxImages={1}
          />
        </form>
      </Form>
    </Modal>
  );
};

export default UpdateServiceModal;
