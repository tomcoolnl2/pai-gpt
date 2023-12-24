import Link from 'next/link';
import React from 'react';
import { useConversationContext } from 'context/conversation';
import { Conversation } from 'model';

export const Sidebar: React.FC = () => {
	//
	const { conversations } = useConversationContext();

	return (
		<aside className="bg-gray-900 text-white">
			<Link className="btn" href="/chat">
				New Chat
			</Link>
			<ul className="flex-1 overflow-auto bg-gray-950">
				{conversations &&
					conversations.map((conversation) => (
						<li key={conversation.id} className="overflow-auto">
							<code>{conversation.id}</code>
							{conversation.title}
						</li>
					))}
			</ul>
			<Link href="/api/auth/logout">Logout</Link>
		</aside>
	);
};
