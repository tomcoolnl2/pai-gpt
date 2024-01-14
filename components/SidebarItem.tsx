import React from 'react';
import Link from 'next/link';
import { faMessage, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
	id: string;
	title: string;
	selected: boolean;
	openDeleteModal: (conversationId: string) => void;
}

export const SidebarItem: React.FC<Props> = ({ id, title, selected, openDeleteModal }) => {
	//
	const handleOpenDeleteModal = React.useCallback(
		(event: React.MouseEvent<SVGSVGElement>) => {
			event.preventDefault();
			openDeleteModal(id);
		},
		[id, openDeleteModal],
	);

	return (
		<li>
			<Link href={`/chat/${id}`} className={`sidebar-item${selected ? ' sidebar-item-selected' : ''}`}>
				<FontAwesomeIcon icon={faMessage} />
				<span className="truncate w-full" title={title}>
					{title}
				</span>
				<FontAwesomeIcon icon={faTrash} className="action-delete" onClick={handleOpenDeleteModal} />
			</Link>
		</li>
	);
};
