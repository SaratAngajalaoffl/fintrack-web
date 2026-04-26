"use client";

import { useMutation } from "@tanstack/react-query";

import { importAccountDataRequest } from "@/services";

export function useMutateImportAccountData() {
  return useMutation({
    mutationFn: importAccountDataRequest,
  });
}
