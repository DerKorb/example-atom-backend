import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AtomModule } from "@feinarbyte/atom-module";
import { GraphQLModule } from "@nestjs/graphql/dist/graphql.module";
import { AtomResolver } from "@feinarbyte/atom-module";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ChatConfig } from "./examples/chat.config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { CollabTree } from "./examples/collabtree.config";
import { Context } from "graphql-ws";
import { ProjectResolver } from "./generated/nestjs/Project.resolver";

@Module({
    imports: [
        AtomModule.forRoot({
            projectConfig: CollabTree, // <-- 1. go here
        }),
        EventEmitterModule.forRoot({ global: true }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
            playground: true,
            installSubscriptionHandlers: true,
            subscriptions: {
                "graphql-ws": {
                    onConnect: (context: Context<any>) => {
                        const { connectionParams, extra } = context;
                        const token = connectionParams?.token;
                        // returning false here will cause urql to try to connect again
                        if (!token) {
                            return false;
                        }

                        // this mocks the headers into the right place in the context
                        // so none of the rest of our code has to change
                        (extra as any).headers = { authorization: `Bearer ${token}` };
                    },
                },
                "subscriptions-transport-ws": true,
            },
            context: ({ extra, req }) => {
                if (extra?.request) {
                    return {
                        req: {
                            ...extra?.request,
                            headers: {
                                ...extra?.request?.headers,
                                ...extra?.headers,
                            },
                        },
                    };
                }

                return { req: req };
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService, AtomResolver, ProjectResolver],
})
export class AppModule {}
