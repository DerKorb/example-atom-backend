import { TransactionContext } from "@feinarbyte/atom-module";
import { CollabTreeContext } from "./CollabTreeContext";
import { NodeInfoAtom } from "./NodeInfoAtom";

export async function createChild(context: TransactionContext, newCode: string, label: string): Promise<void> {
    await context.spawnAtom(
        NodeInfoAtom,
        {
            label,
        },
        { [CollabTreeContext.Code]: context.getEntryOrThrow(CollabTreeContext.Code) + "." + newCode },
    );
}
