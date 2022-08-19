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
import { createProject } from "src/examples/createProject";
@Resolver()
export class ProjectResolver {
    constructor(private context: TransactionContext, @Inject(LockServiceToken) private lockService: LockProvider) {
        if (!this.context) {
            throw new Error("no context");
        }
    }

    @Mutation(() => Boolean)
    @Transaction()
    public async createProject(
        @setActingUser() @ActingUserPublicId() _publicId: string,
        @useAsContext()
        @Args({ name: "context", type: () => GraphQLJSON })
        _context: ContextValues<string>,
        @Args({ name: "projectName", type: () => String }) projectName,
    ) {
        await createProject(this.context, projectName);

        return true;
    }
}
