import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { Filter, FindOneAndUpdateOptions, UpdateFilter, ObjectId, Document } from 'mongodb';
import clientPromise from '../../../../lib/mongodb';
import { MessagePayload, Role } from '../../../../model';

export async function GET(req: NextRequest) {
	//
	try {
		const session = await getSession(req, NextResponse.next());

		if (!session || !session.user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const { user } = session;
		const client = await clientPromise;
		const db = client.db('pai-gpt');

		const { conversationId, payload } = await req.json();
		const { content, role } = payload as MessagePayload;

		let objectId: ObjectId;
		try {
			objectId = new ObjectId(conversationId);
		} catch (e) {
			return NextResponse.json({ message: 'Invalid conversation ID' }, { status: 422 });
		}

		if (
			!content ||
			typeof content !== 'string' ||
			(role === Role.USER && content.length > 200) ||
			(role === Role.ASSISTANT && content.length > 100000)
		) {
			return NextResponse.json({ message: 'Invalid message content or length' }, { status: 422 });
		}

		if (![Role.USER, Role.ASSISTANT].includes(role)) {
			return NextResponse.json(
				{ message: 'Role must be either "${Role.USER}" or "${Role.ASSISTANT}"' },
				{ status: 422 },
			);
		}

		const filter: Filter<Document> = {
			_id: objectId,
			userId: user.sub,
		};

		const newMessage: Record<string, string> = {
			role,
			content,
		};

		const update = {
			$push: {
				messages: newMessage,
			},
		};

		const options: FindOneAndUpdateOptions = {
			returnDocument: 'after',
		};

		const conversationResult = await db
			.collection('conversations')
			.findOneAndUpdate(filter, update as unknown as UpdateFilter<Document>, options);

		if (!conversationResult?.value) {
			return NextResponse.json({ message: 'Conversation not found' }, { status: 404 });
		}

		return NextResponse.json(
			{
				conversation: {
					...conversationResult.value,
					_id: conversationResult.value._id.toString(),
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error adding message:', error);
		return NextResponse.json(
			{ message: 'An error occurred when adding a message to a conversation.' },
			{ status: 500 },
		);
	}
}
