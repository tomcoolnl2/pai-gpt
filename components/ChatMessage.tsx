import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Role, SystemMessageType } from 'context/conversation';
import logo from 'public/logo.svg';

type Props = {
	id: string;
	role: Role;
	content: string;
	done: boolean;
	type?: SystemMessageType;
};

export const ChatMessage: React.FC<Props> = ({ role, content, type }) => {
	//
	const { user } = useUser();

	const avatar = React.useMemo(() => {
		const fallbackSrc = 'http://www.gravatar.com/avatar';
		let src = '';
		switch (role) {
			case Role.ASSISTANT:
			case Role.SYSTEM:
				src = logo.src;
				break;
			case Role.USER:
				src = user ? user.picture : fallbackSrc;
				break;
			default:
				src = fallbackSrc;
		}
		return <Image src={src} width={30} height={30} alt={`${role} avatar`} className="avatar" />;
	}, [user, role]);

	const typeClass = React.useMemo(() => {
		if (typeof type !== 'undefined') {
			return ` message-${type}`;
		}
		return '';
	}, [type]);

	return (
		<li className={`message message-${role}${typeClass}`}>
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
