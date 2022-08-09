import {
  Atom,
  ProjectConfig,
  TransactionContext,
} from '@feinarbyte/atom-module';
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

interface IChatMessages {
  messages: string[];
}

/** so lets look at an atom */
@ActiveAtom({
  relation: ChatRelation.Room,
})
export class MessagesAtom extends Atom<ChatAtomType> implements IChatMessages {
  public __type = ChatAtomType.Messages;
  public messages: string[] = [];
}

/**
 * config for your app
 */
export const ChatConfig: ProjectConfig<ChatAtomType> = {
  atomIndex: {
    [ChatAtomType.Messages]: MessagesAtom,
  },
  relations: {
    [ChatRelation.Room]: {
      identifier: ChatRelation.Room,
      identifierType: 'string',
      parents: [null],
      pathes: (name: string) => [`/room/${ChatRelation.Room}/${name}`],
      reducers: [sendMessage],
    },
  },
};

export async function sendMessage(
  context: TransactionContext,
  message: string,
): Promise<void> {
  const messages = await context.aquireAtom(MessagesAtom);
  messages.push(message);
}
