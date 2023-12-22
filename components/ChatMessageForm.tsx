import React from 'react';
import { v4 as uuid } from 'uuid';
import { ConversationRole, Message } from 'context/conversation/ChatMessage';
import { useConversationContext } from 'context/conversation';

export const ChatMessageForm: React.FC = () => {
	//
	const [question, setQuestion] = React.useState<string>('');
	const { submitQuestion, addToConversation } = useConversationContext();

	const handleSubmit = React.useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			const message = new Message(uuid(), ConversationRole.USER, question);
			addToConversation(message);
			submitQuestion(question);
			setQuestion('');
		},
		[question, addToConversation, submitQuestion],
	);

	return (
		<footer className="bg-gray-800 p-10">
			<form onSubmit={handleSubmit}>
				<fieldset className="flex gap-2">
					<textarea
						value={question}
						onChange={(e) => setQuestion(e.target.value)}
						placeholder="Send a message..."
						className="textarea"
					/>
					<button type="submit" className="btn">
						Send
					</button>
				</fieldset>
			</form>
		</footer>
	);
};
