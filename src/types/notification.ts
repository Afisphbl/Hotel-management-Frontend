export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data: any;
  channel: string;
  status: string;
  readAt: string | null;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
}
