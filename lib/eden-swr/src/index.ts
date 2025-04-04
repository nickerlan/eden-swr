import type { Elysia } from "elysia";
import type { SWRResponse, SWRConfiguration } from "swr";
import useSWR from "swr";
import type { IsNever, IsUnknown, TreatyToPath, EdenResponse } from "./types";

/**
 * Extract response type from an endpoint schema
 */
export type ExtractedResponse<
  Endpoints,
  P extends keyof Endpoints
> = Endpoints[P] extends { get: { response: { 200: infer R } } } ? R : never;

/**
 * Extract options type from an endpoint schema
 */
export type OptionsForEndpoint<
  Endpoints,
  P extends keyof Endpoints
> = Endpoints[P] extends {
  get: {
    params: infer Params;
    query: infer Query;
    headers: infer Headers;
    body: infer Body;
  };
}
  ? Omit<RequestInit, "body" | "method" | "headers"> & {
      method?: "GET";
    } & (IsNever<keyof Params> extends true
        ? { params?: Record<never, string> }
        : { params: Params }) &
      (IsNever<keyof Query> extends true
        ? { query?: Record<never, string> }
        : { query: Query }) &
      (undefined extends Headers
        ? { headers?: Record<string, string> }
        : { headers: Headers }) &
      (IsUnknown<Body> extends false ? { body: Body } : { body?: unknown })
  : any;

/**
 * Replace path parameters with actual values
 * For example, replaces ":id" in "/users/:id" with the actual ID
 */
const createCacheKey = (path: string, opts: any): string => {
  let result = path;
  if (opts?.params) {
    for (const [key, value] of Object.entries(opts.params)) {
      result = result.replace(`:${key}`, String(value));
    }
  }
  if (opts?.query) {
    const queryString = new URLSearchParams(opts.query).toString();
    if (queryString) {
      result += `?${queryString}`;
    }
  }
  return result;
};

/**
 * Create a typed SWR hook for Elysia applications
 *
 * @param fetch - The edenFetch function created for your Elysia app
 * @param specialPathHandlers - Optional custom handlers for specific paths (e.g. "/index" → "")
 * @returns A typed useEdenSWR hook with overloads for known endpoints and fallback for arbitrary endpoints
 */
export function createUseEdenSWR<
  App extends Elysia<any, any, any, any, any, any, any>
>(
  fetch: any,
  specialPathHandlers: Record<string, (path: string) => string> = {}
) {
  // Extract endpoint schema
  type Endpoints = TreatyToPath<App["_routes"]>;

  // Define helper type to allow fallback to string if Endpoints is empty
  type KnownEndpoints = [keyof Endpoints] extends [never]
    ? string
    : keyof Endpoints;

  // Combined overload for both known endpoints and arbitrary endpoints
  function useEdenSWR<P extends KnownEndpoints>(
    path: P,
    options?: P extends keyof Endpoints
      ? OptionsForEndpoint<Endpoints, P>
      : any,
    swrOptions?: SWRConfiguration & { cacheKey?: string }
  ): SWRResponse<
    P extends keyof Endpoints
      ? [ExtractedResponse<Endpoints, P>] extends [never]
        ? any
        : ExtractedResponse<Endpoints, P>
      : any,
    any
  >;

  function useEdenSWR<P extends KnownEndpoints>(
    path: P,
    options: any = {},
    swrOptions: SWRConfiguration & {
      cacheKey?: string | (() => string | null) | undefined;
      shouldFetch?: boolean;
    } = {}
  ): SWRResponse<any, any> {
    let cacheKey: string | null | (() => string | null) = "";
    if (swrOptions.shouldFetch === false) {
      cacheKey = null;
    } else {
      if (
        typeof swrOptions.cacheKey === "function" ||
        typeof swrOptions.cacheKey === "string"
      ) {
        cacheKey = swrOptions.cacheKey;
      } else {
        if (swrOptions.cacheKey === undefined)
          cacheKey = createCacheKey(path as string, options);
      }
    }

    return useSWR<
      P extends keyof Endpoints
        ? [ExtractedResponse<Endpoints, P>] extends [never]
          ? any
          : ExtractedResponse<Endpoints, P>
        : any
    >(
      cacheKey,
      async () => {
        let processedPath = path as string;
        if (
          processedPath in specialPathHandlers &&
          specialPathHandlers[processedPath]
        ) {
          processedPath = specialPathHandlers[processedPath]!(processedPath);
        }

        const response = await (fetch as any)(processedPath, options);
        return response.data;
      },
      swrOptions
    );
  }

  return useEdenSWR;
}

/**
 * Default special path handlers with common transformations
 */
export const defaultSpecialPathHandlers: Record<
  string,
  (path: string) => string
> = {
  "/index": () => "",
};
