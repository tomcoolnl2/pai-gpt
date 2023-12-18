import { OpenAIEdgeStream } from 'openai-edge-stream';

export const config = {
	runtime: 'edge',
};

export default async function handler(req) {
	try {
		const { message } = await req.json();
		console.log('sendMessage endpoint: ', message);
		const stream = await OpenAIEdgeStream(
			'https://api.openai.com/v1/chat/completions',
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				},
				method: 'POST',
				body: JSON.stringify({
					model: 'gpt-3.5-turbo',
					message: [{ content: message, role: 'user' }],
					stream: true,
				}),
			},
			{
				async onAfterStream(options) {
					console.log('onAfterStream(options)', options);
				},
			}
		);

		console.log('sendMessage stream', stream);
		return new Response(stream, {
			headers: { 'Content-Type': 'application/json' }, // Adjust content type as needed
		});
	} catch (e) {
		console.error(e);
	}
}
