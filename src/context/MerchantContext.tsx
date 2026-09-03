import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import { API_BASE_URL } from '../config';

// ==========================================================
// TYPES
// ==========================================================

export type KycStatus =
  | 'PENDING'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | null;

interface MerchantState {
  name: string | null;
  email: string | null;
  phone: string | null;

  accessToken: string | null;
  refreshToken: string | null;

  isEmailVerified: boolean;

  kycStatus: KycStatus;
  approvalStatus: string | null;
  accountStatus: string | null;

  loading: boolean;
  error: string | null;
}

interface MerchantContextType extends MerchantState {
  setSignupData: (
    email: string,
    phone: string
  ) => void;

  signup: (data: {
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;

  verifyEmail: (
    code: string
  ) => Promise<void>;

  resendOtp: () => Promise<void>;

  submitKyc: (
    formData: FormData
  ) => Promise<void>;

  login: (data: {
    email: string;
    password: string;
  }) => Promise<any>;

  forgotPassword: (
    email: string
  ) => Promise<void>;

  resetPassword: (data: {
    token: string;
    password?: string;
    otp: string;
  }) => Promise<void>;

  resendResetOtp: (
    token: string
  ) => Promise<void>;

  logout: () => Promise<void>;

  clearError: () => void;
}

// ==========================================================
// CONTEXT
// ==========================================================

const MerchantContext =
  createContext<MerchantContextType | undefined>(
    undefined
  );

// ==========================================================
// PROVIDER
// ==========================================================

export const MerchantProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  // ========================================================
  // INITIAL STATE
  // ========================================================

  const [state, setState] =
    useState<MerchantState>(() => {

      const accessToken =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('token') ||
        null;

      const refreshToken =
        localStorage.getItem('refreshToken') ||
        localStorage.getItem('refresh_token') ||
        null;

      const email =
        localStorage.getItem('merchant_email') ||
        localStorage.getItem('merchantEmail') ||
        null;

      const name =
        localStorage.getItem('merchant_name') ||
        null;

      const phone =
        localStorage.getItem('merchant_phone') ||
        null;

      const isEmailVerified =
        localStorage.getItem(
          'is_email_verified'
        ) === 'true';

      const kycStatus =
        (localStorage.getItem(
          'kyc_status'
        )?.toUpperCase() as KycStatus) || null;

      const approvalStatus =
        localStorage.getItem(
          'approval_status'
        ) || null;

      const accountStatus =
        localStorage.getItem(
          'account_status'
        ) || null;

      return {
        name,
        email,
        phone,

        accessToken,
        refreshToken,

        isEmailVerified,

        kycStatus,
        approvalStatus,
        accountStatus,

        loading: false,
        error: null,
      };
    });

  // ========================================================
  // LOCAL STORAGE SYNC
  // ========================================================

  useEffect(() => {
    if (state.name) {
      localStorage.setItem(
        'merchant_name',
        state.name
      );
    }
  }, [state.name]);

  useEffect(() => {
    if (state.email) {
      localStorage.setItem(
        'merchant_email',
        state.email
      );

      localStorage.setItem(
        'merchantEmail',
        state.email
      );
    }
  }, [state.email]);

  useEffect(() => {
    if (state.phone) {
      localStorage.setItem(
        'merchant_phone',
        state.phone
      );
    }
  }, [state.phone]);

  useEffect(() => {
    if (state.accessToken) {
      localStorage.setItem(
        'accessToken',
        state.accessToken
      );

      localStorage.setItem(
        'token',
        state.accessToken
      );
    }
  }, [state.accessToken]);

  useEffect(() => {
    if (state.refreshToken) {
      localStorage.setItem(
        'refreshToken',
        state.refreshToken
      );

      localStorage.setItem(
        'refresh_token',
        state.refreshToken
      );
    }
  }, [state.refreshToken]);

  useEffect(() => {
    localStorage.setItem(
      'is_email_verified',
      String(state.isEmailVerified)
    );
  }, [state.isEmailVerified]);

  useEffect(() => {
    if (state.kycStatus) {
      localStorage.setItem(
        'kyc_status',
        state.kycStatus
      );
    }
  }, [state.kycStatus]);

  useEffect(() => {
    if (state.approvalStatus) {
      localStorage.setItem(
        'approval_status',
        state.approvalStatus
      );
    }
  }, [state.approvalStatus]);

  useEffect(() => {
    if (state.accountStatus) {
      localStorage.setItem(
        'account_status',
        state.accountStatus
      );
    }
  }, [state.accountStatus]);

  // ========================================================
  // CLEAR ERROR
  // ========================================================

  const clearError = () => {
    setState((s) => ({
      ...s,
      error: null,
    }));
  };

  // ========================================================
  // SIGNUP DATA
  // ========================================================

  const setSignupData = (
    email: string,
    phone: string
  ) => {

    localStorage.setItem(
      'merchant_email',
      email
    );

    localStorage.setItem(
      'merchantEmail',
      email
    );

    localStorage.setItem(
      'merchant_phone',
      phone
    );

    setState((s) => ({
      ...s,
      email,
      phone,
    }));
  };

  // ========================================================
  // SIGNUP
  // ========================================================

  const signup = async (data: {
    email: string;
    phone: string;
    password: string;
  }) => {

    setState((s) => ({
      ...s,
      loading: true,
      error: null,
    }));

    try {

      const response = await fetch(
        `${API_BASE_URL}/gateway/signup`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            merchantName:
              data.email.split('@')[0],

            email: data.email,

            password: data.password,
          }),
        }
      );

      const responseData =
        await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message ||
          'Signup failed'
        );
      }

      const token =
        responseData.accessToken ||
        responseData.token ||
        null;

      const refToken =
        responseData.refreshToken ||
        responseData.refresh_token ||
        null;

      if (token) {
        localStorage.setItem(
          'accessToken',
          token
        );

        localStorage.setItem(
          'token',
          token
        );
      }

      if (refToken) {
        localStorage.setItem(
          'refreshToken',
          refToken
        );

        localStorage.setItem(
          'refresh_token',
          refToken
        );
      }

      localStorage.setItem(
        'merchant_email',
        data.email
      );

      localStorage.setItem(
        'merchantEmail',
        data.email
      );

      localStorage.setItem(
        'merchant_phone',
        data.phone
      );

      setState((s) => ({
        ...s,

        email:
          responseData.email ||
          data.email,

        phone:
          responseData.phone ||
          data.phone,

        accessToken:
          token ||
          s.accessToken,

        refreshToken:
          refToken ||
          s.refreshToken,

        loading: false,
      }));

    } catch (err: any) {

      const errMsg =
        err.message ||
        'Signup failed. Please try again.';

      setState((s) => ({
        ...s,
        loading: false,
        error: errMsg,
      }));

      throw err;
    }
  };

  // ========================================================
  // VERIFY EMAIL
  // ========================================================

  const verifyEmail = async (
    code: string
  ) => {

    const activeEmail =
      state.email ||
      localStorage.getItem(
        'merchant_email'
      ) ||
      localStorage.getItem(
        'merchantEmail'
      );

    if (!activeEmail) {

      setState((s) => ({
        ...s,
        error:
          'Merchant email not found. Please signup first.',
      }));

      return;
    }

    setState((s) => ({
      ...s,
      loading: true,
      error: null,
    }));

    try {

      const response = await fetch(
        `${API_BASE_URL}/verifyEmail`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            email: activeEmail,
            otp: code,
          }),
        }
      );

      const responseData =
        await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message ||
          'Email verification failed.'
        );
      }

      const token =
        responseData.accessToken ||
        responseData.token ||
        state.accessToken;

      const refToken =
        responseData.refreshToken ||
        responseData.refresh_token ||
        state.refreshToken;

      localStorage.setItem(
        'is_email_verified',
        'true'
      );

      if (token) {
        localStorage.setItem(
          'accessToken',
          token
        );

        localStorage.setItem(
          'token',
          token
        );
      }

      if (refToken) {
        localStorage.setItem(
          'refreshToken',
          refToken
        );

        localStorage.setItem(
          'refresh_token',
          refToken
        );
      }

      setState((s) => ({
        ...s,

        isEmailVerified: true,

        accessToken: token,

        refreshToken: refToken,

        loading: false,
      }));

    } catch (err: any) {

      const errMsg =
        err.message ||
        'Email verification failed.';

      setState((s) => ({
        ...s,
        loading: false,
        error: errMsg,
      }));

      throw err;
    }
  };

  // ========================================================
  // RESEND OTP
  // ========================================================

  const resendOtp = async () => {

    if (!state.email) {

      setState((s) => ({
        ...s,
        error:
          'Merchant email not found. Please signup first.',
      }));

      return;
    }

    setState((s) => ({
      ...s,
      loading: true,
      error: null,
    }));

    try {

      const response = await fetch(
        `${API_BASE_URL}/resend-otp`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            email: state.email,
          }),
        }
      );

      const responseData =
        await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message ||
          'Failed to resend OTP.'
        );
      }

      setState((s) => ({
        ...s,
        loading: false,
      }));

    } catch (err: any) {

      const errMsg =
        err.message ||
        'Failed to resend OTP.';

      setState((s) => ({
        ...s,
        loading: false,
        error: errMsg,
      }));

      throw err;
    }
  };

  // ========================================================
  // SUBMIT KYC
  // ========================================================

  const submitKyc = async (
    formData: FormData
  ) => {

    setState((s) => ({
      ...s,
      loading: true,
      error: null,
    }));

    try {
      const baseUrl = API_BASE_URL.replace(/\/merchant\/?$/, '');
      const currentToken =
        localStorage.getItem(
          'accessToken'
        ) ||
        localStorage.getItem('token') ||
        state.accessToken;

      const response = await fetch(
        `${baseUrl}/merchant/upload-kyc-doc`,
        {
          method: 'POST',

          headers: {
            Authorization:
              `Bearer ${currentToken}`,
          },

          body: formData,
        }
      );

      const responseData =
        await response.json();

      if (!response.ok) {

        const errMessage =
          responseData.message ||
          responseData.error?.message ||
          'KYC submission failed.';

        throw new Error(errMessage);
      }

      setState((s) => ({
        ...s,

        kycStatus: 'SUBMITTED',

        loading: false,
      }));

    } catch (err: any) {

      const errMsg =
        err.message ||
        'KYC submission failed.';

      setState((s) => ({
        ...s,
        loading: false,
        error: errMsg,
      }));

      throw err;
    }
  };

  // ========================================================
  // LOGIN
  // ========================================================

  const login = async (data: {
    email: string;
    password: string;
  }) => {

    setState((s) => ({
      ...s,
      loading: true,
      error: null,
    }));

    try {
      const baseUrl = API_BASE_URL.replace(/\/merchant\/?$/, '');
      const response = await fetch(
        `${baseUrl}/merchant/login`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(data),
        }
      );

      const responseData =
        await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message ||
          'Login failed'
        );
      }

      // ====================================================
      // TOKENS
      // ====================================================

      const token =
        responseData.accessToken ||
        responseData.token ||
        null;

      const refToken =
        responseData.refreshToken ||
        responseData.refresh_token ||
        null;

      if (token) {

        localStorage.setItem(
          'accessToken',
          token
        );

        localStorage.setItem(
          'token',
          token
        );
      }

      if (refToken) {

        localStorage.setItem(
          'refreshToken',
          refToken
        );

        localStorage.setItem(
          'refresh_token',
          refToken
        );
      }

      // ====================================================
      // MERCHANT
      // ====================================================

      const merchant =
        responseData.merchant;

      if (!merchant) {
        throw new Error(
          'Merchant information was not returned by the server.'
        );
      }

      // ====================================================
      // BACKEND USES CAMEL CASE
      // ====================================================

      const merchantName =
        merchant.merchantName ||
        merchant.name ||
        null;

      const merchantEmail =
        merchant.email ||
        data.email;

      const emailVerified =
        Boolean(
          merchant.emailVerified
        );

      const kycStatus =
        String(
          merchant.kycStatus || ''
        ).toUpperCase() as KycStatus;

      const approvalStatus =
        String(
          merchant.approvalStatus || ''
        ).toUpperCase();

      const accountStatus =
        String(
          merchant.accountStatus || ''
        ).toUpperCase();

      // ====================================================
      // STORE MERCHANT
      // ====================================================

      localStorage.setItem(
        'merchant',
        JSON.stringify(merchant)
      );

      localStorage.setItem(
        'merchant_name',
        merchantName || ''
      );

      localStorage.setItem(
        'merchant_email',
        merchantEmail
      );

      localStorage.setItem(
        'merchantEmail',
        merchantEmail
      );

      // ====================================================
      // STORE STATUS
      // ====================================================

      localStorage.setItem(
        'is_email_verified',
        String(emailVerified)
      );

      localStorage.setItem(
        'kyc_status',
        String(kycStatus)
      );

      localStorage.setItem(
        'approval_status',
        approvalStatus
      );

      localStorage.setItem(
        'account_status',
        accountStatus
      );

      // ====================================================
      // UPDATE CONTEXT
      // ====================================================

      setState((s) => ({
        ...s,

        name: merchantName,

        email: merchantEmail,

        phone:
          merchant.phone ||
          s.phone ||
          null,

        accessToken: token,

        refreshToken: refToken,

        isEmailVerified:
          emailVerified,

        kycStatus,

        approvalStatus,

        accountStatus,

        loading: false,

        error: null,
      }));

      // ====================================================
      // RETURN FULL BACKEND RESPONSE
      // ====================================================

      return responseData;

    } catch (err: any) {

      const errMsg =
        err.message ||
        'Login failed. Please try again.';

      setState((s) => ({
        ...s,

        loading: false,

        error: errMsg,
      }));

      throw err;
    }
  };

  // ========================================================
  // FORGOT PASSWORD
  // ========================================================

  const forgotPassword = async (
    email: string
  ) => {

    setState((s) => ({
      ...s,
      loading: true,
      error: null,
    }));

    try {

      const response = await fetch(
        `${API_BASE_URL}/forgot-password`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            email,
          }),
        }
      );

      const responseData =
        await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message ||
          'Failed to send reset email.'
        );
      }

      setState((s) => ({
        ...s,
        loading: false,
      }));

    } catch (err: any) {

      const errMsg =
        err.message ||
        'Failed to send reset email.';

      setState((s) => ({
        ...s,
        loading: false,
        error: errMsg,
      }));

      throw err;
    }
  };

  // ========================================================
  // RESET PASSWORD
  // ========================================================

  const resetPassword = async (
    data: {
      token: string;
      password?: string;
      otp: string;
    }
  ) => {

    setState((s) => ({
      ...s,
      loading: true,
      error: null,
    }));

    try {

      const response = await fetch(
        `${API_BASE_URL}/verify-password-reset`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(data),
        }
      );

      const responseData =
        await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message ||
          'Password reset failed.'
        );
      }

      setState((s) => ({
        ...s,
        loading: false,
      }));

    } catch (err: any) {

      const errMsg =
        err.message ||
        'Password reset failed.';

      setState((s) => ({
        ...s,
        loading: false,
        error: errMsg,
      }));

      throw err;
    }
  };

  // ========================================================
  // RESEND RESET OTP
  // ========================================================

  const resendResetOtp = async (
    token: string
  ) => {

    setState((s) => ({
      ...s,
      loading: true,
      error: null,
    }));

    try {

      const response = await fetch(
        `${API_BASE_URL}/request-password-change`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            token,
          }),
        }
      );

      const responseData =
        await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message ||
          'Failed to resend reset OTP.'
        );
      }

      setState((s) => ({
        ...s,
        loading: false,
      }));

    } catch (err: any) {

      const errMsg =
        err.message ||
        'Failed to resend reset OTP.';

      setState((s) => ({
        ...s,
        loading: false,
        error: errMsg,
      }));

      throw err;
    }
  };

  // ========================================================
  // LOGOUT
  // ========================================================

  const logout = async () => {

    const accessToken =
      localStorage.getItem(
        'accessToken'
      );

    const refreshToken =
      localStorage.getItem(
        'refreshToken'
      );

    try {

      if (
        accessToken &&
        refreshToken
      ) {

        await fetch(
          `${API_BASE_URL}/gateway/logout`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${accessToken}`,
            },

            body: JSON.stringify({
              refreshToken,
            }),
          }
        );
      }

    } catch (err) {

      console.log(
        'Logout API Error:',
        err
      );

    } finally {

      // ====================================================
      // CLEAR STORAGE
      // ====================================================

      localStorage.removeItem(
        'merchant'
      );

      localStorage.removeItem(
        'accessToken'
      );

      localStorage.removeItem(
        'refreshToken'
      );

      localStorage.removeItem(
        'token'
      );

      localStorage.removeItem(
        'refresh_token'
      );

      localStorage.removeItem(
        'merchant_name'
      );

      localStorage.removeItem(
        'merchant_email'
      );

      localStorage.removeItem(
        'merchantEmail'
      );

      localStorage.removeItem(
        'merchant_phone'
      );

      localStorage.removeItem(
        'is_email_verified'
      );

      localStorage.removeItem(
        'kyc_status'
      );

      localStorage.removeItem(
        'approval_status'
      );

      localStorage.removeItem(
        'account_status'
      );

      window.location.href =
        '/login';
    }
  };

  // ========================================================
  // PROVIDER
  // ========================================================

  return (
    <MerchantContext.Provider
      value={{
        ...state,

        setSignupData,
        signup,
        verifyEmail,
        resendOtp,
        submitKyc,
        login,
        forgotPassword,
        resetPassword,
        resendResetOtp,
        logout,
        clearError,
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
};

// ==========================================================
// HOOK
// ==========================================================

export const useMerchant = () => {

  const context =
    useContext(MerchantContext);

  if (!context) {

    throw new Error(
      'useMerchant must be used within MerchantProvider'
    );
  }

  return context;
};