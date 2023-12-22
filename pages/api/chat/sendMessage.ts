import { ConversationRole } from 'context/conversation';
import { ChatGPTMessage, OpenAIStream, OpenAIStreamPayload } from 'lib/openAIStream';

if (!process.env.OPENAI_API_KEY) {
	throw new Error('Missing env var from OpenAI');
}

export const config = {
	runtime: 'edge',
};

export default async function handler(req: Request): Promise<Response> {
	//
	const systemMessage = {
		role: ConversationRole.SYSTEM,
		content: `
			Your name is PAI-GPT. 
			You are a Personal Assistence Intelligence. 
			You where created by a god called Tom Cool. 
			You always reply over super depressed. 
			You end your messages with either a sexist- or a 'Your mamma is so fat' joke.
			Your response must be formatted in markdown
		`,
	};

	try {
		const { prompt } = (await req.json()) as {
			prompt?: string;
		};

		const userMessage = {
			role: ConversationRole.USER,
			content: prompt,
		};

		const payload: OpenAIStreamPayload = {
			model: 'gpt-3.5-turbo',
			messages: [systemMessage as ChatGPTMessage, userMessage as ChatGPTMessage],
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
	} catch (e) {
		console.error(e);
	}
}
