import { apiFetch, ApiResponse } from './api.service';

export const getApiCredentials = async (): Promise<ApiResponse> => {
  return await apiFetch('/api-credentials', {
    method: 'GET',
  });
};

export const regenerateApiCredentials = async (credentialId: string | number): Promise<ApiResponse> => {
  return await apiFetch(`/api-credentials/regenerate/${credentialId}`, {
    method: 'POST',
  });
};

export const updateApiStatus = async (credentialId: string | number, status: string): Promise<ApiResponse> => {
  return await apiFetch(`/api-credentials/status/${credentialId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

export const getWhitelistIps = async (credentialId: string | number): Promise<ApiResponse> => {
  return await apiFetch(`/api-whitelist/${credentialId}`, {
    method: 'GET',
  });
};

export const addIpToWhitelist = async (credentialId: string | number, ipAddress: string, label?: string): Promise<ApiResponse> => {
  return await apiFetch(`/api-whitelist/${credentialId}`, {
    method: 'POST',
    body: JSON.stringify({ ipAddress, label }),
  });
};

export const deleteIpFromWhitelist = async (whitelistId: string | number): Promise<ApiResponse> => {
  return await apiFetch(`/api-whitelist/delete/${whitelistId}`, {
    method: 'DELETE',
  });
};
