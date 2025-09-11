export interface DiaryEntry {
  id: string;
  userId?: string;
  error: string;
  roast?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CreateEntryRequest {
  title: string;
  error: string;
  isPublic: boolean;
}
