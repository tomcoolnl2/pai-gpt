export class Message {
	constructor(
		public id: string,
		public role: ConversationRole,
		public content: string,
	) {}
}

export class Answer {
	constructor(
		public content: string = '',
		public done: boolean = false,
	) {}
}

export enum ConversationRole {
	USER = 'user',
	ASSISTENT = 'assistant',
}
