import { useState, useEffect, useCallback } from "react";
import { databases, DATABASE_ID, BUGS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/contexts/AuthContext";
import { Query } from "appwrite";

export interface DiaryEntry {
  $id: string;
  userId: string;
  username?: string;
  name?: string;
  avatar?: string;
  description: string;
  roast?: string;
  $createdAt: string;
  $updatedAt: string;
}

export const useDiary = () => {
  const { user } = useAuth();
  const [myDiary, setMyDiary] = useState<DiaryEntry[]>([]);
  const [publicFeed, setPublicFeed] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyDiary = useCallback(async () => {
    if (!user) {
      setMyDiary([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await databases.listDocuments(
        DATABASE_ID,
        BUGS_COLLECTION_ID,
        [
          Query.equal("userId", user.$id),
          Query.orderDesc("$createdAt"),
          Query.limit(50),
        ],
      );

      setMyDiary(response.documents as unknown as DiaryEntry[]);
    } catch (error) {
      console.error("Error fetching my diary:", error);
      setError("Failed to load your diary entries");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchPublicFeed = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const queries = [
        Query.orderDesc("$createdAt"),
        Query.limit(50),
        Query.isNotNull("roast"),
      ];

      if (user) {
        queries.push(Query.notEqual("userId", user.$id));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        BUGS_COLLECTION_ID,
        queries,
      );

      setPublicFeed(response.documents as unknown as DiaryEntry[]);
    } catch (error) {
      console.error("Error fetching public feed:", error);
      setError("Failed to load public feed");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const refreshData = useCallback(() => {
    fetchMyDiary();
    fetchPublicFeed();
  }, [fetchMyDiary, fetchPublicFeed]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    myDiary,
    publicFeed,
    isLoading,
    error,
    refreshData,
    fetchMyDiary,
    fetchPublicFeed,
  };
};
