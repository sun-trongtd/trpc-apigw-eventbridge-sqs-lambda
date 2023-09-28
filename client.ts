import {createTRPCProxyClient, httpBatchLink} from "@trpc/client";
import {AppRouter} from "./server";

export const appRouter = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: "URL API gateway",
        }),
    ],
});

// appRouter.sqs.mutate()
// AppRouter is not a router to be call from client