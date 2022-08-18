import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AtomModule } from '@feinarbyte/atom-module';
import { GraphQLModule } from '@nestjs/graphql/dist/graphql.module';
import { AtomResolver } from '@feinarbyte/atom-module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ChatConfig } from './examples/chat.config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    AtomModule.forRoot({
      projectConfig: ChatConfig, // <-- 1. go here
    }),
    EventEmitterModule.forRoot({ global: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      installSubscriptionHandlers: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AtomResolver],
})
export class AppModule {}
