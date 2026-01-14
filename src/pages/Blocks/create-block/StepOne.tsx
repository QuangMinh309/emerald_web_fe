import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { handleStepOne } from "@/store/slices/actionBlockSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileDown } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
export const apartmentTypeOptions = [
  { value: "STUDIO", label: "Studio" },
  { value: "ONE_BEDROOM", label: "Căn hộ 1 phòng ngủ" },
  { value: "TWO_BEDROOM", label: "Căn hộ 2 phòng ngủ" },
  { value: "PENTHOUSE", label: "Penthouse" },
];
const StepOneSchema = z.object({
  buildingName: z.string().min(1, "Vui lòng nhập tên khối nhà"),
  managerName: z.string().min(1, "Vui lòng nhập tên quản lý"),
  managerPhone: z.string().min(1, "Vui lòng nhập số điện thoại"),
  status: z.string().min(1, "Vui lòng nhập trạng thái"),
  totalFloors: z.number().min(1, "Số tầng phải lớn hơn hoặc bằng 1"),
  apartmentsPerFloor: z.number().min(1, "Số căn hộ mỗi tầng phải lớn hơn hoặc bằng 1"),
  areasPerApartment: z.number().min(1, "Diện tích mỗi căn hộ phải lớn hơn hoặc bằng 1"),
  typesOfApartment: z.string().min(1, "Vui lòng nhập loại căn hộ"),
});
type StepOneFormValues = z.infer<typeof StepOneSchema>;
interface StepOneProps {
  setStep: (step: number) => void;
}
const StepOne = ({ setStep }: StepOneProps) => {
  const value = useAppSelector((state) => state.actionBlock);
  const dispatch = useAppDispatch();
  const form = useForm<StepOneFormValues>({
    resolver: zodResolver(StepOneSchema),
    defaultValues: {
      buildingName: "",
      managerName: "",
      managerPhone: "",
      status: "",
      totalFloors: 1,
      apartmentsPerFloor: 1,
      areasPerApartment: 1,
      typesOfApartment: "",
    },
  });
  const onSubmit = (data: StepOneFormValues) => {
    console.log("Step One Data:", data);
    dispatch(handleStepOne(data));
    setStep(2);
    // Xử lý dữ liệu hoặc chuyển sang bước tiếp theo
  };
  useEffect(() => {
    console.log("Giá trị trong Redux thay đổi:", value);
    // Cập nhật giá trị biểu mẫu khi giá trị trong Redux thay đổi
    form.reset({
      buildingName: value.buildingName || "",
      managerName: value.managerName || "",
      managerPhone: value.managerPhone || "",
      status: value.status || "",
      totalFloors: value.totalFloors || 1,
      apartmentsPerFloor: value.apartmentsPerFloor || 1,
      areasPerApartment: value.areasPerApartment || 1,
      typesOfApartment: value.typesOfApartment || "",
    });
  }, [value]);
  return (
    <>
      <div className="bg-white  rounded-lg border border-gray-200 shadow-sm ">
        <Form {...form}>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 p-6">
              <FormField
                control={form.control}
                name="buildingName"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel isRequired>Tên khối nhà</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên khối nhà" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel isRequired>Trạng thái</FormLabel>
                    <Select
                      key={field.value}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="OPERATING">Hoạt động (Operating)</SelectItem>
                        <SelectItem value="UNDER_CONSTRUCTION">
                          Đang xây dựng (Under Construction)
                        </SelectItem>
                        <SelectItem value="UNDER_MAINTENANCE">
                          Đang bảo trì (Under Maintenance)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="managerName"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel isRequired>Tên quản lý</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên quản lý" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="managerPhone"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel isRequired>Số điện thoại quản lý</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Nhập số điện thoại quản lý" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full bg-gray-200 h-[1px]"></div>
            <div className="p-6 pt-2">
              <Label>Danh sách phòng (nhập để tạo danh sách các tầng, phòng)</Label>
              <div className="w-fit cursor-pointer ml-auto flex items-center gap-2 bg-main text-white px-4 py-2 rounded-lg hover:bg-main/90 transition-colors text-sm font-medium">
                <FileDown className="w-4 h-4" /> Import
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="totalFloors"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel isRequired>Tổng số tầng</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập tổng số tầng"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="areasPerApartment"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel isRequired>Diện tích mỗi căn hộ(m²)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập diện tích mỗi căn hộ"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apartmentsPerFloor"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel isRequired>Số căn hộ mỗi tầng</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập số căn hộ mỗi tầng"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="typesOfApartment"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel isRequired>Loại căn hộ</FormLabel>
                      <Select
                        key={field.value}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại căn hộ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {apartmentTypeOptions?.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
      <div className="flex items-center justify-end gap-[10px] mt-4">
        <Button variant="outline" onClick={() => form.reset()}>
          Hủy
        </Button>
        <Button onClick={form.handleSubmit(onSubmit)}>Tiếp theo</Button>
      </div>
    </>
  );
};
// form.handleSubmit(onSubmit);
export default StepOne;
