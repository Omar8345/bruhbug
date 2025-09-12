import { useState, useCallback } from "react";
import {
  functions,
  ID,
  FUNCTION_ID,
  DATABASE_ID,
  BUGS_COLLECTION_ID,
  databases,
} from "@/lib/appwrite";
import { useAuth } from "@/contexts/AuthContext";
import { client } from "@/lib/appwrite";
import type { BugSubmission, AIProcessingResult } from "@/types/bug";

export const useBugAI = (onSuccess?: () => void) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIProcessingResult | null>(null);

  const submitBug = useCallback(
    async (submission: BugSubmission) => {
      if (!user) {
        throw new Error("You must be logged in to submit bugs");
      }

      setIsProcessing(true);
      setError(null);
      setResult(null);

      const documentId = ID.unique();
      let unsubscribe: (() => void) | null = null;
      let pollInterval: NodeJS.Timeout | null = null;
      let timeoutId: NodeJS.Timeout | null = null;

      try {
        unsubscribe = client.subscribe(`rows`, (response) => {
          console.log("Subscription response:", response);
          const doc = response.payload as { $id: string; roast?: string };
          if (doc.$id === documentId && doc.roast && doc.roast.trim()) {
            setResult({ documentId, roast: doc.roast });
            setIsProcessing(false);
            if (pollInterval) clearInterval(pollInterval);
            if (timeoutId) clearTimeout(timeoutId);
            if (onSuccess) onSuccess();
          }
        });

        await functions.createExecution(
          FUNCTION_ID,
          JSON.stringify({
            bugDescription: submission.description,
            documentId: documentId,
          }),
          true
        );

        timeoutId = setTimeout(() => {
          if (pollInterval) clearInterval(pollInterval);
          if (unsubscribe) unsubscribe();
          setError("Processing timeout - please try again");
          setIsProcessing(false);
        }, 10000);

        return () => {
          if (pollInterval) clearInterval(pollInterval);
          if (timeoutId) clearTimeout(timeoutId);
          if (unsubscribe) unsubscribe();
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process bug");
        setIsProcessing(false);
        if (pollInterval) clearInterval(pollInterval);
        if (timeoutId) clearTimeout(timeoutId);
        if (unsubscribe) unsubscribe();
        throw err;
      }
    },
    [user, onSuccess]
  );

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
    setIsProcessing(false);
  }, []);

  return {
    submitBug,
    isProcessing,
    error,
    result,
    reset,
  };
};
