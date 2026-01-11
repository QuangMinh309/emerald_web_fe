import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
interface PopConfirmProps {
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  handleConfirm: () => void;
  submitText?: string;
  children: React.ReactNode;
}
const PopConfirm = ({
  open,
  setOpen,
  handleConfirm,
  title,
  submitText = "Tiếp tục",
  children,
}: PopConfirmProps) => {
  const handleConfirmAction = () => {
    handleConfirm();
    setOpen(false);
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="w-auto p-0">
          <p className="text-[#244B35] font-bold p-4 pb-0">{title}</p>
          <div className="w-full h-[1px] bg-[#D9D9D9]"></div>
          <div className="px-4 ">{children}</div>
          <div className="w-full h-[0.5px] bg-[#D9D9D9]"></div>
          <AlertDialogFooter className="px-4 pb-4">
            {/* 3. AlertDialogCancel sẽ tự động gọi setIsOpen(false) */}
            <AlertDialogCancel>Hủy</AlertDialogCancel>

            {/* Nếu muốn tự xử lý logic rồi mới đóng, dùng Button hoặc onClick vào Action */}
            <AlertDialogAction onClick={handleConfirm}>{submitText}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
export default PopConfirm;
