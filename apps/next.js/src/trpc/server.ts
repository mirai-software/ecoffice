import { createTRPCProxyClient, loggerLink, httpBatchLink } from "@trpc/client";
import { cookies } from "next/headers";

import { type AppRouter } from "@ecoffice/api";
import { getUrl } from "./shared";
import { transformer } from "@ecoffice/api/trasformer";

export const api = createTRPCProxyClient<AppRouter>({
  transformer,
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    httpBatchLink({
      url: getUrl(),
      headers() {
        console.log("cookies ===", cookies().toString());
        return {
          cookie: cookies().toString(),
          "x-trpc-source": "rsc",
        };
      },
    }),
  ],
});
