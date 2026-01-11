import { getBlocks } from "@/services/blocks.service";
import { useQuery } from "@tanstack/react-query";

export const useBlocks = () => {
  return useQuery({
    queryKey: ["blocks"],
    queryFn: getBlocks,
  });
};
