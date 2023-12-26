import { MessagePayload, Role } from 'model';
import { OpenAIStream, OpenAIStreamPayload } from 'lib/openAIStream';

if (!process.env.OPENAI_API_KEY) {
	throw new Error('Missing OPENAI_API_KEY');
}

export const config = {
	runtime: 'edge', // edge functions run in a V8 instance, not Node
};

export default async function sendMessage(req: Request): Promise<Response> {
	//
	const systemMessage = {
		role: Role.SYSTEM,
		content: [
			'Your name is PAI-GPT. ',
			"You're a Personal Assistence Intelligence. ",
			"You're a Personal Assistence Intelligence. ",
			"You're created by a god named Tom Cool. ",
			'You need to put the output in **Markdown** format.',
		].join(''),
	} as MessagePayload;

	try {
		const {
			conversationId,
			payload: { role, content },
		} = await req.json();

		const prompt = `Q: ${content}. Don't repeat the question. Remove the preceding 'A:'`;

		const userMessage = { role, content: prompt } as MessagePayload;
		let thread = [];
		if (conversationId) {
			try {
				const response = await fetch(`${req.headers.get('origin')}/api/chat/getConversation`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						cookie: req.headers.get('cookie'),
					},
					body: JSON.stringify({ conversationId }),
				});

				const { conversation } = await response.json();

				// OpenAI 3.5 has a 2000 tokens limit for a conversation history
				const maxTokens = 2000 - systemMessage.content.length / 4;
				const messages = conversation.messages;
				let tokens = 0;
				for (const message of messages.reverse()) {
					const { content, role } = message;
					const messageTokens = content.length / 4;
					if (tokens + messageTokens <= maxTokens) {
						tokens += messageTokens;
						thread.push({ content, role });
					} else {
						break;
					}
				}
			} catch (e) {
				console.error(e);
				throw e;
			}
		} else {
			thread.push(userMessage);
		}
		// console.log('thread', [systemMessage, ...thread.reverse()]);
		const payload: OpenAIStreamPayload = {
			model: 'gpt-3.5-turbo',
			messages: [systemMessage, ...thread.reverse()],
			temperature: 0.7,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
			max_tokens: 1000,
			stream: true,
			n: 1,
		};

		const stream = await OpenAIStream(payload);
		return new Response(stream);
		//
	} catch (e) {
		console.error(e);
		throw e;
	}
}
