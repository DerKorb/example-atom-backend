import { ActiveAtom, Atom } from "@feinarbyte/atom-module";
import { INodeWeights, Code } from "./collabtree.config";
import { CollabTreeAtomType } from "./CollabTreeAtomType";
import { CollabTreeRelation } from "./CollabTreeRelation";

@ActiveAtom({
    relation: CollabTreeRelation.Node,
    provideViaAtomResolver: (x) => x,
})
export class NodeWeightsAtom extends Atom<CollabTreeAtomType> implements INodeWeights {
    public __type = CollabTreeAtomType.NodeWeights;

    public entries: {
        [key in Code]: number;
    };
}
