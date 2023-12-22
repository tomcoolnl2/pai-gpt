import { Message } from 'context/conversation/ChatMessage';

type Props = Omit<Message, 'id'>;

export const ChatMessage: React.FC<Props> = ({ role, content }) => {
	return (
		<li className="grid grid-cols-[30px_1fr] gap-5 p-5">
			<span></span>
			<p>{content}</p>
		</li>
	);
};
