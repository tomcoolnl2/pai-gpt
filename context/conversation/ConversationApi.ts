import { Message, MessagePayload, AnswerMessage, SystemErrorMessage, Conversation, QuestionMessage } from 'model';
import { ConversationSet } from 'model/ConversationSet';

/**
 * Represents a class handling chat message API interactions.
 */
export class ConversationApi {
	/**
	 * Creates an instance of ConversationApi.
	 * @param {React.Dispatch<React.SetStateAction<strMessage | nulling>>} answerStreamCallback - Callback function to handle streamed content.
	 */
	constructor(public answerStreamCallback: React.Dispatch<React.SetStateAction<Message | null>>) {}

	private defaultRequest = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	};

	private responseIsValid(response: Response): boolean {
		if (!response.ok) {
			this.handleError(response.statusText);
			return false;
		} else if (!response.body) {
			this.handleError('Invalid response... Please hit any user to proceed!');
			return false;
		}
		return true;
	}

	private handleError(message: string): void {
		const systemMessage = new SystemErrorMessage(message);
		this.answerStreamCallback(systemMessage);
	}

	private formatAnswer(prevAnswer: Message, chunk: string, done: boolean): AnswerMessage {
		const answer = new AnswerMessage();
		if (prevAnswer instanceof AnswerMessage) {
			Object.assign(answer, prevAnswer);
		}
		answer.content += chunk;
		answer.done = done;
		return answer;
	}

	/**
	 * Asynchronously generates a stream of data from a ReadableStream and invokes a callback with accumulated content.
	 * @param {ReadableStream<Uint8Array>} data - The ReadableStream containing Uint8Array data.
	 * @returns {Promise<void>} A Promise that resolves once the stream processing is completed.
	 */
	private async generateStream(data: ReadableStream<Uint8Array>): Promise<void> {
		//
		const reader = data.getReader();
		const decoder = new TextDecoder();
		let doneReading = false;

		while (!doneReading) {
			//
			const { value, done } = await reader.read();
			let chunk = '';

			doneReading = done;

			if (value) {
				chunk = decoder.decode(value);
			}

			if (value || done) {
				this.answerStreamCallback((answer) => {
					return this.formatAnswer(answer, chunk, done);
				});
			}
		}
	}

	public async sendMessage(payload: MessagePayload): Promise<void> {
		try {
			const response = await fetch('/api/chat/sendMessage', {
				...this.defaultRequest,
				body: JSON.stringify({ payload }),
			});

			if (this.responseIsValid(response)) {
				this.generateStream(response.body);
			}
		} catch (error: unknown) {
			const messageError = error instanceof Error ? error.message : 'Error sending message...';
			this.handleError(messageError);
		}
	}

	public async createConversation(payload: MessagePayload): Promise<Conversation> {
		try {
			const response = await fetch('/api/chat/createConversation', {
				...this.defaultRequest,
				body: JSON.stringify({ payload }),
			});
			if (this.responseIsValid(response)) {
				const conversation = await response.json();
				const message = new QuestionMessage(payload.content);
				const messages = new ConversationSet([message]);
				return new Conversation(conversation._id, conversation.title, messages);
			}
		} catch (error: unknown) {
			const messageError = error instanceof Error ? error.message : 'Error retrieving a list of conversations...';
			this.handleError(messageError);
		}
	}

	public async getConversationList(): Promise<Conversation[]> {
		try {
			const response = await fetch('/api/chat/getConversationList', this.defaultRequest);
			if (this.responseIsValid(response)) {
				const data = await response.json();
				return data.conversations.map(({ _id, title }) => new Conversation(_id, title));
			}
		} catch (error: unknown) {
			const messageError = error instanceof Error ? error.message : 'Error retrieving a list of conversations...';
			this.handleError(messageError);
		}
	}

	public async addMessage(conversationId: string, payload: MessagePayload): Promise<boolean> {
		try {
			const response = await fetch('/api/chat/addMessage', {
				...this.defaultRequest,
				body: JSON.stringify({ conversationId, payload }),
			});
			if (this.responseIsValid(response)) {
				const data = await response.json();
				console.log(data);
				return true;
			}
			return false;
		} catch (error: unknown) {
			const messageError = error instanceof Error ? error.message : 'Error retrieving a list of conversations...';
			this.handleError(messageError);
		}
	}
}
