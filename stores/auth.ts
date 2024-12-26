// stores/auth.ts

import { defineStore } from 'pinia';
import { useRuntimeConfig } from '#imports';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    token: null as null | any,
    user: null as null | any,
  }),
  actions: {
    setToken(token: any) {
      this.isAuthenticated = true;
      this.token = token;
    },
    setUser(user: any) {
      this.isAuthenticated = true;
      this.user = user;
    },
    clearAuth() {
      this.isAuthenticated = false;
      this.token = null;
      this.user = null;
    },
  },
});