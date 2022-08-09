import {
  ActingUserPublicId,
  ContextValues,
  LockProvider,
  LocksToken,
  setActingUser,
  Transaction,
  TransactionContext,
  useAsContext,
} from '@feinarbyte/atom-module';
import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { sendMessage } from 'src/examples/chat.config';
@Resolver()
export class RoomResolver {
  constructor(
    private context: TransactionContext,
    @Inject(LocksToken) private lockService: LockProvider,
  ) {
    if (!this.context) {
      throw new Error('no context');
    }
  }

  @Transaction()
  @Mutation(() => Boolean)
  public async sendMessage(
    @setActingUser() @ActingUserPublicId() _publicId: string,
    @useAsContext()
    @Args({ name: 'context', type: () => GraphQLJSON })
    _context: ContextValues<string>,
    @Args({ name: 'message', type: () => String }) message,
  ) {
    await sendMessage(this.context, message);

    return true;
  }
}
