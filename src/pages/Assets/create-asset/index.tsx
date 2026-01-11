import { Modal } from "@/components/common/Modal";
interface ModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}
const CreateAssetModal = ({ open, setOpen }: ModalProps) => {
  return (
    <Modal open={open} setOpen={setOpen} title="Tạo tài sản mới" submitText="Tạo mới">
      <div className="bg-slate-100 w-[400px]"></div>
    </Modal>
  );
};
export default CreateAssetModal;
