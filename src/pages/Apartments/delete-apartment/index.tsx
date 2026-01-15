import PopConfirm from "@/components/common/PopConfirm";
import { useDeleteApartment } from "@/hooks/data/useApartments";
import type { Apartment } from "@/types/apartment";
import { toast } from "sonner";

interface DeleteApartmentProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  selectedApartment: Apartment | undefined;
}

const DeleteApartment = ({ open, setOpen, selectedApartment }: DeleteApartmentProps) => {
  const { mutate: deleteApartment } = useDeleteApartment();

  const handleDelete = () => {
    if (!selectedApartment?.id) return;

    deleteApartment(selectedApartment.id, {
      onSuccess: () => {
        toast.success("Căn hộ đã được xóa thành công");
        setOpen(false);
      },
      onError: (error) => {
        toast.error(`Lỗi: ${error.message}`);
      },
    });
  };

  return (
    <PopConfirm title="Xác nhận xóa" open={open} setOpen={setOpen} handleConfirm={handleDelete}>
      <p>
        Bạn có chắc chắn muốn xóa căn hộ{" "}
        <span className="font-semibold">"{selectedApartment?.roomName}"</span> không?
      </p>
    </PopConfirm>
  );
};

export default DeleteApartment;
