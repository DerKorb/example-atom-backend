import { TransactionContext } from "@feinarbyte/atom-module";
import { CollabTreeContext } from "./CollabTreeContext";
import { NodeInfoAtom } from "./NodeInfoAtom";

export async function createProject(context: TransactionContext, projectName: string): Promise<void> {
    await context.withOverride(
        {
            [CollabTreeContext.ProjectId]: projectName,
        },
        async () => {
            await context.spawnAtom(NodeInfoAtom, { label: projectName }, { [CollabTreeContext.Code]: "root" });
        },
    );
}
