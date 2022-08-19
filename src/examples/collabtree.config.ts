/**
 * a collaborative tree editor
 * collaborators can be given permissions from a level to another level
 */

import {
    ProjectConfig,
    SetAtomDataType,
    TransactionContext,
    User,
    UserId,
    UserPublicID,
} from "@feinarbyte/atom-module";

import { find } from "lodash";
import { CollabTreeAtomType } from "./CollabTreeAtomType";
import { CollabTreeContext } from "./CollabTreeContext";
import { CollabTreeRelation } from "./CollabTreeRelation";
import { createChild } from "./createChild";
import { createProject } from "./createProject";
import { ITreeElement } from "./ITreeElement";
import { NodeInfoAtom } from "./NodeInfoAtom";
import { NodeWeightsAtom } from "./NodeWeightsAtom";
import { TreeOverviewAtom } from "./TreeOverviewAtom";
export type makeType<label extends string> = `${label}_placeholder` | `${label}_placeholder1`;

export type Code = makeType<"code">;

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

export type ITreeOverview = ITreeElement;

export const CollabTree: ProjectConfig<CollabTreeAtomType, CollabTreeContext, CollabTreeRelation> = {
    atomIndex: {
        [CollabTreeAtomType.NodeInfo]: NodeInfoAtom,
        [CollabTreeAtomType.NodeWeights]: NodeWeightsAtom,
        [CollabTreeAtomType.TreeOverview]: TreeOverviewAtom,
    },
    relations: {
        [CollabTreeRelation.Node]: {
            identifier: CollabTreeContext.Code,
            identifierType: "string",
            parents: [CollabTreeRelation.Project],
            pathes: (name: string) => [
                `/project/${CollabTreeContext.ProjectId}/node/${CollabTreeContext.Code}/${name}`,
            ],

            reducers: [createChild],
        },
        [CollabTreeRelation.Project]: {
            identifier: CollabTreeContext.ProjectId,
            identifierType: "string",
            parents: [null],
            pathes: (name: string) => [`/project/${CollabTreeContext.ProjectId}/${name}`],
            reducers: [createProject],
        },
        [User]: {
            identifier: UserId,
            identifierType: "string",
            parents: [null],
            pathes: (name: string) => [`/user/${UserId}/${name}`],
            reducers: [],
        },
    },
};
