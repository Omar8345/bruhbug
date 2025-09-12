import { useState, useCallback } from "react";
import {
  functions,
  ID,
  FUNCTION_ID,
  DATABASE_ID,
  BUGS_COLLECTION_ID,
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

      try {
        await functions.createExecution(
          FUNCTION_ID,
          JSON.stringify({
            bugDescription: submission.description,
            documentId: documentId,
          }),
          true
        );

        const unsubscribe = client.subscribe(
          `databases.${DATABASE_ID}.tables.${BUGS_COLLECTION_ID}.rows.${documentId}.create`,
          (response) => {
            const doc = response.payload as AIProcessingResult;
            if (doc.roast && doc.roast.trim()) {
              setResult({ documentId, roast: doc.roast });
              setIsProcessing(false);
              if (onSuccess) onSuccess();
            }
          }
        );

        return () => unsubscribe();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process bug");
        setIsProcessing(false);
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
