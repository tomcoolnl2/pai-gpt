import { Message, Prompt, Role, AnswerMessage, SystemErrorMessage } from './ConversationMessage';

/**
 * Represents a class handling chat message API interactions.
 */
export class ConversationApi {
	//
	private headers = {
		'Content-Type': 'application/json',
	};
	/**
	 * Creates an instance of ConversationApi.
	 * @param {React.Dispatch<React.SetStateAction<strMessage | nulling>>} answerStreamCallback - Callback function to handle streamed content.
	 */
	constructor(public answerStreamCallback: React.Dispatch<React.SetStateAction<Message | null>>) {}

	/**
	 * Generates a prompt based on the provided question.
	 * @param {string} question - The question to generate the prompt.
	 * @returns {string} - The generated prompt.
	 * @private
	 */
	private generatePrompt(question: string): Prompt {
		const content = `
            Q: ${question}.
            Remove the preceding 'A:'
        `;
		return {
			role: Role.USER,
			question,
			content,
		};
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

	private handleError(message: string): void {
		const systemMessage = new SystemErrorMessage(message);
		this.answerStreamCallback(systemMessage);
	}

	/**
	 * Sends a message based on the provided question and handles the response.
	 * @param {string} question - The question to send as a message.
	 * @returns {Promise<void>} - Promise that resolves when the message is sent.
	 * @public
	 */
	public async sendMessage(question: string): Promise<void> {
		try {
			const prompt = this.generatePrompt(question);
			const response = await fetch('/api/chat/sendMessage', {
				method: 'POST',
				headers: this.headers,
				body: JSON.stringify({ prompt }),
			});

			if (!response.ok) {
				this.handleError(response.statusText);
			} else if (!response.body) {
				this.handleError('Response data failed...');
			} else {
				this.generateStream(response.body);
			}
			//
		} catch (error: unknown) {
			const messageError = error instanceof Error ? error.message : 'Error sending message...';
			this.handleError(messageError);
		}
	}

	public async createConversation(question: string) {}

	public async getConversationList() {
		try {
			const response = await fetch('/api/chat/getConversationList', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				this.handleError(response.statusText);
			} else if (!response.body) {
				this.handleError('Response data failed...');
			} else {
				console.log('getConversationList', response.body);
			}
			//
		} catch (error: unknown) {
			const messageError = error instanceof Error ? error.message : 'Error retrieving a ist of conversations...';
			this.handleError(messageError);
		}
	}
}
