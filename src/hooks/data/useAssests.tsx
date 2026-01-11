import { getAssets } from "@/services/assests.service";
import { useQuery } from "@tanstack/react-query";

export const useAssets = () => {
  return useQuery({
    queryKey: ["assets"],
    queryFn: getAssets,
  });
};
