import { z } from 'zod';

// Since this is a local-first app using Dexie, we don't need complex API routes.
// However, we maintain this file structure for consistency with the project scaffolding.

export const api = {};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
