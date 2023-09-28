import * as trpc from '@trpc/server';
import { ServerlessAdapter } from '@h4ad/serverless-adapter';
import { TrpcFramework, TrpcAdapterContext, TrpcFrameworkOptions } from '@h4ad/serverless-adapter/lib/frameworks/trpc';
import { JsonBodyParserFramework } from '@h4ad/serverless-adapter/lib/frameworks/body-parser';
import { z } from 'zod';
import {ApiGatewayV2Adapter, EventBridgeAdapter, SQSAdapter} from "@h4ad/serverless-adapter/lib/adapters/aws";
import {} from "@h4ad/serverless-adapter/lib/handlers/aws/aws-stream.handler";
import {PromiseResolver} from "@h4ad/serverless-adapter/lib/resolvers/promise";
import {DefaultHandler} from "@h4ad/serverless-adapter/lib/handlers/default";
import type { SQSEvent } from 'aws-lambda';

type CustomContext = { currentDate: Date };
type TrpcContext = TrpcAdapterContext<CustomContext>;
const t = trpc.initTRPC.context<TrpcContext>().create();

const appRouter = t.router({
  sqs: t.procedure.input(z.object({
        Records: z.array(z.any()),
      })
  ).mutation(async ({ input, ctx }) => {
    const event = input as SQSEvent;
    console.log('Received event:', JSON.stringify(event));
    const json = JSON.parse(event.Records[0].body);
    const path = json.data.path;
    switch (path) {
        case "/createReservation":
            // Excute logic create reServation
            break;
        case "/createDriver":
        // Excute logic create reServation
            break;
        // ...
    }
  }),
});

export type AppRouter = typeof appRouter;

const frameworkOptions: TrpcFrameworkOptions<CustomContext> = {
  createContext: () => ({ currentDate: new Date() }),
};

const framework = new TrpcFramework<TrpcContext>(frameworkOptions);
const jsonFramework = new JsonBodyParserFramework(framework);
// const corsFramework = new CorsFramework(jsonFramework); // see more about: https://serverless-adapter.viniciusl.com.br/docs/main/frameworks/cors

export const handler = ServerlessAdapter.new(appRouter)
    .setFramework(jsonFramework)
    // continue to set the other options here.
    .setHandler(new DefaultHandler())
    .setResolver(new PromiseResolver())
    // .addAdapter(new EventBridgeAdapter())
    .addAdapter(new ApiGatewayV2Adapter())
    .addAdapter(new SQSAdapter())

    //.addAdapter(new SNSAdapter())
    // after put all methods necessary, just call the build method.
    .build();
