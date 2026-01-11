import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { LoaderCircle } from "lucide-react";
interface ModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  title: string;
  submitText: string;
  onSubmit?: () => void;
  children: React.ReactNode;
  onLoading?: boolean;
}
export function Modal({
  open,
  setOpen,
  title,
  submitText,
  onSubmit,
  children,
  onLoading = false,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-auto p-0">
        <p className="text-[#244B35] font-bold p-4 pb-0">{title}</p>
        <div className="w-full h-[1px] bg-[#D9D9D9]"></div>
        <div className="px-4 ">{children}</div>
        <div className="w-full h-[0.5px] bg-[#D9D9D9]"></div>
        <DialogFooter className="px-4 pb-4">
          <DialogClose disabled={onLoading} asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button disabled={onLoading} onClick={onSubmit} type="submit">
            {onLoading && <LoaderCircle className="animate-spin" />}
            {submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
