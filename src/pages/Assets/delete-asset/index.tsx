import PopConfirm from "@/components/common/PopConfirm";
import { useDeleteAsset } from "@/hooks/data/useAssests";
import type { Asset } from "@/types/asset";
import { toast } from "sonner";
interface DeleteAssetProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  seclectedAsset: Asset | undefined;
}
const DeleteAsset = ({ open, setOpen, seclectedAsset }: DeleteAssetProps) => {
  const { mutate: deleteAsset } = useDeleteAsset();
  const handleDelete = () => {
    deleteAsset(seclectedAsset ? seclectedAsset.id : 0, {
      onSuccess: () => {
        toast.success("Tài sản đã được xóa thành công");
      },
      onError: (error) => {
        toast.error(`Ohh!!! ${error.message}`);
      },
    });
  };
  return (
    <PopConfirm
      title="Xác nhận xóa"
      open={open}
      setOpen={setOpen}
      handleConfirm={() => handleDelete()}
    >
      <p>{`Bạn có chắc chắn muốn xóa tài sản "${seclectedAsset?.name}" không?`}</p>
    </PopConfirm>
  );
};
export default DeleteAsset;
