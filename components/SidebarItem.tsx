import React from 'react';
import Link from 'next/link';
import { faMessage, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Conversation } from 'model';

type Props = Conversation & {
	selected: boolean;
	openDeleteModal: (conversationId: string) => void;
};

export const SidebarItem: React.FC<Props> = ({ id, title, selected, openDeleteModal }) => {
	return (
		<li>
			<Link href={`/chat/${id}`} className={`sidebar-item${selected ? ' sidebar-item-selected' : ''}`}>
				<FontAwesomeIcon icon={faMessage} />
				<span className="truncate w-full" title={title}>
					{title}
				</span>
				<FontAwesomeIcon icon={faTrash} className="action-delete" onClick={() => openDeleteModal(id)} />
			</Link>
		</li>
	);
};