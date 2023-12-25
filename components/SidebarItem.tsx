import React from 'react';
import { faMessage, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Conversation } from 'model';

type Props = Conversation & {
	openDeleteModal: (conversationId: string) => void;
};

export const SidebarItem: React.FC<Props> = ({ id, title, openDeleteModal }) => {
	return (
		<li>
			<a href="#" className="sidebar-item">
				<FontAwesomeIcon icon={faMessage} />
				<span className="truncate w-full">{title}</span>
				<FontAwesomeIcon icon={faTrash} className="action-delete" onClick={() => openDeleteModal(id)} />
			</a>
		</li>
	);
};
