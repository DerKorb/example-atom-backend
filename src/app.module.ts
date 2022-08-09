import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AtomModule } from '@feinarbyte/atom-module';
import { GraphQLModule } from '@nestjs/graphql/dist/graphql.module';
import { AtomResolver } from '@feinarbyte/atom-module/dist/atom.resolver';
import { ApolloDriver } from '@nestjs/apollo';
import { EventEmitterModule } from '@nestjs/event-emitter/dist/event-emitter.module';
import { ChatConfig } from './examples/chat.config';
import { RoomResolver } from './generated/nestjs/Room.resolver';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '/',
      global: true,
    }),
    AtomModule.forRoot({
      projectConfig: ChatConfig, // <-- 1. go here
    }),
    GraphQLModule.forRoot({
      resolvers: [AtomResolver, RoomResolver],
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AtomResolver, RoomResolver],
})
export class AppModule {}
