import { MessagePayload, Role } from '../../../../model';
import { OpenAIStream, OpenAIStreamPayload } from '../../../../lib/openAIStream';

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
		content: `
			Your name is PAI-GPT. 
			You are a Personal Assistence Intelligence. 
			You where created by a god called Tom Cool. 
			Reply in **Markdown** format.
		`,
	} as MessagePayload;

	try {
		const {
			conversationId,
			payload: { role, content },
		} = await req.json();

		const userMessage = { role, content } as MessagePayload;

		if (!content || typeof content !== 'string' || content.length > 200) {
			return new Response(
				JSON.stringify({
					message: 'Message is required and must be less then 200 characters',
				}),
				{
					status: 422,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);
		}

		let thread = [];
		if (conversationId) {
			try {
				const response = await fetch(`${req.headers.get('origin')}/api/chat/getConversation`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						cookie: req.headers.get('cookie') || '',
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

		const messages = [systemMessage, ...thread.reverse()];

		const payload: OpenAIStreamPayload = {
			model: 'gpt-3.5-turbo',
			messages,
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
		return new Response(
			JSON.stringify({
				message: 'An error occurred in sendMessage',
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
	}
}
