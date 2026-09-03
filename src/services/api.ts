import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://api.trustgates.co.in";

// ==========================================================
// AXIOS INSTANCE
// ==========================================================

const api = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================================
// REFRESH STATE
// ==========================================================

// Important:
// Multiple APIs can return 401 at the same time.
// We must allow ONLY ONE refresh request.

let refreshPromise: Promise<string | null> | null = null;

// ==========================================================
// REFRESH ACCESS TOKEN
// ==========================================================

const refreshAccessToken = async (): Promise<string | null> => {

  try {

    const refreshToken =
      localStorage.getItem("refreshToken") ||
      localStorage.getItem("refresh_token");

    if (!refreshToken) {

      console.log(
        "No refresh token available."
      );

      return null;
    }

    console.log(
      "Refreshing merchant access token..."
    );

    // IMPORTANT:
    // Use axios directly, NOT api.post().
    // Otherwise the interceptor can intercept the refresh request itself.

    const response = await axios.post(
      `${API_BASE_URL}/merchant/refresh`,
      {
        refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    console.log(
      "Refresh response:",
      data
    );

    if (
      !data?.success ||
      !data?.accessToken
    ) {

      console.log(
        "Invalid refresh response:",
        data
      );

      return null;
    }

    const newAccessToken =
      data.accessToken;

    const newRefreshToken =
      data.refreshToken;

    // ======================================================
    // SAVE NEW ACCESS TOKEN
    // ======================================================

    localStorage.setItem(
      "accessToken",
      newAccessToken
    );

    localStorage.setItem(
      "token",
      newAccessToken
    );

    // ======================================================
    // SAVE ROTATED REFRESH TOKEN
    // ======================================================

    if (newRefreshToken) {

      localStorage.setItem(
        "refreshToken",
        newRefreshToken
      );

      localStorage.setItem(
        "refresh_token",
        newRefreshToken
      );
    }

    console.log(
      "Merchant token refreshed successfully."
    );

    return newAccessToken;

  } catch (error) {

    console.log(
      "Refresh token failed:",
      error
    );

    return null;
  }
};

// ==========================================================
// REQUEST INTERCEPTOR
// ==========================================================

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token");

    if (
      token &&
      config.headers
    ) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {

    return Promise.reject(error);
  }
);

// ==========================================================
// RESPONSE INTERCEPTOR
// ==========================================================

api.interceptors.response.use(

  // ========================================================
  // SUCCESS
  // ========================================================

  (response) => {

    return response;
  },

  // ========================================================
  // ERROR
  // ========================================================

  async (error: AxiosError) => {

    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

    // ======================================================
    // CHECK 401
    // ======================================================

    if (
      error.response?.status !== 401 ||
      !originalRequest
    ) {

      return Promise.reject(error);
    }

    // ======================================================
    // DON'T REFRESH THE REFRESH REQUEST ITSELF
    // ======================================================

    if (
      originalRequest.url?.includes(
        "/merchant/refresh"
      )
    ) {

      return Promise.reject(error);
    }

    // ======================================================
    // PREVENT INFINITE RETRY
    // ======================================================

    if (originalRequest._retry) {

      console.log(
        "Request failed again after token refresh."
      );

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // ======================================================
    // ONLY ONE REFRESH REQUEST
    // ======================================================

    if (!refreshPromise) {

      refreshPromise =
        refreshAccessToken()
          .finally(() => {

            refreshPromise = null;

          });
    }

    const newAccessToken =
      await refreshPromise;

    // ======================================================
    // REFRESH FAILED
    // ======================================================

    if (!newAccessToken) {

      console.log(
        "Session expired. Refresh token is invalid or expired."
      );

      // Clear authentication tokens

      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "refreshToken"
      );

      localStorage.removeItem(
        "refresh_token"
      );

      return Promise.reject(
        error
      );
    }

    // ======================================================
    // UPDATE ORIGINAL REQUEST
    // ======================================================

    originalRequest.headers =
      originalRequest.headers || {};

    originalRequest.headers.Authorization =
      `Bearer ${newAccessToken}`;

    // ======================================================
    // RETRY ORIGINAL REQUEST
    // ======================================================

    console.log(
      "Retrying request:",
      originalRequest.url
    );

    return api(
      originalRequest
    );
  }
);

// ==========================================================
// AUTH SERVICE
// ==========================================================

export const authService = {

  signup: async (data: any) => {

    const response = await api.post(
      "/merchant/gateway/signup",
      {
        merchantName:
          data.email.split("@")[0],

        email:
          data.email,

        password:
          data.password,
      }
    );

    return response.data;
  },

  verifyEmail: async (
    data: {
      email: string;
      code: string;
    }
  ) => {

    const response = await api.post(
      "/merchant/verifyEmail",
      {
        email: data.email,
        otp: data.code,
      }
    );

    return response.data;
  },

  resendOtp: async (
    data: {
      email: string;
    }
  ) => {

    const response = await api.post(
      "/merchant/resend-otp",
      data
    );

    return response.data;
  },

  login: async (
    data: {
      email: string;
      password: string;
    }
  ) => {

    const response = await api.post(
      "/merchant/gateway/login",
      data
    );

    return response.data;
  },

  forgotPassword: async (
    data: {
      email: string;
    }
  ) => {

    const response = await api.post(
      "/merchant/forgot-password",
      data
    );

    return response.data;
  },

  resetPassword: async (
    data: any
  ) => {

    const response = await api.post(
      "/merchant/verify-password-reset",
      data
    );

    return response.data;
  },

  resendResetOtp: async (
    data: any
  ) => {

    const response = await api.post(
      "/merchant/request-password-change",
      data
    );

    return response.data;
  },

};

// ==========================================================
// KYC SERVICE
// ==========================================================

export const kycService = {

  submitKyc: async (
    formData: FormData
  ) => {

    const response = await api.post(
      "/merchant/upload-kyc-doc",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return response.data;
  },

};

// ==========================================================
// API CREDENTIAL SERVICE
// ==========================================================

export const apiCredentialService = {

  getCredentials: async () => {

    const response =
      await api.get(
        "/merchant/api-credentials"
      );

    return response.data;
  },

  updateWebhookUrl: async (
    credentialId: string | number,
    webhookUrl: string
  ) => {

    const response =
      await api.put(
        `/merchant/api-credentials/webhook/${credentialId}`,
        {
          webhookUrl,
        }
      );

    return response.data;
  },

  updateStatus: async (
    credentialId: string | number,
    status: string
  ) => {

    const response =
      await api.patch(
        `/merchant/api-credentials/status/${credentialId}`,
        {
          status,
        }
      );

    return response.data;
  },

  regenerateCredentials: async (
    credentialId: string | number
  ) => {

    const response =
      await api.post(
        `/merchant/api-credentials/regenerate/${credentialId}`
      );

    return response.data;
  },

  revokeCredentials: async (
    credentialId: string | number
  ) => {

    const response =
      await api.patch(
        `/merchant/api-credentials/revoke/${credentialId}`
      );

    return response.data;
  },

  getWhitelistIps: async (
    credentialId: string | number
  ) => {

    const response =
      await api.get(
        `/merchant/api-whitelist/${credentialId}`
      );

    return response.data;
  },

  addWhitelistIp: async (
    credentialId: string | number,
    data: {
      ipAddress: string;
      label?: string;
    }
  ) => {

    const response =
      await api.post(
        `/merchant/api-whitelist/${credentialId}`,
        data
      );

    return response.data;
  },

  deleteWhitelistIp: async (
    whitelistId: string | number
  ) => {

    const response =
      await api.delete(
        `/merchant/api-whitelist/delete/${whitelistId}`
      );

    return response.data;
  },

};

export default api;