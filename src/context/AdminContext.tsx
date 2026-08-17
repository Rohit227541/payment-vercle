import React, {
  createContext,
  useContext,
  useState,
} from "react";

import { API_BASE_URL2 } from "../config";

// ==========================================================
// Types
// ==========================================================

export interface AdminUser {
  admin_id?: number;
  email?: string;
  name?: string;
  full_name?: string;
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
  adminLogin: (data: {
    email: string;
    password: string;
  }) => Promise<any>;

  adminLogout: () => Promise<void>;

  clearAdminError: () => void;
}

// ==========================================================
// Context
// ==========================================================

const AdminContext =
  createContext<AdminContextType | undefined>(
    undefined
  );

// ==========================================================
// Provider
// ==========================================================

export const AdminProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  // ========================================================
  // Initial State
  // ========================================================

  const [state, setState] =
    useState<AdminState>(() => {

      const role =
        localStorage.getItem("role") ||
        localStorage.getItem("admin_role");

      const isAdmin =
        role?.toLowerCase() === "admin" ||
        localStorage.getItem("isAdmin") === "true";

      return {
        adminToken: isAdmin
          ? (
              localStorage.getItem("accessToken") ||
              localStorage.getItem("adminToken") ||
              null
            )
          : null,

        adminRefreshToken: isAdmin
          ? (
              localStorage.getItem("refreshToken") ||
              localStorage.getItem("adminRefreshToken") ||
              null
            )
          : null,

        loading: false,
        error: null,
      };
    });

  // ========================================================
  // API BASE
  // ========================================================

  const adminApiBase =
    API_BASE_URL2.replace(/\/+$/, "");

  // ========================================================
  // Clear Error
  // ========================================================

  const clearAdminError = () => {
    setState((s) => ({
      ...s,
      error: null,
    }));
  };

  // ========================================================
  // ADMIN LOGIN
  // ========================================================

  const adminLogin = async (data: {
    email: string;
    password: string;
  }) => {

    setState((s) => ({
      ...s,
      loading: true,
      error: null,
    }));

    try {

      // ----------------------------------------------------
      // Normalize email
      // ----------------------------------------------------

      const loginData = {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };


      // ----------------------------------------------------
      // Login Request
      // ----------------------------------------------------

      const response = await fetch(
        `${adminApiBase}/admin/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(loginData),
        }
      );

      // ----------------------------------------------------
      // Parse Response
      // ----------------------------------------------------

      const responseData =
        await response.json();

      // ----------------------------------------------------
      // Handle Error
      // ----------------------------------------------------

      if (!response.ok) {

        throw new Error(
          responseData.message ||
          "Admin login failed."
        );
      }

      // ----------------------------------------------------
      // Cleanup old / legacy keys
      // ----------------------------------------------------

      [
        "admin",
        "admin_token",
        "admin_refresh_token",
        "token",
        "user",
        "role",
        "admin_role",
        "isAdmin",
        "accessToken",
        "refreshToken",
        "refresh_token",
        "adminToken",
        "adminRefreshToken",
      ].forEach((key) => {
        localStorage.removeItem(key);
      });

      // ----------------------------------------------------
      // Store Access Token
      // ----------------------------------------------------

      if (responseData.accessToken) {

        localStorage.setItem(
          "accessToken",
          responseData.accessToken
        );

        localStorage.setItem(
          "adminToken",
          responseData.accessToken
        );

        // Legacy compatibility
        localStorage.setItem(
          "token",
          responseData.accessToken
        );
      }

      // ----------------------------------------------------
      // Store Refresh Token
      // ----------------------------------------------------

      if (responseData.refreshToken) {

        localStorage.setItem(
          "refreshToken",
          responseData.refreshToken
        );

        localStorage.setItem(
          "adminRefreshToken",
          responseData.refreshToken
        );

        // Legacy compatibility
        localStorage.setItem(
          "refresh_token",
          responseData.refreshToken
        );
      }

      // ----------------------------------------------------
      // Store Admin Role
      // ----------------------------------------------------

      localStorage.setItem(
        "role",
        "admin"
      );

      localStorage.setItem(
        "admin_role",
        "admin"
      );

      localStorage.setItem(
        "isAdmin",
        "true"
      );

      // ----------------------------------------------------
      // Update State
      // ----------------------------------------------------

      setState({
        adminToken:
          responseData.accessToken ||
          null,

        adminRefreshToken:
          responseData.refreshToken ||
          null,

        loading: false,

        error: null,
      });

      // ----------------------------------------------------
      // Return Backend Response
      // ----------------------------------------------------

      return responseData;

    } catch (err: unknown) {

      const errMsg =
        err instanceof Error
          ? err.message
          : "Admin login failed. Please try again.";

      setState((s) => ({
        ...s,
        loading: false,
        error: errMsg,
      }));

      throw err;
    }
  };

  // ========================================================
  // ADMIN LOGOUT
  // ========================================================

  const adminLogout = async () => {

    const currentToken =
      state.adminToken ||
      localStorage.getItem(
        "accessToken"
      ) ||
      localStorage.getItem(
        "adminToken"
      );

    const currentRefreshToken =
      state.adminRefreshToken ||
      localStorage.getItem(
        "refreshToken"
      ) ||
      localStorage.getItem(
        "adminRefreshToken"
      );

    // ------------------------------------------------------
    // Call Backend Logout
    // ------------------------------------------------------

    if (
      currentToken &&
      currentRefreshToken
    ) {

      try {

        const response =
          await fetch(
            `${adminApiBase}/admin/logout`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${currentToken}`,
              },

              body: JSON.stringify({
                refreshToken:
                  currentRefreshToken,
              }),
            }
          );

        // Optional logging
        if (!response.ok) {
          console.error(
            "Admin logout failed:",
            response.status
          );
        }

      } catch (err) {

        console.error(
          "Admin logout API error:",
          err
        );
      }
    }

    // ------------------------------------------------------
    // Clear State
    // ------------------------------------------------------

    setState({
      adminToken: null,
      adminRefreshToken: null,
      loading: false,
      error: null,
    });

    // ------------------------------------------------------
    // Clear Storage
    // ------------------------------------------------------

    [
      "accessToken",
      "refreshToken",
      "token",
      "refresh_token",
      "adminToken",
      "adminRefreshToken",
      "role",
      "admin_role",
      "isAdmin",
      "admin",
      "admin_token",
      "admin_refresh_token",
      "user",
    ].forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  // ========================================================
  // Provider
  // ========================================================

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

// ==========================================================
// Hook
// ==========================================================

export const useAdmin = () => {

  const context =
    useContext(AdminContext);

  if (!context) {

    throw new Error(
      "useAdmin must be used within an AdminProvider"
    );
  }

  return context;
};