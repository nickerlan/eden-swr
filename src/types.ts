/**
 * Types for eden-swr library
 * Extracted from https://github.com/elysiajs/eden/blob/main/src/fetch/types.ts
 * ToDo: make auto extraction if something will change
 */
import type { Elysia } from "elysia";

// Helper type to check if a type is any
export type IsAny<T> = 0 extends 1 & T ? true : false;

// Helper type to check if a type is never
export type IsNever<T> = [T] extends [never] ? true : false;

// Helper type to check if a type is unknown
export type IsUnknown<T> = IsAny<T> extends true
  ? false
  : unknown extends T
  ? true
  : false;

// Basic route structure type
export type AnyTypedRoute = {
  body?: unknown;
  headers?: unknown;
  query?: unknown;
  params?: unknown;
  response: Record<number, unknown>;
};

// Pretty print a type (useful for complex nested types)
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// Convert a union to an intersection
export type UnionToIntersect<U> = (
  U extends any ? (arg: U) => any : never
) extends (arg: infer I) => void
  ? I
  : never;

// Convert a union to a tuple
export type UnionToTuple<T> = UnionToIntersect<
  T extends any ? (t: T) => T : never
> extends (_: any) => infer W
  ? [...UnionToTuple<Exclude<T, W>>, W]
  : [];

// Type to transform Elysia routes to Path structure
export type TreatyToPath<T, Path extends string = ""> = UnionToIntersect<
  T extends Record<string, unknown>
    ? {
        [K in keyof T]: T[K] extends AnyTypedRoute
          ? { [path in Path]: { [method in K]: T[K] } }
          : unknown extends T[K]
          ? { [path in Path]: { [method in K]: T[K] } }
          : TreatyToPath<T[K], `${Path}/${K & string}`>;
      }[keyof T]
    : {}
>;

// Type for the EdenFetch error class
export class EdenFetchError<
  Status extends number = number,
  Value = unknown
> extends Error {
  constructor(public status: Status, public value: Value) {
    super(value + "");
  }
}

// Utility type for integer range
type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

type Range<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;

type ErrorRange = Range<300, 599>;

export type MapError<T extends Record<number, unknown>> = [
  {
    [K in keyof T]-?: K extends ErrorRange ? K : never;
  }[keyof T]
] extends [infer A extends number]
  ? {
      [K in A]: EdenFetchError<K, T[K]>;
    }[A]
  : false;

// Eden fetch response type
export type EdenResponse<T> = {
  data: T;
  error: null;
  status: number;
  headers: Record<string, unknown>;
  retry(): Promise<void>;
};

// Eden fetch error response type
export type EdenErrorResponse = {
  data: null;
  error: EdenFetchError<number, unknown>;
  status: number;
  headers: Record<string, unknown>;
  retry(): Promise<void>;
};
