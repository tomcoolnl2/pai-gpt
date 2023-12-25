import Link from 'next/link';
import React from 'react';
import { faPlus, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { useConversationContext } from 'context/conversation';
import { SidebarItem, Spinner, DeleteConversationModal } from 'components';
export const Sidebar: React.FC = () => {
	//
	const router = useRouter();
	const { conversations, deleteConversation } = useConversationContext();
	const [deleteModalIsOpen, setDeleteModalIsOpen] = React.useState<boolean>(false);
	const [prospectConversationId, setProspectConversationId] = React.useState<string | null>(null);

	const deleteAndClose = React.useCallback(async () => {
		await deleteConversation(prospectConversationId);
		setDeleteModalIsOpen(false);
	}, [prospectConversationId, deleteConversation]);

	const openDeleteModal = React.useCallback((conversationId: string) => {
		setProspectConversationId(conversationId);
		setDeleteModalIsOpen(true);
	}, []);

	const closeDeleteModal = React.useCallback(() => {
		setProspectConversationId(null);
		setDeleteModalIsOpen(false);
	}, []);

	return (
		<>
			<aside className="sidebar">
				<Link className="sidebar-item btn" href="/chat">
					<FontAwesomeIcon icon={faPlus} />
					New Chat
				</Link>
				<nav className="sidebar-list">
					<ul>
						{conversations ? (
							conversations.map((conversation) => (
								<SidebarItem
									selected={conversation.id === router.query.conversationId?.[0]}
									openDeleteModal={openDeleteModal}
									key={conversation.id}
									{...conversation}
								/>
							))
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
			<DeleteConversationModal
				open={deleteModalIsOpen}
				handleClose={closeDeleteModal}
				handleDelete={deleteAndClose}
			/>
		</>
	);
};
