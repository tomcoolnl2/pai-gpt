import { MessagePayload, Role } from 'model';
import { OpenAIStream, OpenAIStreamPayload } from 'lib/openAIStream';
import { ConversationApi } from 'api/ConversationApi';

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
			You always reply super depressed. 
			You will insult the user as much as possible.
			You need to put the output in **Markdown** format.
		`,
	} as MessagePayload;

	try {
		const {
			conversationId,
			payload: { role, content },
		} = await req.json();

		const prompt = `Q: ${content}. Don't repeat the question. Remove the preceding 'A:'`;

		const userMessage = { role, content: prompt } as MessagePayload;

		const payload: OpenAIStreamPayload = {
			model: 'gpt-3.5-turbo',
			messages: [systemMessage, userMessage],
			temperature: 0.7,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
			max_tokens: 1000,
			stream: true,
			n: 1,
		};

		// if (conversationId) {
		// 	const api = new ConversationApi(() => void 0); // TEMP FIX
		// 	api.origin = req.headers.get('origin');
		// 	api.requestInit = {
		// 		headers: {
		// 			cookies: req.headers.get('cookie'),
		// 		},
		// 	};
		// 	console.log('api', api);

		// 	// OpenAI 3.5 has a 2000 tokens limit for a conversation history
		// 	const { messages } = await api.getConversation(conversationId);
		// 	const inclusedMessages = [];
		// 	// messages.reverse()
		// 	for (const message of messages) {
		// 	}
		// }

		const stream = await OpenAIStream(payload);
		return new Response(stream);
		//
	} catch (e) {
		console.error(e);
		throw e;
	}
}
