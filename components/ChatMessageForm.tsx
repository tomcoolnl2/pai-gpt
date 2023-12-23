import React from 'react';
import { QuestionMessage } from 'context/conversation/ChatMessage';
import { Conversation } from 'context';

export const ChatMessageForm: React.FC<{ disabled: boolean }> = ({ disabled }) => {
	//
	const [question, setQuestion] = React.useState<string>('');
	const { submitQuestion, addToConversation } = Conversation.useConversationContext();

	const handleSubmit = React.useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			addToConversation(new QuestionMessage(question));
			submitQuestion(question);
			setQuestion('');
		},
		[question, addToConversation, submitQuestion],
	);

	const handleKeyPress = React.useCallback(
		(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (event.key === 'Enter' && !event.shiftKey) {
				handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
			}
		},
		[handleSubmit],
	);

	return (
		<footer className="bg-gray-800 p-10">
			<form onSubmit={handleSubmit} noValidate>
				<fieldset className="flex gap-2" disabled={disabled}>
					<textarea
						value={question}
						onChange={(e) => setQuestion(e.target.value)}
						onKeyDown={handleKeyPress}
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
