import { treaty, edenFetch } from "@elysiajs/eden";
import type { Elysia } from "elysia";
import { createUseEdenSWR, defaultSpecialPathHandlers } from "./use-eden-swr";

export {
  createUseEdenSWR as createuseEdenSWR,
  defaultSpecialPathHandlers,
} from "./use-eden-swr";
export type { ExtractedResponse, OptionsForEndpoint } from "./use-eden-swr";
export * from "./types";

/**
 * Create a complete Eden SWR setup for an Elysia application
 *
 * @param baseUrl - The base URL for API requests
 * @param customPathHandlers - Optional custom path handlers to merge with defaults
 * @returns An object with eden client, fetch function, and useEdenSWR hook
 *
 * @example
 * ```typescript
 * // Create your edenSWR client
 * import { createEdenSWR } from 'eden-swr';
 * import type { App } from './your-elysia-app';
 *
 * const { useEdenSWR, fetch: fetchEden } = createEdenSWR<App>('/api');
 *
 * // Use it in your React components
 * function UserProfile({ userId }: { userId: string }) {
 *   const { data, error, isLoading } = useEdenSWR('/users/:id', {
 *     params: { id: userId }
 *   });
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return <div>{data?.username}</div>;
 * }
 * ```
 */
export function createEdenSWR<
  App extends Elysia<any, any, any, any, any, any, any>
>(
  baseUrl: string,
  customPathHandlers: Record<string, (path: string) => string> = {}
) {
  const eden = treaty<App>(baseUrl);
  const fetch = edenFetch<App>(baseUrl);

  // Merge default and custom path handlers
  const pathHandlers = {
    ...defaultSpecialPathHandlers,
    ...customPathHandlers,
  };

  const useEdenSWR = createUseEdenSWR<App>(fetch, pathHandlers);

  return {
    eden,
    fetch,
    useEdenSWR,
  };
}
