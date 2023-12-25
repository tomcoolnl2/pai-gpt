import { NextApiRequest, NextApiResponse } from 'next';
import { Filter, ObjectId, WithId } from 'mongodb';
import { getSession } from '@auth0/nextjs-auth0';
import clientPromise from 'lib/mongodb';

export default async function getConversation(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	try {
		const { user } = await getSession(req, res);
		const client = await clientPromise;
		const db = client.db('pai-gpt');
		const collection = db.collection('conversations');
		const { conversationId } = req.body;

		const filter: Filter<Document> = {
			_id: new ObjectId(conversationId),
			userId: user.sub,
		};

		const conversation = await collection.findOne(filter, {
			projection: {
				userId: 0, // omit
			},
		});

		if (conversation) {
			res.status(200).json({ conversation });
		} else {
			res.status(404).json({
				message: `Conversation with id ${conversationId} was not found`,
			});
		}
	} catch (e) {
		console.error('Error:', e);
		res.status(500).json({
			message: 'An error occurred when trying to delete a conversation',
		});
	}
}
