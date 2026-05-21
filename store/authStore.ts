import { useState, useEffect } from "react";

// Simple pub-sub store for authentication state
class AuthStore {
  private _isAuthenticated = false;
  private _email = "";
  private listeners = new Set<() => void>();

  get isAuthenticated() {
    return this._isAuthenticated;
  }

  get email() {
    return this._email;
  }

  login(email: string) {
    this._isAuthenticated = true;
    this._email = email;
    this.notify();
  }

  logout() {
    this._isAuthenticated = false;
    this._email = "";
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

export const authStore = new AuthStore();

// React hook to consume the auth store
export function useAuth() {
  const [state, setState] = useState({
    isAuthenticated: authStore.isAuthenticated,
    email: authStore.email,
  });

  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setState({
        isAuthenticated: authStore.isAuthenticated,
        email: authStore.email,
      });
    });
    return unsubscribe;
  }, []);

  return {
    ...state,
    login: (email: string) => authStore.login(email),
    logout: () => authStore.logout(),
  };
}
