export const API_BASE = import.meta.env.VITE_API_BASE ?? "http://local.super-price-check.com:8082/api";

export const STATIC_QUERY_CONFIG = {
  staleTime: Infinity,
  gcTime: 1000 * 60 * 10,
} as const;
