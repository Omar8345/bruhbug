import { useState, useCallback } from "react";
import {
  functions,
  databases,
  ID,
  FUNCTION_ID,
  DATABASE_ID,
  BUGS_COLLECTION_ID,
} from "@/lib/appwrite";
import { useAuth } from "@/contexts/AuthContext";
import type { BugSubmission, AIProcessingResult } from "@/types/bug";

export const useBugAI = (onSuccess?: () => void) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIProcessingResult | null>(null);

  const pollForResult = useCallback(async (documentId: string) => {
    const maxAttempts = 3;
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const document = await databases.getDocument(
          DATABASE_ID,
          BUGS_COLLECTION_ID,
          documentId,
        );

        if (document.roast && document.roast.trim()) {
          return {
            documentId: documentId,
            roast: document.roast,
          };
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
        attempts++;
      } catch (error) {
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    throw new Error(
      "Timeout waiting for AI processing - please try again later",
    );
  }, []);

  const submitBug = useCallback(
    async (submission: BugSubmission) => {
      if (!user) {
        throw new Error("You must be logged in to submit bugs");
      }

      setIsProcessing(true);
      setError(null);
      setResult(null);

      try {
        const documentId = ID.unique();

        await functions.createExecution(
          FUNCTION_ID,
          JSON.stringify({
            bugDescription: submission.description,
            documentId: documentId,
          }),
          true,
        );

        await new Promise((resolve) => setTimeout(resolve, 3000));

        const pollingResult = await pollForResult(documentId);

        setResult(pollingResult);

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to process bug",
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [user, pollForResult, onSuccess],
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
