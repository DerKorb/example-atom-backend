import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AtomModule } from '@feinarbyte/atom-module';
import { GraphQLModule } from '@nestjs/graphql/dist/graphql.module';
import { AtomResolver } from '@feinarbyte/atom-module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ChatConfig } from './examples/chat.config';
import { Context } from 'apollo-server-core';
import { GqlModuleOptions } from '@nestjs/graphql';

@Module({
  imports: [
    AtomModule.forRoot({
      projectConfig: ChatConfig, // <-- 1. go here
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async (): Promise<Omit<ApolloDriverConfig, 'driver'>> => ({
        autoSchemaFile: true,
        playground: true,
        installSubscriptionHandlers: true,
        subscriptions: {
          'subscriptions-transport-ws': true,
          'graphql-ws': {
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            onConnect: (context: Context<any>) => {
              const { connectionParams, extra } = context;
              const token = connectionParams?.token;
              console.log(1);
              throw new Error('123');
              // returning false here will cause urql to try to connect again

              // this mocks the headers into the right place in the context
              // so none of the rest of our code has to change
              (extra as any).headers = { authorization: `Bearer ${token}` };
            },
          },
        },
        cors: {
          credentials: true,
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
          origin: '*',
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
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AtomResolver],
})
export class AppModule {}
