# eden-swr 🚀

**Type-safe SWR hooks** for Elysia applications using Eden fetch – the perfect companion for **React** and **NextJS** projects!

---

## Motivation ✨

- **Zero Overhead:** No messy context providers needed 👌
- **Fully Typed:** Enjoy robust TypeScript integration that gives you instant auto-completion & error detection 💪
- **Seamless Integration:** Brings together the power of [Elysia Eden](https://elysiajs.com/eden/overview.html) and [SWR](https://swr.vercel.app/) effortlessly 🔥

---

## Features ⚡

- **Lightweight & Fast:** Minimal boilerplate code and super quick setup.
- **Realtime Data Updates:** Automatic revalidation and continuous data refresh.
- **SSR/SSG Ready:** Perfect for NextJS, Gatsby, and other SSR/SSG frameworks.
- **No Extra Context Required:** Use our hooks directly without extra providers.
- **Fully Type-Safe:** Your API calls are strictly typed, reducing runtime errors.

---

## Installation 🛠️

Install the package via npm, bun, pnpm or yarn

```bash
npm install eden-swr
```

```bash
bun i eden-swr
```

```bash
pnpm i eden-swr
```

```bash
yarn add eden-swr
```

---

## Examples 📚

### Basic Example

Kickstart with a simple, fully-typed React component:

```typescript
import { createUseEdenSWR } from "eden-swr";
import type { App } from "./your-elysia-app";

// Creating SWR hooks with full TypeScript support 🚀
const useEdenSWR = createUseEdenSWR<App>("/api");

function UserProfile({ userId }: { userId: string }) {
  // Using SWR hook with full type inference //
  const { data, error, isLoading } = useEdenSWR("/users/:id" /* ✅ typed!*/, {
    params: { id: userId } /* ✅ typed!*/,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user 😢</div>;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div>
      <h1>{data.name}</h1> {/* ✅ typed! */}
      <p>{data.email}</p> {/* ✅ typed! */}
    </div>
  );
}
```

See usage examples [here](https://github.com/nickerlan/eden-swr/blob/main/src/examples/sample.ts)

---

Below is an example of exporting the Elysia app type for the route "/params/:param1/:param2":

```typescript
import { Elysia, t } from "elysia";

const app = new Elysia().get(
  "/params/:param1/:param2",
  ({ params }) => ({
    params: { param1: params.param1, param2: params.param2 },
  }),
  {
    params: t.Object({
      param1: t.String(),
      param2: t.String(),
    }),
  }
);

// Export the Elysia app type
export type App = typeof app;
```

This example demonstrates how to create a simple Elysia app with the specified route and export its type.

---

### Query Parameters Example

Fetch data using query parameters with full type-safety:

```typescript
// Example with query parameters 🌟
const { data: queryData } = useEdenSWR("/query", {
  query: { search: "123" }, //  ✅ typed!
});

// 📝 note: this query works perfectly in eden-swr with complete type safety.
if (queryData) {
  console.log(queryData.query); // ✅ typed!
}
```

---

### Route Parameters Example

Utilize dynamic route parameters in your requests:

```typescript
// Example with route parameters 😎
const { data: paramsData } = useEdenSWR("/params/:param1/:param2", {
  params: { param1: "123", param2: "456" },
  query: { search: "123" },
});

if (paramsData) {
  console.log(paramsData.params.param1); // ✅ typed!
}
```

---

### Advanced SWR Configuration

Customize SWR options to suit your app's needs:

```typescript
// Advanced configuration example 🎛️
const { data: paramsData2 } = useEdenSWR(
  "/params/:param1/:param2",
  {
    params: { param1: "123", param2: "456" },
    query: { search: "123" },
  },
  {
    cacheKey: "/params/one/two?three=four", // 🎯 Custom cache key
    //by default, cahce key would be /params/123/456?search=123
    revalidateOnFocus: true, // 🌐 Revalidate on focus
    refreshInterval: 1000, // 🌐 Auto-refresh every second
    // ... any other SWR options
  }
);
// 📝 note: All options are fully validated by TypeScript.
```

Documentation on SWR options: https://swr.vercel.app/docs/api

---

## Key Features

- **Type-Safe Development:** Leverage TypeScript for error prevention, auto-completion, and comprehensive parameter validation
- **SWR Power Features:** Take advantage of automatic revalidation, intelligent caching, and configurable refresh intervals
- **Zero Configuration:** Works immediately with React and NextJS without providers or complex setup
- **Developer Experience:** Focus on building features rather than configuring tools

---

## Why eden-swr? ✅

- **Perfect Integration:** Combines [Elysia Eden](https://elysiajs.com/eden/overview.html) and [SWR](https://swr.vercel.app/) into a seamless experience
- **Zero overhead:** Minimal API surface with maximum functionality
- **Performance Oriented:** Optimized for both development speed and runtime efficiency

---

## License

MIT © Nick Erlan
