import { v4 as uuid } from 'uuid';

export enum ConversationRole {
	SYSTEM = 'system',
	USER = 'user',
	ASSISTANT = 'assistant',
}

export abstract class Message {
	//
	public id: string;

	abstract readonly role: ConversationRole;

	public content: string;

	constructor() {
		this.id = uuid();
	}
}

export class QuestionMessage extends Message {
	//
	readonly role = ConversationRole.USER;

	constructor(public content: string) {
		super();
	}
}

export class AnswerMessage extends Message {
	//
	readonly role = ConversationRole.ASSISTANT;

	public done: boolean = true;

	constructor(public content: string = '') {
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

	readonly role = ConversationRole.SYSTEM;

	readonly done: boolean = true;

	constructor() {
		super();
	}
}

export class SystemErrorMessage extends SystemMessage {
	//
	readonly type = SystemMessageType.ERROR;

	constructor(public content: string) {
		super();
	}
}
