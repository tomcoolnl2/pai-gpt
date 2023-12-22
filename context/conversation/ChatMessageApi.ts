/**
 * Represents a class handling chat message API interactions.
 */
export class ChatMessageApi {
	/**
	 * Creates an instance of ChatMessageApi.
	 * @param {React.Dispatch<React.SetStateAction<string>>} answerStreamCallback - Callback function to handle streamed content.
	 */
	constructor(public answerStreamCallback: React.Dispatch<React.SetStateAction<string>>) {}

	/**
	 * Generates a prompt based on the provided question.
	 * @param {string} question - The question to generate the prompt.
	 * @returns {string} - The generated prompt.
	 * @private
	 */
	private toPrompt(question: string): string {
		return `
            Q: ${question}. 
            Generate a response with less than 200 characters. 
            Remove the preceding 'A:'
        `;
	}

	/**
	 * Sends a message based on the provided question and handles the response.
	 * @param {string} question - The question to send as a message.
	 * @returns {Promise<void>} - Promise that resolves when the message is sent.
	 * @public
	 */
	public async sendMessage(question: string): Promise<void> {
		try {
			const prompt = this.toPrompt(question);
			const response = await fetch('/api/chat/sendMessage', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ prompt }),
			});

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			const data = response.body;

			if (!data) {
				return;
			}

			const reader = data.getReader();
			const decoder = new TextDecoder();
			let doneReading = false;

			while (!doneReading) {
				const { value, done } = await reader.read();
				doneReading = done;

				if (value) {
					const chunkValue = decoder.decode(value);
					this.answerStreamCallback((prev) => prev + chunkValue);
				}
			}
		} catch (error) {
			// Handle error
			console.error('Error sending message:', error);
		}
	}
}
