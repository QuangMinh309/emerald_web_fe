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
import { DatePicker } from "@/components/common/DatePicker";
import { useGetResidentById, useUpdateResident } from "@/hooks/data/useResidents";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { address } from "@/lib/address";
import { Label } from "@/components/ui/label";
import { GenderTypeOptions } from "@/constants/genderType";
import { UploadImages } from "@/components/common/UploadImages";

interface UpdateModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  residentId?: number | undefined;
}

const UpdateResidentSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  citizenId: z.string().min(1, "Vui lòng nhập CCCD"),
  dob: z.date({
    message: "Vui lòng chọn ngày sinh",
  }),
  gender: z.string().min(1, "Vui lòng chọn giới tính"),
  phoneNumber: z.string().min(1, "Vui lòng nhập số điện thoại"),
  nationality: z.string().min(1, "Vui lòng nhập quốc tịch"),
  ward: z.string().min(1, "Vui lòng nhập phường/xã"),
  district: z.string().min(1, "Vui lòng nhập quận/huyện"),
  province: z.string().min(1, "Vui lòng nhập tỉnh/thành phố"),
  detailAddress: z.string().optional(),
  image: z.instanceof(File).optional(),
});

type ResidentFormValues = z.infer<typeof UpdateResidentSchema>;

const UpdateResidentModal = ({ open, setOpen, residentId }: UpdateModalProps) => {
  const { data: resident } = useGetResidentById(residentId!);
  const { mutate: updateResident, isPending } = useUpdateResident();
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");

  const form = useForm<ResidentFormValues>({
    resolver: zodResolver(UpdateResidentSchema),
    defaultValues: {
      email: "",
      fullName: "",
      citizenId: "",
      dob: undefined,
      gender: "",
      phoneNumber: "",
      nationality: "",
      ward: "",
      district: "",
      province: "",
    },
  });

  // Cập nhật giá trị form khi prop `resident` thay đổi
  useEffect(() => {
    if (resident && open) {
      form.reset({
        email: resident.account.email,
        fullName: resident.fullName,
        citizenId: resident.citizenId,
        dob: new Date(resident.dob),
        gender: resident.gender,
        phoneNumber: resident.phoneNumber,
        nationality: resident.nationality,
        ward: resident.ward,
        district: resident.district,
        province: resident.province,
        detailAddress: resident.detailAddress ?? undefined,
      });
      setExistingImageUrl(resident.imageUrl || "");
    }
  }, [resident, open, form]);

  const handleClose = () => {
    setOpen(false);
    form.reset();
    setExistingImageUrl("");
  };

  function onSubmit(values: ResidentFormValues) {
    if (!resident?.id) return;

    updateResident(
      {
        id: resident.id,
        residentData: {
          fullName: values.fullName,
          citizenId: values.citizenId,
          dob: values.dob.toISOString(),
          gender: values.gender,
          phoneNumber: values.phoneNumber,
          nationality: values.nationality,
          ward: values.ward,
          district: values.district,
          province: values.province,
          image: values.image,
          detailAddress: values.detailAddress,
        },
      },
      {
        onSuccess: () => {
          toast.success("Cập nhật cư dân thành công");
          handleClose();
        },
        onError: (error: any) => {
          toast.error(`Lỗi cập nhật: ${error.message}`);
        },
      },
    );
  }
  const selectedProvince = form.watch("province");
  const selectedDistrict = form.watch("district");

  const provinces = address;

  const districts = address.find((p) => p.province === selectedProvince)?.districts || [];

  const communes = districts.find((d) => d.district === selectedDistrict)?.communes || [];
  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Chỉnh sửa cư dân"
      submitText="Lưu thay đổi"
      onSubmit={form.handleSubmit(onSubmit)}
      onLoading={isPending}
    >
      <Form {...form}>
        <form className="space-y-4">
          {/* Ảnh đại diện */}
          <UploadImages
            existingUrls={existingImageUrl ? [existingImageUrl] : []}
            files={
              form.watch("image")
                ? [form.watch("image")].filter((f): f is File => f !== undefined)
                : []
            }
            onChange={(files) => form.setValue("image", files[0])}
            onRemoveExisting={() => setExistingImageUrl("")}
            isRequired={false}
            maxImages={1}
          />

          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {/* Email */}
            <FormField
              disabled={true}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel isRequired>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập email" type="email" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Họ và tên */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel isRequired>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ và tên" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* CCCD */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="citizenId"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel isRequired>CCCD</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số CCCD" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Ngày sinh */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel isRequired>Ngày sinh</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Giới tính */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel isRequired>Giới tính</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GenderTypeOptions.map((option) => (
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

            {/* Số điện thoại */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel isRequired>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Quốc tịch */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel isRequired>Quốc tịch</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập quốc tịch" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Tỉnh / Thành phố</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("district", "");
                      form.setValue("ward", "");
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tỉnh" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((p) => (
                        <SelectItem key={p.province} value={p.province}>
                          {p.province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Quận / Huyện</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("ward", "");
                    }}
                    disabled={!selectedProvince}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn quận / huyện" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districts.map((d) => (
                        <SelectItem key={d.district} value={d.district}>
                          {d.district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Phường / Xã</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!selectedDistrict}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phường / xã" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {communes.map((c) => (
                        <SelectItem key={c.commune} value={c.commune}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isPending}
              control={form.control}
              name="detailAddress"
              render={({ field }) => (
                <FormItem className="space-y-1.5  col-span-2">
                  <FormLabel>Địa chỉ chi tiết</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ chi tiết" {...field} />
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

export default UpdateResidentModal;
