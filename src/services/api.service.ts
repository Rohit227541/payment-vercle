import { API_BASE_URL } from '../config';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: any;
}

// ==========================================================
// REFRESH STATE
// ==========================================================

let refreshPromise: Promise<string | null> | null = null;

// ==========================================================
// REFRESH ACCESS TOKEN
// ==========================================================

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken =
      localStorage.getItem('refreshToken') ||
      localStorage.getItem('refresh_token');

    if (!refreshToken) {
      console.log(
        'No refresh token available.'
      );

      return null;
    }

    console.log(
      'Refreshing access token...'
    );

    const isAdmin = localStorage.getItem('isAdmin') === 'true' || localStorage.getItem('role') === 'admin' || localStorage.getItem('admin_role') === 'admin';
    const baseUrl = isAdmin ? API_BASE_URL.replace(/\/merchant\/?$/, '') : API_BASE_URL;
    const refreshUrl = isAdmin ? `${baseUrl}/admin/refresh` : `${baseUrl}/refresh`;

    const response = await fetch(
      refreshUrl,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          refreshToken,
        }),
      }
    );

    const data = await response.json();

    console.log(
      'Refresh Response:',
      data
    );

    if (!response.ok) {

      console.log(
        'Refresh failed:',
        data
      );

      return null;
    }

    const newAccessToken =
      data.accessToken;

    const newRefreshToken =
      data.refreshToken;

    if (!newAccessToken) {

      console.log(
        'No new access token received.'
      );

      return null;
    }

    // ======================================================
    // SAVE NEW ACCESS TOKEN
    // ======================================================

    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('token', newAccessToken);
    if (isAdmin) {
      localStorage.setItem('adminToken', newAccessToken);
    }

    // ======================================================
    // SAVE ROTATED REFRESH TOKEN
    // ======================================================

    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
      localStorage.setItem('refresh_token', newRefreshToken);
      if (isAdmin) {
        localStorage.setItem('adminRefreshToken', newRefreshToken);
      }
    }

    console.log(
      'Access token refreshed successfully.'
    );

    return newAccessToken;

  } catch (error) {

    console.log(
      'Refresh token error:',
      error
    );

    return null;
  }
};

// ==========================================================
// API FETCH
// ==========================================================

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {},
  isAdmin: boolean = false
): Promise<ApiResponse<T>> {

  const baseUrl = isAdmin
    ? API_BASE_URL.replace(
        /\/merchant\/?$/,
        ''
      )
    : API_BASE_URL;

  const url =
    endpoint.startsWith('http')
      ? endpoint
      : `${baseUrl}${endpoint}`;

  // ========================================================
  // REQUEST FUNCTION
  // ========================================================

  const makeRequest = async (
    token: string | null
  ) => {

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Don't override custom Content-Type
    if (!headers['Content-Type']) {
      headers['Content-Type'] =
        'application/json';
    }

    if (token) {
      headers['Authorization'] =
        `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  // ========================================================
  // GET CURRENT ACCESS TOKEN
  // ========================================================

  let accessToken =
    localStorage.getItem(
      'accessToken'
    ) ||
    localStorage.getItem(
      'token'
    );

  // ========================================================
  // FIRST REQUEST
  // ========================================================

  let response =
    await makeRequest(accessToken);

  // ========================================================
  // NORMAL RESPONSE
  // ========================================================

  if (response.status !== 401) {

    const data =
      await response.json();

    if (!response.ok) {

      return {
        success: false,

        message:
          data?.message ||
          data?.error ||
          `Request failed with status ${response.status}`,

        data: data?.data,
      };
    }

    return {
      success: true,

      message:
        data?.message,

      data:
        data?.data ?? data,
        
      pagination: data?.pagination,
    };
  }

  // ========================================================
  // 401 ACCESS TOKEN EXPIRED
  // ========================================================

  console.log(
    `401 received for ${endpoint}`
  );

  console.log(
    'Attempting token refresh...'
  );

  // ========================================================
  // ONLY ONE REFRESH REQUEST AT A TIME
  // ========================================================

  if (!refreshPromise) {

    refreshPromise =
      refreshAccessToken()
        .finally(() => {

          refreshPromise = null;

        });
  }

  const newAccessToken =
    await refreshPromise;

  // ========================================================
  // REFRESH FAILED
  // ========================================================

  if (!newAccessToken) {

    console.log(
      'Token refresh failed. Logging out.'
    );

    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refresh_token');

    window.location.href = isAdmin ? '/admin/login' : '/login';

    return {
      success: false,
      message: 'Session expired. Please login again.',
    };
  }

  // ========================================================
  // RETRY ORIGINAL REQUEST
  // ========================================================

  console.log(
    `Retrying ${endpoint} with new access token`
  );

  accessToken =
    newAccessToken;

  response =
    await makeRequest(
      accessToken
    );

  // ========================================================
  // PARSE RETRY RESPONSE
  // ========================================================

  const data =
    await response.json();

  if (!response.ok) {

    return {
      success: false,

      message:
        data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`,

      data: data?.data,
    };
  }

  return {
    success: true,

    message:
      data?.message,

    data:
      data?.data ?? data,
      
    pagination: data?.pagination,
  };
}