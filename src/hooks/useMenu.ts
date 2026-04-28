import useSWR from 'swr';
import { fetchMenuItems } from '../lib/api';

export function useMenu(cafeId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    cafeId ? `/menu?cafeId=${cafeId}` : null,
    () => fetchMenuItems(cafeId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute cache
      staleTime: 30000,
    }
  );

  return {
    menu: data || [],
    isLoading,
    isError: error,
    refreshMenu: mutate
  };
}
