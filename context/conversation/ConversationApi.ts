import { Message, AnswerMessage, SystemErrorMessage } from './ChatMessage';

/**
 * Represents a class handling chat message API interactions.
 */
export class ConversationApi {
	/**
	 * Creates an instance of ConversationApi.
	 * @param {React.Dispatch<React.SetStateAction<string>>} answerStreamCallback - Callback function to handle streamed content.
	 */
	constructor(public answerStreamCallback: React.Dispatch<React.SetStateAction<Message | null>>) {}

	/**
	 * Generates a prompt based on the provided question.
	 * @param {string} question - The question to generate the prompt.
	 * @returns {string} - The generated prompt.
	 * @private
	 */
	private generatePrompt(question: string): string {
		return `
            Q: ${question}. 
            Generate a response with less than 200 characters. 
            Remove the preceding 'A:'
        `;
	}

	/**
	 * Asynchronously generates a stream of data from a ReadableStream and invokes a callback with accumulated content.
	 * @param {ReadableStream<Uint8Array>} data - The ReadableStream containing Uint8Array data.
	 * @returns {Promise<void>} A Promise that resolves once the stream processing is completed.
	 */
	private async generateStream(data: ReadableStream<Uint8Array>): Promise<void> {
		//
		if (!data) {
			return;
		}

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
				this.answerStreamCallback((prevAnswer) => {
					const answer = new AnswerMessage();
					if (prevAnswer instanceof AnswerMessage) {
						Object.assign(answer, prevAnswer);
					}
					answer.content += chunk;
					answer.done = done;
					return answer;
				});
			}
		}
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
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ prompt }),
			});

			if (!response.ok) {
				const systemMessage = new SystemErrorMessage(response.statusText);
				this.answerStreamCallback(systemMessage);
			} else {
				this.generateStream(response.body);
			}
			//
		} catch (error: unknown) {
			const fallbackContent = 'Error sending message';
			const messageError = error instanceof Error ? error.message : fallbackContent;
			const systemMessage = new SystemErrorMessage(messageError);
			this.answerStreamCallback(systemMessage);
			console.error(fallbackContent, error);
		}
	}
}
