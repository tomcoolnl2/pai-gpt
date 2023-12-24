import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { WithId, Document } from 'mongodb';
import clientPromise from 'lib/mongodb';

type ResponseSuccess = {
	conversations: WithId<Document>[];
};

type ResponseError = {
	message: string;
};

type ResponseData = ResponseSuccess | ResponseError;

export default async function getConversationList(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>,
): Promise<void> {
	try {
		//
		const { user } = await getSession(req, res);
		const client = await clientPromise;
		const db = client.db('pai-gpt');

		const conversations: WithId<Document>[] = await db
			.collection('conversations')
			.find(
				{ userId: user.sub },
				{
					projection: {
						userId: 0, // omit
					},
				},
			)
			.sort({ id: -1 }) // latest to oldest
			.toArray();

		res.status(200).json({ conversations });
		//
	} catch (e) {
		res.status(500).json({
			message: 'An error occured when getting a list of conversations.',
		});
	}
}
