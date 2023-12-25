import Link from 'next/link';
import React from 'react';
import { faMessage, faPlus, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useConversationContext } from 'context/conversation';
import { SidebarItem, Spinner } from 'components';

export const Sidebar: React.FC = () => {
	//
	const { conversations } = useConversationContext();

	return (
		<aside className="sidebar">
			<Link className="sidebar-item btn" href="/chat">
				<FontAwesomeIcon icon={faPlus} />
				New Chat
			</Link>
			<nav className="sidebar-list">
				<ul>
					{conversations ? (
						conversations.map((conversation) => <SidebarItem key={conversation.id} {...conversation} />)
					) : (
						<li className="sidebar-item flex-col">
							<Spinner />
						</li>
					)}
				</ul>
			</nav>
			<Link className="sidebar-item" href="/api/auth/logout">
				<FontAwesomeIcon icon={faRightFromBracket} />
				Logout
			</Link>
		</aside>
	);
};
