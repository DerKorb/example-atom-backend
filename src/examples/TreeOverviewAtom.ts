import { ActiveAtom, Atom, AtomConstructor, AtomData, VirtualAtom } from "@feinarbyte/atom-module";
import { getElementByCode } from "./getElementByCode";
import { ITreeElement } from "./ITreeElement";
import { NodeInfoAtom } from "./NodeInfoAtom";
import { NodeWeightsAtom } from "./NodeWeightsAtom";
import { ITreeOverview, Code } from "./collabtree.config";
import { CollabTreeAtomType } from "./CollabTreeAtomType";
import { CollabTreeRelation } from "./CollabTreeRelation";
import { CollabTreeContext } from "./CollabTreeContext";

@ActiveAtom({
    relation: CollabTreeRelation.Project,
    provideViaAtomResolver: (context, stateToMask) => stateToMask,
})
export class TreeOverviewAtom extends VirtualAtom<CollabTreeAtomType, ITreeOverview> implements ITreeOverview {
    protected __provideEmptyValue(): ITreeOverview {
        return {
            code: "r" as Code,
            label: "root",
            children: {},
        };
    }

    code: Code;

    label: string;

    children: { [key: string]: ITreeElement | string };

    public __type = CollabTreeAtomType.TreeOverview;

    public static dependencies = [{ ctor: NodeWeightsAtom }, { ctor: NodeInfoAtom }];

    public async __onDependencyChange(
        query: string,
        newValue: AtomData,
        ctor: AtomConstructor<Atom<string, AtomData>>,
    ): Promise<void> {
        if (ctor === NodeInfoAtom) {
            const code = this.__getContextEntry<Code>(CollabTreeContext.Code);
            const node = getElementByCode(this.getValue(), code);
            if (node) {
                node.label = newValue.label;
            } else {
                const parent = getElementByCode(this, code, -1);
                if (!parent) {
                    console.log(this.getValue(), code);
                    throw new Error("parent not found");
                }
                const lastCode = code.split(".").pop() as Code;
                parent.children[lastCode] = {
                    code: lastCode,
                    label: newValue.label,
                    children: {},
                };
            }
        }
    }
}
