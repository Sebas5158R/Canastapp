export interface OfflineQueueItem {

  id: string;

  endpoint: string;

  method:
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE';

  body?: any;

  createdAt: number;
}