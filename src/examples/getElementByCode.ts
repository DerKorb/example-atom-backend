import { ITreeElement } from "./ITreeElement";
import { ITreeOverview, Code } from "./collabtree.config";

export function getElementByCode(tree: ITreeOverview, code: Code, offset?: number): ITreeElement | undefined {
    const parts = code.split(".").slice(1, offset);
    let current: ITreeElement = tree;
    for (const part of parts) {
        console.log("xxx ->", current, part);
        if (current.children[part] === undefined) {
            return undefined;
        }

        if (typeof current.children[part] === "string") {
            // if a node has been moved
            return getElementByCode(tree, current.children[part] as Code);
        } else {
            current = current.children[part] as ITreeElement;
        }
    }

    return current;
}
