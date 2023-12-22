import React from 'react';
import { QuestionMessage } from 'context/conversation/ChatMessage';
import { useConversationContext } from 'context/conversation';

export const ChatMessageForm: React.FC<{ disabled: boolean }> = ({ disabled }) => {
	//
	const [question, setQuestion] = React.useState<string>('');
	const { submitQuestion, addToConversation } = useConversationContext();

	const handleSubmit = React.useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			const message = new QuestionMessage(question);
			addToConversation(message);
			submitQuestion(question);
			setQuestion('');
		},
		[question, addToConversation, submitQuestion],
	);

	return (
		<footer className="bg-gray-800 p-10">
			<form onSubmit={handleSubmit}>
				<fieldset className="flex gap-2" disabled={disabled}>
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
