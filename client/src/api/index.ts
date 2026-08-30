import axios from 'axios';

export * as bearingCmsApi from './bearing-cms';
export * as bearingProductsApi from './bearing-products';
export * as bearingInquiriesApi from './bearing-inquiries';
export * as bearingOrdersApi from './bearing-orders';
export * as bearingAdminApi from './bearing-admin';

// Axios instance for backend API calls
export const axiosForBackend = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple logger (replaces platform logger)
export const logger = {
  info: (message: string, ...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.info(`[INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, ...args);
  },
  debug: (message: string, ...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.debug(`[DEBUG] ${message}`, ...args);
  },
};
