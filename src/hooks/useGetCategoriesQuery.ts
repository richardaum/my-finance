import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FetchCategoriesReturnType } from "~/types/services";

export const getCategoriesQueryKey = ["entries"] as const;

export function useGetCategoriesQuery(options: { initialData: FetchCategoriesReturnType }) {
  return useQuery({
    queryKey: getCategoriesQueryKey,
    queryFn: async () => {
      const response = await axios.get<FetchCategoriesReturnType>("/api/categories");
      return response.data;
    },
    initialData: options.initialData,
  });
}
