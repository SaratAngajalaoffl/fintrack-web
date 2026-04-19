"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CURRENT_USER_QUERY_KEY } from "@/components/hooks/queries/use-get-current-user";
import { bootstrapAdminRequest } from "@/services";

export function useMutateBootstrap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bootstrapAdminRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    },
  });
}
