import PopConfirm from "@/components/common/PopConfirm";
import { useDeleteBlock } from "@/hooks/data/useBlocks";

import type { BlockDetail } from "@/types/block";
import { toast } from "sonner";

interface DeleteBlockProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  seclectedBlock: BlockDetail | undefined;
}

const DeleteBlock = ({ open, setOpen, seclectedBlock }: DeleteBlockProps) => {
  const { mutate: deleteBlock } = useDeleteBlock();

  const handleDelete = () => {
    if (!seclectedBlock?.id) return;

    deleteBlock(seclectedBlock.id, {
      onSuccess: () => {
        toast.success("Khối nhà đã được xóa thành công");
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
        Bạn có chắc chắn muốn xóa khối nhà{" "}
        <span className="font-semibold">"{seclectedBlock?.buildingName}"</span> không?
      </p>
    </PopConfirm>
  );
};

export default DeleteBlock;
