import PopConfirm from "@/components/common/PopConfirm";
import { useDeleteService } from "@/hooks/data/useServices";
import type { Service } from "@/types/service";
import { toast } from "sonner";

interface DeleteServiceProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  selectedService: Service | undefined;
}

const DeleteService = ({ open, setOpen, selectedService }: DeleteServiceProps) => {
  const { mutate: deleteService } = useDeleteService();

  const handleDelete = () => {
    deleteService(selectedService ? selectedService.id : 0, {
      onSuccess: () => {
        toast.success("Dịch vụ đã được xóa thành công");
        setOpen(false);
      },
      onError: (error: any) => {
        toast.error(`Ohh!!! ${error?.message ?? "Có lỗi xảy ra"}`);
      },
    });
  };

  return (
    <PopConfirm title="Xác nhận xóa" open={open} setOpen={setOpen} handleConfirm={handleDelete}>
      <p>{`Bạn có chắc chắn muốn xóa dịch vụ "${selectedService?.name}" không?`}</p>
    </PopConfirm>
  );
};

export default DeleteService;
