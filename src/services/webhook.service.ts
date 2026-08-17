import { apiFetch, ApiResponse } from './api.service';

export interface WebhookConfig {
  webhookId: number;
  webhookUrl: string;
  events: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'PAUSED';
  failureCount: number;
  lastTriggeredAt: string | null;
  lastResponseCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookLog {
  logId: number;
  webhookId: number;
  event: string;
  payload: any;
  responseStatusCode: number | null;
  responseBody: any;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  retryCount: number;
  createdAt: string;
}

export const getWebhooks = async (): Promise<ApiResponse<WebhookConfig[]>> => {
  return await apiFetch('/webhook/get-webhook', {
    method: 'GET',
  });
};

export const createWebhook = async (webhookUrl: string, events: string[]): Promise<ApiResponse> => {
  return await apiFetch('/webhook/create-webhook', {
    method: 'POST',
    body: JSON.stringify({ webhookUrl, events }),
  });
};

export const updateWebhook = async (id: number | string, data: { status?: string, webhookUrl?: string, events?: string[] }): Promise<ApiResponse> => {
  return await apiFetch(`/webhook/update-webhook/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteWebhook = async (id: number | string): Promise<ApiResponse> => {
  return await apiFetch(`/webhook/delete-webhook/${id}`, {
    method: 'DELETE',
  });
};

export const getWebhookLogs = async (limit: number = 20, offset: number = 0): Promise<ApiResponse<WebhookLog[]>> => {
  return await apiFetch(`/webhook/logs?limit=${limit}&offset=${offset}`, {
    method: 'GET',
  });
};

export const retryWebhook = async (logId: number | string): Promise<ApiResponse> => {
  return await apiFetch(`/webhook/retry/${logId}`, {
    method: 'POST',
  });
};
