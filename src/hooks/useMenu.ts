import useSWR from 'swr';
import { fetchAllCafes, fetchMenuItems } from '../lib/api';

const fetchMenuData = async () => {
  // 1. Get the first cafe automatically
  const cafes = await fetchAllCafes();
  if (!cafes || cafes.length === 0) {
    throw new Error('No cafe found');
  }
  const cafeId = cafes[0].id;

  // 2. Fetch its menu
  return fetchMenuItems(cafeId);
};

export function useMenu() {
  const { data, error, isLoading, mutate } = useSWR(
    '/menu/auto-fetch',
    fetchMenuData,
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
