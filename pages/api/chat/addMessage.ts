// will be running in a Node environment
import { NextApiRequest, NextApiResponse } from 'next';
import { Filter, FindOneAndUpdateOptions, UpdateFilter, ObjectId } from 'mongodb';
import { getSession } from '@auth0/nextjs-auth0';
import clientPromise from 'lib/mongodb';

export default async function addMessage(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	try {
		//
		const { user } = await getSession(req, res);
		const client = await clientPromise;
		const db = client.db('pai-gpt');

		const {
			conversationId,
			payload: { content, role },
		} = req.body;

		console.log('test', req.body);

		const filter: Filter<Document> = {
			_id: new ObjectId(conversationId),
			userId: user.sub,
		};

		const newMessage: Record<string, any> = {
			role,
			content,
		};

		const update: UpdateFilter<Document> = {
			$push: {
				messages: newMessage,
			},
		};

		const options: FindOneAndUpdateOptions = {
			returnDocument: 'after',
		};

		const conversationResult = await db
			.collection('conversations')
			.findOneAndUpdate(filter, update as any, options);

		res.status(200).json({
			conversation: {
				...conversationResult,
				_id: conversationResult._id.toString(),
			},
		});
		//
	} catch (e) {
		console.log('test', e);
		res.status(500).json({
			message: 'An error occured when adding a message to a chat.',
		});
	}
}
