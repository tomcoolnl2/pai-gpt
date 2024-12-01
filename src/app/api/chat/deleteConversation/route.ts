import { NextRequest, NextResponse } from 'next/server';
import { Filter, ObjectId } from 'mongodb';
import { Document } from 'bson';
import { getSession } from '@auth0/nextjs-auth0';
import clientPromise from '../../../../lib/mongodb';

type ResponseData = {
	message: string;
};

export async function GET(req: NextRequest) {
	try {
		const session = await getSession(req, NextResponse.next());

		if (!session || !session.user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const { user } = session;
		const client = await clientPromise;
		const db = client.db('pai-gpt');
		const collection = db.collection('conversations');
		const { conversationId } = await req.json();

		const filter: Filter<Document> = {
			_id: new ObjectId(conversationId),
			userId: user.sub,
		};
		const existingConversation = await collection.findOne(filter);

		if (existingConversation) {
			const result = await collection.deleteOne(filter);

			if (result.deletedCount === 1) {
				return NextResponse.json(
					{ message: `Conversation with id ${conversationId} successfully deleted` },
					{ status: 200 },
				);
			} else {
				return NextResponse.json(
					{ message: `An error occurred while deleting conversation with id ${conversationId}` },
					{ status: 500 },
				);
			}
		} else {
			return NextResponse.json(
				{ message: `Conversation with id ${conversationId} was not found and could not be deleted.` },
				{ status: 404 },
			);
		}
	} catch (error) {
		console.error('Error deleting message:', error);
		return NextResponse.json(
			{ message: 'An error occurred when trying to delete a conversation' },
			{ status: 500 },
		);
	}
}
