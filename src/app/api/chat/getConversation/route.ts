import { NextRequest, NextResponse } from 'next/server';
import { Filter, ObjectId, Document } from 'mongodb';
import { getSession } from '@auth0/nextjs-auth0';
import clientPromise from '../../../../lib/mongodb';

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

		const conversation = await collection.findOne(filter, {
			projection: {
				userId: 0, // omit
			},
		});

		if (conversation) {
			return NextResponse.json({ conversation }, { status: 200 });
		} else {
			return NextResponse.json(
				{ message: `Conversation with id ${conversationId} was not found` },
				{ status: 404 },
			);
		}
	} catch (error) {
		console.error('Error adding message:', error);
		return NextResponse.json({ message: 'An error occurred when trying to get a conversation.' }, { status: 500 });
	}
}
