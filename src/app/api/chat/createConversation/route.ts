import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import clientPromise from '../../../../lib/mongodb';
import { ConversationPayload, MessagePayload } from '../../../../model';

type ResponseError = {
	message: string;
};

type ResponseData = ConversationPayload | ResponseError;

export async function GET(req: NextRequest) {
	//
	try {
		const session = await getSession(req, NextResponse.next());

		if (!session || !session.user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const { user } = session;
		const { payload } = await req.json();

		if (!payload.content || typeof payload.content !== 'string' || payload.content.length > 200) {
			return NextResponse.json(
				{ message: 'Message is required and must be less than 200 characters.' },
				{ status: 422 },
			);
		}

		const title = payload.content;
		const messages: MessagePayload[] = [payload];
		const body = { title, messages };

		const client = await clientPromise;
		const db = client.db('pai-gpt');
		const conversation = await db.collection('conversations').insertOne({
			userId: user.sub,
			...body,
		});

		return NextResponse.json(
			{
				_id: conversation.insertedId.toString(), // MongoDB autogenerated id
				...body,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error creating conversation:', error);
		return NextResponse.json({ message: 'An error occurred when creating a new conversation.' }, { status: 500 });
	}
}
