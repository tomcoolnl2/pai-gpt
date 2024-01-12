import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { Filter, FindOneAndUpdateOptions, UpdateFilter, ObjectId } from 'mongodb';
import clientPromise from 'lib/mongodb';
import { MessagePayload, Role } from 'model';

export default async function addMessage(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	//
	try {
		const { user } = await getSession(req, res);
		const client = await clientPromise;
		const db = client.db('pai-gpt');

		const { conversationId, payload } = req.body;
		const { content, role } = payload as MessagePayload;

		let objectId: ObjectId;
		try {
			objectId = new ObjectId(conversationId);
		} catch (e) {
			res.status(422).json({ message: 'Invalid conversation ID' });
			return;
		}

		if (
			!content ||
			typeof content !== 'string' ||
			(role === Role.USER && content.length > 200) ||
			(role === Role.ASSISTANT && content.length > 100000)
		) {
			res.status(422).json({ message: 'Invalid message content or length' });
			return;
		}

		if (![Role.USER, Role.ASSISTANT].includes(role)) {
			res.status(422).json({
				message: `Role must be either "${Role.USER}" or "${Role.ASSISTANT}"`,
			});
			return;
		}

		const filter: Filter<Document> = {
			_id: objectId,
			userId: user.sub,
		};

		const newMessage: Record<string, string> = {
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
			.findOneAndUpdate(filter, update as unknown, options);

		res.status(200).json({
			conversation: {
				...conversationResult,
				_id: conversationResult._id.toString(),
			},
		});
	} catch (error) {
		console.error('Error adding message:', error);
		res.status(500).json({
			message: 'An error occurred when adding a message to a conversation.',
		});
	}
}
