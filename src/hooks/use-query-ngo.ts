"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOffers,
  getOfferDetail,
  addOffer,
  updateOfferStatus,
  type OfferQuery,
  type AddOfferInput,
  type UpdateOfferStatusInput,
  getCapacity,
  setCapacity,
  checkCapacityForOffer,
  getPickups,
  schedulePickup,
  updatePickupStatus,
  estimateRoute,
  getDonationHistory,
  exportHistoryCSV,
  getPartners,
  addPartner,
  updatePartner,
  getFeedbackQueue,
  resolveFeedback,
  getNgoNotifications,
  markNotificationRead,
  clearNotifications,
  getNgoImpactInsights,
} from "@/lib/server";

export function useNgoCapacity() {
  const query = useQuery({
    queryKey: ["ngo", "capacity"],
    queryFn: getCapacity,
  });

  // Listen for capacity updates
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleUpdate = () => query.refetch();
    window.addEventListener("ngoCapacityUpdated", handleUpdate);
    return () => window.removeEventListener("ngoCapacityUpdated", handleUpdate);
  }, [query]);

  return query;
}

export function useUpdateNgoCapacity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setCapacity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ngo", "capacity"] });
      queryClient.refetchQueries({ queryKey: ["ngo", "capacity"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('ngoCapacityUpdated'));
      }
    },
  });
}

export function useCapacityCheck() {
  return useMutation({
    mutationFn: checkCapacityForOffer,
  });
}

export function useNgoOffers(query?: OfferQuery) {
  const hookQuery = useQuery({
    queryKey: ["ngo", "offers", query],
    queryFn: () => getOffers(query),
  });

  // Listen for offer updates
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleUpdate = () => hookQuery.refetch();
    window.addEventListener("ngoOffersUpdated", handleUpdate);
    return () => window.removeEventListener("ngoOffersUpdated", handleUpdate);
  }, [hookQuery]);

  return hookQuery;
}

export function useNgoOffer(offerId?: string) {
  return useQuery({
    enabled: Boolean(offerId),
    queryKey: ["ngo", "offers", offerId],
    queryFn: () => (offerId ? getOfferDetail(offerId) : null),
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddOfferInput) => addOffer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ngo", "offers"] });
      queryClient.refetchQueries({ queryKey: ["ngo", "offers"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('ngoOffersUpdated'));
      }
    },
  });
}

export function useOfferStatusUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ offerId, data }: { offerId: string; data: UpdateOfferStatusInput }) =>
      updateOfferStatus(offerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ngo", "offers"] });
      queryClient.invalidateQueries({ queryKey: ["ngo", "offers", variables.offerId] });
      queryClient.refetchQueries({ queryKey: ["ngo", "offers"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('ngoOffersUpdated'));
      }
    },
  });
}

export function useNgoPickups(range?: { start?: string; end?: string }) {
  const query = useQuery({
    queryKey: ["ngo", "pickups", range],
    queryFn: () => getPickups(range),
  });

  // Listen for pickup updates
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleUpdate = () => query.refetch();
    window.addEventListener("ngoPickupsUpdated", handleUpdate);
    window.addEventListener("ngoOffersUpdated", handleUpdate); // Pickups depend on offers
    return () => {
      window.removeEventListener("ngoPickupsUpdated", handleUpdate);
      window.removeEventListener("ngoOffersUpdated", handleUpdate);
    };
  }, [query]);

  return query;
}

export function useSchedulePickup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: schedulePickup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ngo", "pickups"] });
      queryClient.invalidateQueries({ queryKey: ["ngo", "offers"] });
      queryClient.refetchQueries({ queryKey: ["ngo", "pickups"] });
      queryClient.refetchQueries({ queryKey: ["ngo", "offers"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('ngoPickupsUpdated'));
        window.dispatchEvent(new CustomEvent('ngoOffersUpdated'));
      }
    },
  });
}

export function usePickupStatusUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pickupId, status }: { pickupId: string; status: Parameters<typeof updatePickupStatus>[1] }) =>
      updatePickupStatus(pickupId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ngo", "pickups"] });
      queryClient.invalidateQueries({ queryKey: ["ngo", "offers"] });
      queryClient.refetchQueries({ queryKey: ["ngo", "pickups"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('ngoPickupsUpdated'));
      }
    },
  });
}

export function useRouteEstimate() {
  return useMutation({
    mutationFn: estimateRoute,
  });
}

export function useNgoHistory(filters?: Parameters<typeof getDonationHistory>[0]) {
  const query = useQuery({
    queryKey: ["ngo", "history", filters],
    queryFn: () => getDonationHistory(filters),
  });

  // Listen for history updates
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleUpdate = () => query.refetch();
    window.addEventListener("ngoPickupsUpdated", handleUpdate);
    window.addEventListener("ngoOffersUpdated", handleUpdate);
    return () => {
      window.removeEventListener("ngoPickupsUpdated", handleUpdate);
      window.removeEventListener("ngoOffersUpdated", handleUpdate);
    };
  }, [query]);

  return query;
}

export function useExportHistory() {
  return useMutation({
    mutationFn: exportHistoryCSV,
  });
}

export function useNgoPartners() {
  const query = useQuery({
    queryKey: ["ngo", "partners"],
    queryFn: getPartners,
  });

  // Listen for partner updates
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleUpdate = () => query.refetch();
    window.addEventListener("ngoPartnersUpdated", handleUpdate);
    return () => window.removeEventListener("ngoPartnersUpdated", handleUpdate);
  }, [query]);

  return query;
}

export function usePartnerMutations() {
  const queryClient = useQueryClient();
  const addMutation = useMutation({
    mutationFn: addPartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ngo", "partners"] });
      queryClient.refetchQueries({ queryKey: ["ngo", "partners"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('ngoPartnersUpdated'));
      }
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updatePartner>[1] }) =>
      updatePartner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ngo", "partners"] });
      queryClient.refetchQueries({ queryKey: ["ngo", "partners"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('ngoPartnersUpdated'));
      }
    },
  });
  return { addMutation, updateMutation };
}

export function useFeedbackQueue() {
  const query = useQuery({
    queryKey: ["ngo", "feedback"],
    queryFn: getFeedbackQueue,
  });

  // Listen for feedback updates
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleUpdate = () => query.refetch();
    window.addEventListener("ngoFeedbackUpdated", handleUpdate);
    return () => window.removeEventListener("ngoFeedbackUpdated", handleUpdate);
  }, [query]);

  return query;
}

export function useFeedbackAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: Parameters<typeof resolveFeedback>[1] }) =>
      resolveFeedback(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ngo", "feedback"] });
      queryClient.refetchQueries({ queryKey: ["ngo", "feedback"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('ngoFeedbackUpdated'));
      }
    },
  });
}

export function useNgoNotifications() {
  return useQuery({
    queryKey: ["ngo", "notifications"],
    queryFn: getNgoNotifications,
  });
}

export function useNotificationActions() {
  const queryClient = useQueryClient();
  const markMutation = useMutation({
    mutationFn: ({ id, read }: { id: string; read?: boolean }) => markNotificationRead(id, read),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ngo", "notifications"] }),
  });
  const clearMutation = useMutation({
    mutationFn: clearNotifications,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ngo", "notifications"] }),
  });
  return { markMutation, clearMutation };
}

export function useNgoImpactInsights() {
  return useQuery({
    queryKey: ["ngo", "impact-insights"],
    queryFn: getNgoImpactInsights,
  });
}


