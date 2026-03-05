// app/operations/riders/hooks/useRiders.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { riderService, type RiderFilters } from '@/lib/api/services/rider.service';
import { toast } from 'sonner';

/**
 * Hook to fetch paginated riders list
 */
export function useRiders(filters: RiderFilters) {
  return useQuery({
    queryKey: ['riders', filters],
    queryFn: () => riderService.getRiders(filters),
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to fetch top performers
 */
export function useTopPerformers() {
  return useQuery({
    queryKey: ['riders', 'top-performers'],
    queryFn: () => riderService.getTopPerformers(),
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook to fetch single rider
 */
export function useRider(id: string) {
  return useQuery({
    queryKey: ['riders', id],
    queryFn: () => riderService.getRiderById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch rider document
 */
export function useRiderDocument(id: string) {
  return useQuery({
    queryKey: ['riders', id, 'document'],
    queryFn: () => riderService.getRiderDocument(id),
    enabled: !!id,
  });
}

/**
 * Hook to suspend rider
 */
export function useSuspendRider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (riderId: string) => riderService.suspendRider(riderId),
    onSuccess: (_, riderId) => {
      queryClient.invalidateQueries({ queryKey: ['riders'] });
      queryClient.invalidateQueries({ queryKey: ['riders', riderId] });
      toast.success('Rider suspended successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to suspend rider');
    },
  });
}

/**
 * Hook to activate rider
 */
export function useActivateRider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (riderId: string) => riderService.activateRider(riderId),
    onSuccess: (_, riderId) => {
      queryClient.invalidateQueries({ queryKey: ['riders'] });
      queryClient.invalidateQueries({ queryKey: ['riders', riderId] });
      toast.success('Rider activated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to activate rider');
    },
  });
}

/**
 * Hook to delete rider
 */
export function useDeleteRider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (riderId: string) => riderService.deleteRider(riderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riders'] });
      toast.success('Rider deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete rider');
    },
  });
}