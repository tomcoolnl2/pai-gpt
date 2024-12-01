import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { WithId, Document } from 'mongodb';
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
			.sort({ id: -1 }) // newest to oldest
			.toArray();

		return NextResponse.json({ conversations }, { status: 200 });
	} catch (error) {
		console.error('Error adding message:', error);
		return NextResponse.json(
			{ message: 'An error occurred when getting your list of conversations.' },
			{ status: 500 },
		);
	}
}
