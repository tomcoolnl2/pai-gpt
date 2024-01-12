import {
	Message,
	MessagePayload,
	AnswerMessage,
	SystemErrorMessage,
	Conversation,
	QuestionMessage,
	ConversationPayload,
	roleToConstructor,
} from 'model';
import { ConversationSet } from 'model/ConversationSet';

/**
 * Handles API interactions related to conversations.
 */
export class ConversationApi {
	/**
	 * Creates a new ConversationApi instance.
	 * @param {React.Dispatch<React.SetStateAction<Message | null>>} streamCallback - Callback function to handle message updates.
	 */
	constructor(public streamCallback: React.Dispatch<React.SetStateAction<Message | null>>) {}

	/**
	 * Public boolean to cancel a stream if needed.
	 * @type {boolean}
	 */
	public cancelReadableStream: boolean = false;

	/**
	 * Provides the default request configuration for API calls.
	 * @type {Object}
	 * @private
	 */
	private requestInit: RequestInit = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	};

	/**
	 * Checks if the response is valid.
	 * @param {Response} response - The response to check.
	 * @returns {boolean} - True if the response is valid, otherwise false.
	 * @private
	 */
	private responseIsValid(response: Response): boolean {
		const message = 'Something went wrong... Please hit any user to proceed!';
		if (!response.ok || !response.body) {
			this.handleError(message);
			return false;
		}
		return true;
	}

	/**
	 * Handles errors by sending a system error message.
	 * @param {string} message - The error message to handle.
	 * @private
	 */
	private handleError(message: string): void {
		const systemMessage = new SystemErrorMessage(message);
		systemMessage.done = false;
		this.streamCallback(systemMessage);
	}

	/**
	 * Formats an answer message.
	 * @param {string} conversationId - Id of the conversation.
	 * @param {Message} prevAnswer - The previous answer message.
	 * @param {string} chunk - The chunk of data to format.
	 * @param {boolean} done - Indicates if reading is complete.
	 * @returns {AnswerMessage} - The formatted answer message.
	 * @private
	 */
	private formatAnswer(conversationId: string, prevAnswer: Message, chunk: string, done: boolean): AnswerMessage {
		const answer = new AnswerMessage();
		if (prevAnswer instanceof AnswerMessage) {
			Object.assign(answer, prevAnswer);
		}
		answer.conversationId = conversationId;
		answer.content += chunk;
		answer.done = done;
		return answer;
	}

	/**
	 * Generates a message stream from the provided data.
	 * @param {string} conversationId - Id of the conversation.
	 * @param {ReadableStream<Uint8Array>} data - The data stream to generate from.
	 * @returns {Promise<void>} - A promise that resolves when the stream generation is complete.
	 * @private
	 */
	private async generateStream(conversationId: string, data: ReadableStream<Uint8Array>): Promise<void> {
		//
		const reader = data.getReader();
		const decoder = new TextDecoder();
		let doneReading = false;

		while (!doneReading) {
			//
			const { value, done } = await reader.read();
			let chunk = '';

			doneReading = done;

			if (this.cancelReadableStream) {
				reader.cancel();
				this.cancelReadableStream = false;
			}

			if (value) {
				chunk = decoder.decode(value);
			}

			if (value || done) {
				this.streamCallback((answer) => {
					return this.formatAnswer(conversationId, answer, chunk, done);
				});
			}
		}
	}

	/**
	 * Sends a message.
	 * @param {string} conversationId - Id of the conversation.
	 * @param {MessagePayload} payload - The message payload to send.
	 * @returns {Promise<void>} - A promise that resolves when the message is sent.
	 */
	public async sendMessage(conversationId: string, payload: MessagePayload): Promise<void> {
		try {
			const response = await fetch('/api/chat/sendMessage', {
				...this.requestInit,
				body: JSON.stringify({ conversationId, payload }),
			});

			if (this.responseIsValid(response)) {
				this.generateStream(conversationId, response.body);
			}
		} catch (error: unknown) {
			const messageError = error instanceof Error ? error.message : 'Error sending message...';
			this.handleError(messageError);
		}
	}

	/**
	 * Creates a new conversation.
	 * @param {MessagePayload} payload - The payload for creating the conversation.
	 * @returns {Promise<Conversation>} - A promise that resolves with the created conversation.
	 */
	public async createConversation(payload: MessagePayload): Promise<Conversation> {
		try {
			const response = await fetch('/api/chat/createConversation', {
				...this.requestInit,
				body: JSON.stringify({ payload }),
			});
			if (this.responseIsValid(response)) {
				const conversation = await response.json();
				const message = new QuestionMessage(payload.content);
				const messages = new ConversationSet([message]);
				return new Conversation(conversation._id, conversation.title, messages);
			}
		} catch (error: unknown) {
			const messageError = error instanceof Error ? error.message : 'Error creating a conversation...';
			this.handleError(messageError);
		}
	}

	/**
	 * Loads a conversation from the server.
	 * @param {string} conversationId - The ID of the conversation to delete.
	 * @returns {Promise<boolean>} - A promise that resolves with a boolean indicating deletion success.
	 */
	public async getConversation(conversationId: string): Promise<Conversation> {
		try {
			const response = await fetch('/api/chat/getConversation', {
				...this.requestInit,
				body: JSON.stringify({ conversationId }),
			});
			if (this.responseIsValid(response)) {
				const { conversation } = await response.json();
				return this.parseConversation(conversation);
			}
		} catch (error: unknown) {
			const messageError = error instanceof Error ? error.message : 'Error creating a conversation...';
			this.handleError(messageError);
		}
	}

	/**
	 * Deletes a conversation.
	 * @param {string} conversationId - The ID of the conversation to delete.
	 * @returns {Promise<boolean>} - A promise that resolves with a boolean indicating deletion success.
	 */
	public async deleteConversation(conversationId: string): Promise<boolean> {
		try {
			const response = await fetch('/api/chat/deleteConversation', {
				...this.requestInit,
				body: JSON.stringify({ conversationId }),
			});
			return this.responseIsValid(response);
		} catch (error: unknown) {
			const messageError = error instanceof Error ? error.message : 'Error deleting conversation...';
			this.handleError(messageError);
		}
	}

	/**
	 * Retrieves a list of conversations.
	 * @returns {Promise<Conversation[]>} - A promise that resolves with an array of conversations.
	 */
	public async getConversationList(): Promise<Conversation[]> {
		try {
			const response = await fetch('/api/chat/getConversationList', this.requestInit);
			if (this.responseIsValid(response)) {
				const data = await response.json();
				return data.conversations.map(({ _id, title }) => new Conversation(_id, title));
			}
		} catch (error: unknown) {
			const messageError = error instanceof Error ? error.message : 'Error retrieving a list of conversations...';
			this.handleError(messageError);
		}
	}

	/**
	 * Adds a message to a conversation.
	 * @param {string} conversationId - The ID of the conversation to add the message to.
	 * @param {MessagePayload} payload - The payload for the message to add.
	 * @returns {Promise<boolean>} - A promise that resolves with a boolean indicating success.
	 */
	public async addMessage(conversationId: string, payload: MessagePayload): Promise<boolean> {
		try {
			const response = await fetch('/api/chat/addMessage', {
				...this.requestInit,
				body: JSON.stringify({ conversationId, payload }),
			});
			return this.responseIsValid(response);
			//
		} catch (error: unknown) {
			const messageError = error instanceof Error ? error.message : 'Error retrieving a list of conversations...';
			this.handleError(messageError);
		}
	}

	/**
	 * Parses conversation payload into a Conversation object.
	 * @param {ConversationPayload} param0 - The conversation payload containing _id, title, and messages.
	 * @returns {Conversation} - Parsed Conversation object.
	 * @private
	 */
	private parseConversation({ _id, title, messages }: ConversationPayload): Conversation {
		const thread: Message[] = messages.map(({ role, content }) => {
			return new roleToConstructor[role](content);
		});
		return new Conversation(_id, title, new ConversationSet([...thread]));
	}
}
