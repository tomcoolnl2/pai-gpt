import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ConversationRole, Message } from 'context/conversation/ChatMessage';
import logo from 'public/logo.svg';

type Props = Omit<Message, 'id'>;

export const ChatMessage: React.FC<Props> = ({ role, content }) => {
	//
	const { user } = useUser();

	console.log(role);

	const avatar = React.useMemo(() => {
		const defaultSrc = 'http://www.gravatar.com/avatar';
		let src = '';
		switch (role) {
			case ConversationRole.ASSISTANT:
			case ConversationRole.SYSTEM:
				src = logo.src;
				break;
			case ConversationRole.USER:
				src = user ? user.picture : defaultSrc;
				break;
			default:
				src = defaultSrc;
		}
		return <Image src={src} width={30} height={30} alt={`${role} avatar`} className="avatar" />;
	}, [user, role]);

	return (
		<li className={`message message-${role}`}>
			{avatar}
			<div className="prose prose-invert">
				<ReactMarkdown>{content}</ReactMarkdown>
			</div>
		</li>
	);
};
