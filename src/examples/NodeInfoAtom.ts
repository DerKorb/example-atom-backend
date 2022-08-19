import { ActiveAtom, Atom } from "@feinarbyte/atom-module";
import { Code } from "./collabtree.config";
import { INodeInfo } from "./INodeInfo";
import { CollabTreeAtomType } from "./CollabTreeAtomType";
import { CollabTreeRelation } from "./CollabTreeRelation";

@ActiveAtom({
    relation: CollabTreeRelation.Node,
    provideViaAtomResolver: (x) => x,
})
export class NodeInfoAtom extends Atom<CollabTreeAtomType> implements INodeInfo {
    public __type = CollabTreeAtomType.NodeInfo;

    public label: Code;
}
