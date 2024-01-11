import { ConversationSet } from 'model/ConversationSet';
import { v4 as uuid } from 'uuid';

export enum Role {
	SYSTEM = 'system',
	USER = 'user',
	ASSISTANT = 'assistant',
}

export class Conversation {
	constructor(
		public id: string,
		public title: string,
		public messages: ConversationSet<Message> = null,
	) {}
}

export interface ConversationPayload {
	_id: string;
	title: string;
	messages: MessagePayload[] | null;
}

export abstract class Message {
	//
	public id: string;
	public conversationId: string;
	public content: string;
	public done: boolean = true;
	abstract readonly role: Role;

	constructor() {
		this.id = uuid();
	}

	public get payload(): MessagePayload {
		return new MessagePayload(this.role, this.content);
	}
}

export class MessagePayload {
	constructor(
		public role: Role,
		public content: string,
	) {}
}

export class QuestionMessage extends Message {
	//
	readonly role = Role.USER;

	constructor(public content: string) {
		super();
	}
}

export class AnswerMessage extends Message {
	//
	readonly role = Role.ASSISTANT;

	constructor(
		public content: string = '',
		public done: boolean = false,
	) {
		super();
	}
}

export enum SystemMessageType {
	ERROR = 'error',
	INFO = 'info',
	WARN = 'warn',
}

export abstract class SystemMessage extends Message {
	//
	abstract readonly type: SystemMessageType;
	public readonly role = Role.SYSTEM;

	constructor(public content: string) {
		super();
	}
}

export class SystemWarningMessage extends SystemMessage {
	public readonly type = SystemMessageType.WARN;
}

export class SystemErrorMessage extends SystemMessage {
	public readonly type = SystemMessageType.ERROR;
}

export const roleToConstructor: Record<string, new (content: string) => Message> = {
	[Role.USER]: QuestionMessage,
	[Role.ASSISTANT]: AnswerMessage,
};
