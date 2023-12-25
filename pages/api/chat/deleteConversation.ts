import { NextApiRequest, NextApiResponse } from 'next';
import { Filter, ObjectId } from 'mongodb';
import { getSession } from '@auth0/nextjs-auth0';
import clientPromise from 'lib/mongodb';

type ResponseData = {
	message: string;
};

export default async function deleteConversation(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>,
): Promise<void> {
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
		const existingConversation = await collection.findOne(filter);

		if (existingConversation) {
			const result = await collection.deleteOne(filter);

			if (result.deletedCount === 1) {
				res.status(200).json({ message: `Conversation with id ${conversationId} successfully deleted` });
			} else {
				res.status(500).json({
					message: `An error occurred while deleting conversation with id ${conversationId}`,
				});
			}
		} else {
			res.status(404).json({
				message: `Conversation with id ${conversationId} was not found and could not be deleted`,
			});
		}
	} catch (e) {
		console.error('Error:', e);
		res.status(500).json({
			message: 'An error occurred when trying to delete a conversation',
		});
	}
}
