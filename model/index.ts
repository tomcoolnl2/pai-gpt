import { ConversationSet } from 'model/ConversationSet';
import { v4 as uuid } from 'uuid';

export interface DatedEntity {
	creationDate: Date;
	editedDate: Date;
}

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
		public creationDate = new Date(),
		public editedDate = new Date(),
	) {}
}

export interface ConversationPayload {
	_id: string;
	title: string;
	messages: MessagePayload[] | null;
}

export abstract class Message implements DatedEntity {
	//
	abstract readonly role: Role;
	public content: string;

	public done: boolean = true;

	constructor(
		public id: string,
		public creationDate = new Date(),
		public editedDate = new Date(),
	) {}

	public get payload(): MessagePayload {
		return new MessagePayload(this);
	}
}

export class MessagePayload {
	public role: string;
	public content: string;
	public creationDate: string;
	public editedDate: string;
	constructor(message: Message) {
		this.role = message.role as string;
		this.content = message.content;
		this.creationDate = message.creationDate.toISOString();
		this.editedDate = message.editedDate.toISOString();
	}
}

export class QuestionMessage extends Message {
	//
	readonly role = Role.USER;

	constructor(public content: string) {
		super(uuid());
	}
}

export class AnswerMessage extends Message {
	//
	readonly role = Role.ASSISTANT;

	constructor(
		public content: string = '',
		public done: boolean = false,
	) {
		super(uuid());
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
		super(uuid());
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
