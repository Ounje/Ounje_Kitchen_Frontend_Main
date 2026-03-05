"use client";

import useSWR from 'swr';
import type { Notification } from '@/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useNotifications() {
  const { data, error, isLoading, mutate } = useSWR<{ notifications: Notification[] }>(
    '/api/superadmin/notifications',
    fetcher,
    {
      refreshInterval: 10000, // Poll every 10 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    notifications: data?.notifications ?? [],
    isLoading,
    isError: error,
    refresh: mutate,
  };
}
