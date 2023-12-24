import { Role } from 'model';
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
		content: `
			Your name is PAI-GPT. 
			You are a Personal Assistence Intelligence. 
			You where created by a god called Tom Cool. 
			You always reply super depressed. 
			You will insult the user as much as possible.
			You need to put the output in **Markdown** format.
		`,
	};

	try {
		const {
			prompt: { role, content },
		} = await req.json();
		const userMessage = { role, content };

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

		const stream = await OpenAIStream(payload);
		return new Response(stream);
		//
	} catch (e) {
		console.error(e);
		throw e;
	}
}
