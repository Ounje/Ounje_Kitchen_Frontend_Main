// hooks/useRiders.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { riderService, type RiderFilters } from '@/lib/api/services/rider.service';
import { toast } from 'sonner';

/** Paginated riders list */
export function useRiders(filters: RiderFilters) {
  return useQuery({
    queryKey: ['riders', filters],
    queryFn:  () => riderService.getRiders(filters),
    staleTime: 30_000,
  });
}

/** Top 3 performers */
export function useTopPerformers() {
  return useQuery({
    queryKey: ['riders', 'top-performers'],
    queryFn:  () => riderService.getTopPerformers(),
    staleTime: 60_000,
  });
}

/** Single rider detail */
export function useRider(id: string) {
  return useQuery({
    queryKey: ['riders', id],
    queryFn:  () => riderService.getRiderById(id),
    enabled:  !!id,
  });
}

/**
 * Rider document (NIN / drivers licence).
 * No dedicated endpoint — we fetch the full rider and extract the document
 * fields (nin / driversLicense / documentUrl) that the operations
 * riderController populates via `.select("... nin driversLicense ...")`.
 */
export function useRiderDocument(id: string) {
  return useQuery({
    queryKey: ['riders', id, 'document'],
    queryFn:  async () => {
      const rider: any = await riderService.getRiderById(id);
      const documentUrl  = rider?.nin ?? rider?.driversLicense ?? rider?.documentUrl ?? '';
      if (!documentUrl) return null;
      const documentType = documentUrl.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image';
      return { documentUrl, documentType };
    },
    enabled: !!id,
  });
}

/** Suspend rider */
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

/** Activate rider */
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

/** Delete rider */
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