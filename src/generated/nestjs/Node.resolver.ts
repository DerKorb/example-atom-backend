import {
    ActingUserPublicId,
    ContextValues,
    LockProvider,
    LockServiceToken,
    setActingUser,
    Transaction,
    TransactionContext,
    useAsContext,
} from "@feinarbyte/atom-module";
import { Inject } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { GraphQLJSON } from "graphql-type-json";
import { createChild } from "../../examples/createChild";
@Resolver()
export class NodeResolver {
    constructor(private context: TransactionContext, @Inject(LockServiceToken) private lockService: LockProvider) {
        if (!this.context) {
            throw new Error("no context");
        }
    }

    @Mutation(() => Boolean)
    @Transaction()
    public async createChild(
        @setActingUser() @ActingUserPublicId() _publicId: string,
        @useAsContext()
        @Args({ name: "context", type: () => GraphQLJSON })
        _context: ContextValues<string>,
        @Args({ name: "newCode", type: () => String }) newCode,
        @Args({ name: "label", type: () => String }) label,
    ): Promise<boolean> {
        await createChild(this.context, newCode, label);

        return true;
    }
}
