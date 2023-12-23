import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Conversation } from 'context';
import logo from 'public/logo.svg';

export const ChatMessage: React.FC<Conversation.Message> = ({ role, content }) => {
	//
	const { user } = useUser();

	const avatar = React.useMemo(() => {
		const fallbackSrc = 'http://www.gravatar.com/avatar';
		let src = '';
		switch (role) {
			case Conversation.Role.ASSISTANT:
			case Conversation.Role.SYSTEM:
				src = logo.src;
				break;
			case Conversation.Role.USER:
				src = user ? user.picture : fallbackSrc;
				break;
			default:
				src = fallbackSrc;
		}
		return <Image src={src} width={30} height={30} alt={`${role} avatar`} className="avatar" />;
	}, [user, role]);

	return (
		<li className={`message message-${role}`}>
			{avatar}
			{content ? (
				<div className="prose prose-invert">
					<ReactMarkdown>{content}</ReactMarkdown>
				</div>
			) : (
				<div className="loading" />
			)}
		</li>
	);
};
