import Link from 'next/link';
import { faMessage, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Conversation } from 'model';
import { useConversationContext } from 'context/conversation';

export const SidebarItem: React.FC<Conversation> = ({ id, title }) => {
	const { deleteConversation } = useConversationContext();
	return (
		<li>
			<a href="#" className="sidebar-item">
				<FontAwesomeIcon icon={faMessage} />
				<span className="truncate w-full">{title}</span>
				<FontAwesomeIcon icon={faTrash} className="action-delete" onClick={() => deleteConversation(id)} />
			</a>
		</li>
	);
};
