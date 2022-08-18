/**
 * a collaborative tree editor
 * collaborators can be given permissions from a level to another level
 */

import {
  ActiveAtom,
  Atom,
  AtomConstructor,
  AtomData,
  ProjectConfig,
  SetAtomDataType,
  TransactionContext,
  User,
  UserId,
  UserPublicID,
  VirtualAtom,
} from '@feinarbyte/atom-module';

export type makeType<label extends string> =
  | `${label}_placeholder`
  | `${label}_placeholder1`;

export type Code = makeType<'code'>;

export enum CollabTreeContext {
  Code = '<Code>',
  ProjectId = '<ProjectId>',
}

export enum CollabTreeRelation {
  Project = 'Project',
  Node = 'Node',
}

export enum CollabTreeAtomType {
  NodeInfo = 'NodeInfo',
  NodeWeights = 'NodeWeights',
  TreeOverview = 'TreeOverview',
}

export interface INodeInfo {
  label: Code;
}

export type INodeWeights = SetAtomDataType<Code, number>;

export enum NodePermission {}

export interface INodeAccess {
  mayShare: boolean;
}

export type INodeAccessMap = { [key in NodePermission]?: INodeAccess };

export type INodePermissions = SetAtomDataType<UserPublicID, INodeAccessMap>;

export async function shareNode(
  context: TransactionContext,
  node: Code,
  user: UserPublicID,
  permission: NodePermission,
  access: INodeAccess,
): Promise<void> {
  // const nodePermissions = await context.aquireAtom(NodePermissionsAtom);
  // nodePermissions.set(user, {
  //   [permission]: access,
  // });
}

export async function createChild(
  context: TransactionContext,
  parent: Code,
  child: Code,
): Promise<void> {
  const nodeWeights = await context.aquireAtom(NodeWeightsAtom);
  nodeWeights.set(child, {
    [parent]: 1,
  });
}

export async function createTree(
  context: TransactionContext,
  root: Code,
  children: Code[],
): Promise<void> {
  const nodeWeights = await context.aquireAtom(NodeWeightsAtom);
  nodeWeights.set(root, {
    [root]: 1,
  });
  for (const child of children) {
    createChild(context, root, child);
  }
}

export async function createProject(
  context: TransactionContext,
  projectName: string,
): Promise<void> {
  await context.spawnAtom(NodeInfoAtom, {
    label: projectName,
  });
}

@ActiveAtom({
  relation: CollabTreeRelation.Node,
})
export class NodeInfoAtom
  extends Atom<CollabTreeAtomType>
  implements INodeInfo
{
  public __type = CollabTreeAtomType.NodeInfo;
  public label: Code;
}

@ActiveAtom({
  relation: CollabTreeRelation.Node,
})
export class NodeWeightsAtom
  extends Atom<CollabTreeAtomType>
  implements INodeWeights
{
  public __type = CollabTreeAtomType.NodeWeights;
  public entries: { [key in Code]: number };
}

export interface ITreeOverview {
  nodes: Code[];
  edges: [Code, Code][];
}

@ActiveAtom({
  relation: CollabTreeRelation.Project,
  provideViaAtomResolver: (x) => x,
})
export class TreeOverviewAtom
  extends VirtualAtom<CollabTreeAtomType, ITreeOverview>
  implements ITreeOverview
{
  protected __provideEmptyValue(): ITreeOverview {
    throw new Error('Method not implemented.');
  }
  nodes: Code[];
  edges: [Code, Code][];
  public __type = CollabTreeAtomType.NodeInfo;
  public static dependencies = [
    { ctor: NodeWeightsAtom },
    { ctor: NodeInfoAtom },
  ];
  public async __onDependencyChange(
    query: string,
    newValue: AtomData,
    ctor: AtomConstructor<Atom<string, AtomData>>,
  ): Promise<void> {
    // if (ctor === NodeWeightsAtom) {
    //     this.nodes = Object.keys(newValue.entries);
    //     this.edges = [];
    //     for (const node of this.nodes) {
    //         for (const child of Object.keys(newValue.entries[node])) {
    //             this.edges.push([node, child]);
    //         };
    //     };
    // } else if (ctor === NodeInfoAtom) {
    //     this.nodes = Object.keys(newValue.entries);
    //     this.edges = [];
    //     for (const node of this.nodes) {
    //         for (const child of Object.keys(newValue.entries[node])) {
    //             this.edges.push([node, child]);
    //         }
    //     }
    // }
  }
}

export const CollabTree: ProjectConfig<
  CollabTreeAtomType,
  CollabTreeContext,
  CollabTreeRelation
> = {
  atomIndex: {
    [CollabTreeAtomType.NodeInfo]: NodeInfoAtom,
    [CollabTreeAtomType.NodeWeights]: NodeWeightsAtom,
    [CollabTreeAtomType.TreeOverview]: TreeOverviewAtom,
  },
  relations: {
    [CollabTreeRelation.Node]: {
      identifier: CollabTreeContext.Code,
      identifierType: 'string',
      parents: [null],
      pathes: (name: string) => [`/node/${CollabTreeRelation.Node}/${name}`],

      reducers: [],
    },
    [CollabTreeRelation.Project]: {
      identifier: CollabTreeContext.ProjectId,
      identifierType: 'string',
      parents: [null],
      pathes: (name: string) => [
        `/project/${CollabTreeContext.ProjectId}/${name}`,
      ],
      reducers: [createProject],
    },
    [User]: {
      identifier: UserId,
      identifierType: 'string',
      parents: [null],
      pathes: (name: string) => [`/user/${UserId}/${name}`],
      reducers: [],
    },
  },
};
