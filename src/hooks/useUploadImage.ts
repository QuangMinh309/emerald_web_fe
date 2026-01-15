import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "@/services/upload.service";

export const useUploadImage = () => {
  return useMutation({
    mutationFn: uploadImage,
  });
};
