import { Elysia, t } from "elysia";
import { createEdenSWR } from "..";

const app = new Elysia()
  .get("/", () => {
    return { message: "Hello World" };
  })
  .get(
    "/params/:param1/:param2",
    ({ params, query }) => {
      return {
        params: { param1: params.param1, param2: params.param2 },
        query: query.search,
      };
    },
    {
      params: t.Object({
        param1: t.String(),
        param2: t.String(),
      }),
      query: t.Object({
        search: t.String(),
      }),
    }
  )
  .get(
    "/query",
    ({ query }) => {
      return { query: query.search };
    },
    {
      query: t.Object({
        search: t.String(),
      }),
    }
  );

const url = "/api";

const { eden, fetch, useEdenSWR } = createEdenSWR<typeof app>(url);

const { data: indexData } = useEdenSWR("/index" /* ✅ typed! */);
// 📝 note, that this query WORKS in eden-swr
// and doesn't work in eden-fetch itself due to the bug

if (indexData) {
  indexData.message; // ✅ typed!
}

const { data: queryData } = useEdenSWR("/query", {
  query: { search: "123" }, // ✅ typed!
});
if (queryData) {
  queryData.query; // ✅ typed!
}

const { data: paramsData } = useEdenSWR("/params/:param1/:param2", {
  params: { param1: "123", param2: "456" }, // ✅ typed!
  query: { search: "123" }, // ✅ typed!
});
if (paramsData) {
  paramsData.params.param1; // ✅  typed!
}

const { data: paramsData2, isLoading } = useEdenSWR(
  "/params/:param1/:param2",
  {
    params: { param1: "123", param2: "456" },
    query: { search: "123" },
  },
  {
    cacheKey: "/params/one/two", // 📝 by default cacheKey would be `/params/123/456?search=123`
    revalidateOnFocus: true, //✅  SWR options also available here
    refreshInterval: 1000,
  }
);
