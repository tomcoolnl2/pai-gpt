import { v4 as uuid } from 'uuid';

export enum Role {
	SYSTEM = 'system',
	USER = 'user',
	ASSISTANT = 'assistant',
}

export abstract class Message {
	//
	public id: string;

	abstract readonly role: Role;

	public content: string;

	public done: boolean = true;

	constructor() {
		this.id = uuid();
	}
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

	readonly role = Role.SYSTEM;

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
