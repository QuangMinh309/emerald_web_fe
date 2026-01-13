import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  title: string;
  submitText: string;
  onSubmit?: () => void;
  children: React.ReactNode;
  onLoading?: boolean;
  className?: string;
}

export function Modal({
  open,
  setOpen,
  title,
  submitText,
  onSubmit,
  children,
  onLoading = false,
  className,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn("p-0 gap-0 flex flex-col", "w-full max-w-[600px]", "max-h-[85vh]", className)}
      >
        <div className="p-4 pb-3 border-b border-gray-400">
          <DialogHeader>
            <DialogTitle className="text-[#244B35] font-bold text-lg text-left">
              {title}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">{children}</div>

        <div className="p-4 border-t border-gray-400 bg-gray-50/50 rounded-b-lg">
          <DialogFooter className="gap-2 sm:justify-end">
            <DialogClose disabled={onLoading} asChild>
              <Button variant="outline" type="button">
                Hủy
              </Button>
            </DialogClose>
            <Button
              disabled={onLoading}
              onClick={onSubmit}
              type="submit"
              className="bg-main hover:bg-main/90"
            >
              {onLoading && <LoaderCircle className="animate-spin mr-2 h-4 w-4" />}
              {submitText}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
