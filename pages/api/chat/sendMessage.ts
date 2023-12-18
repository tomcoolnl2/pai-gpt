import { OpenAIStream, OpenAIStreamPayload } from 'lib/openAIStream';

if (!process.env.OPENAI_API_KEY) {
	throw new Error('Missing env var from OpenAI');
}

export const config = {
	runtime: 'edge',
};

export default async function handler(req: Request): Promise<Response> {
	try {
		const { prompt } = (await req.json()) as {
			prompt?: string;
		};

		console.log('sendMessage endpoint: ', prompt);
		// const stream = await OpenAIEdgeStream(
		// 	'https://api.openai.com/v1/chat/completions',
		// 	{
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 			Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
		// 		},
		// 		method: 'POST',
		// 		body: JSON.stringify({
		// 			model: 'gpt-3.5-turbo',
		// 			message: [{ content: message, role: 'user' }],
		// 			stream: true,
		// 		}),
		// 	},
		// 	{
		// 		async onAfterStream(options) {
		// 			console.log('onAfterStream(options)', options);
		// 		},
		// 	}
		// );

		// console.log('sendMessage stream', stream);
		// return new Response(stream, {
		// 	headers: { 'Content-Type': 'application/json' }, // Adjust content type as needed
		// });

		const payload: OpenAIStreamPayload = {
			model: 'gpt-3.5-turbo',
			messages: [{ role: 'user', content: prompt }],
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
