"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useServerAction(action) {
  const [loading, setLoading] = useState(false);

  const call = useCallback(
    async (...args) => {
      setLoading(true);
      try {
        const result = await action(...args);
        if (result?.success) {
          toast.success(result?.message || "Action completed successfully");
        } else {
          const msg = result?.error || "Something went wrong";
          toast.error(msg);
        }
        return result;
      } catch (err) {
        toast.error(err.message || "Something went wrong");
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [action]
  );

  return { call, loading };
}