export class Message {
	constructor(
		public id: string,
		public role: ConversationRole,
		public content: string,
	) {}
}

export enum ConversationRole {
	USER = 'user',
	ASSISTENT = 'assistant',
}
