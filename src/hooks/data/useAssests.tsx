import {
  createAsset,
  createAssetType,
  deleteAsset,
  getAssets,
  getAssetTypes,
} from "@/services/assests.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAssets = () => {
  return useQuery({
    queryKey: ["assets"],
    queryFn: getAssets,
  });
};
export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
};

export const useAssetTypes = () => {
  return useQuery({
    queryKey: ["assetTypes"],
    queryFn: getAssetTypes,
  });
};
export const useCreateAssetType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAssetType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assetTypes"] });
    },
  });
};
export const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
};
