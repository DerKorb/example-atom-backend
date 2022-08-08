import { ProjectConfig, Atom } from '@feinarbyte/atom-module';
import { AtomConstructor } from '@feinarbyte/atom-module/dist/AtomUtilityTypes';
import { ActiveAtom } from '@feinarbyte/atom-module/dist/decorators/ActiveAtom';

/**
 * what relations do exist in your data?
 * lets asume a simple chat
 */
export enum ChatRelation {
  Room = 'Room',
}

export enum ChatAtomType {
  Messages = 'Messages',
}

/** so lets look at an atom */
@ActiveAtom({
  relation: ChatRelation.Room,
})
export class MessagesAtom extends Atom<ChatAtomType> {
  public __type = ChatAtomType.Messages;
}

/**
 * hopefully deprecateable dictionary of all atoms
 */
export const chatAtoms: { [key in ChatAtomType]: AtomConstructor } = {
  [ChatAtomType.Messages]: MessagesAtom,
};

/**
 * config for your app
 */
export const ChatConfig: ProjectConfig<ChatAtomType> = {
  atomIndex: chatAtoms,
  relations: {
    [ChatRelation.Room]: {
      identifier: ChatRelation.Room,
      identifierType: 'string',
      parents: [null],
      pathes: (name: string) => [`/room/${ChatRelation.Room}/${name}`],
      reducers: [],
    },
  },
};
