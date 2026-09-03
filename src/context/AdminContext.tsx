import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export interface AdminUser {
  admin_id?: number;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: unknown;
}

interface AdminState {
  adminToken: string | null;
  adminRefreshToken: string | null;
  loading: boolean;
  error: string | null;
}

interface AdminContextType extends AdminState {
  adminLogin: (data: { email: string; password: string }) => Promise<any>;
  adminLogout: () => Promise<void>;
  clearAdminError: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AdminState>(() => {
    const role = localStorage.getItem('role') || localStorage.getItem('admin_role');
    const isAdmin = role === 'admin' || localStorage.getItem('isAdmin') === 'true';
    return {
      adminToken: isAdmin ? (localStorage.getItem('accessToken') || localStorage.getItem('adminToken') || null) : null,
      adminRefreshToken: isAdmin ? (localStorage.getItem('refreshToken') || localStorage.getItem('adminRefreshToken') || null) : null,
      loading: false,
      error: null,
    };
  });

  const clearAdminError = () => setState((s) => ({ ...s, error: null }));

  const adminApiBase = API_BASE_URL.replace(/\/merchant\/?$/, "");

  const adminLogin = async (data: { email: string; password: string }) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const response = await fetch(`${adminApiBase}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Admin login failed");
      }

      // Cleanup legacy keys
      ['admin', 'admin_token', 'admin_refresh_token', 'token', 'user', 'role'].forEach((key) =>
        localStorage.removeItem(key)
      );

      if (responseData.accessToken) {
        localStorage.setItem('accessToken', responseData.accessToken);
        localStorage.setItem('token', responseData.accessToken);
        localStorage.setItem('adminToken', responseData.accessToken);
      }
      if (responseData.refreshToken) {
        localStorage.setItem('refreshToken', responseData.refreshToken);
        localStorage.setItem('refresh_token', responseData.refreshToken);
        localStorage.setItem('adminRefreshToken', responseData.refreshToken);
      }
      localStorage.setItem('role', 'admin');
      localStorage.setItem('admin_role', 'admin');
      localStorage.setItem('isAdmin', 'true');

      setState({
        adminToken: responseData.accessToken || null,
        adminRefreshToken: responseData.refreshToken || null,
        loading: false,
        error: null,
      });

      return responseData;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Admin login failed. Please try again.';
      setState((s) => ({ ...s, loading: false, error: errMsg }));
      throw err;
    }
  };

  const adminLogout = async () => {
    const currentToken = state.adminToken || localStorage.getItem('accessToken');
    const currentRefreshToken = state.adminRefreshToken || localStorage.getItem('refreshToken');

    if (currentToken && currentRefreshToken) {
      try {
        await fetch(`${adminApiBase}/admin/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${currentToken}`
          },
          body: JSON.stringify({ refreshToken: currentRefreshToken })
        });
      } catch (err) {
        console.log("Admin logout API error:", err);
      }
    }

    setState({
      adminToken: null,
      adminRefreshToken: null,
      loading: false,
      error: null,
    });

    ['accessToken', 'refreshToken', 'token', 'refresh_token', 'adminToken', 'adminRefreshToken', 'role', 'admin_role', 'isAdmin'].forEach((key) =>
      localStorage.removeItem(key)
    );
  };

  return (
    <AdminContext.Provider
      value={{
        ...state,
        adminLogin,
        adminLogout,
        clearAdminError,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
