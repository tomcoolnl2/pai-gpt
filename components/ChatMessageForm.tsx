import React from 'react';
import { AnswerMessage } from 'model';
import { useConversationContext } from 'context/conversation';

export const ChatMessageForm: React.FC = () => {
	//
	const [question, setQuestion] = React.useState<string>('');
	const { answerStream, sendMessage } = useConversationContext();

	const disabled = React.useMemo(() => {
		if (answerStream instanceof AnswerMessage) {
			return !answerStream.done;
		}
		return false;
	}, [answerStream]);

	const handleSubmit = React.useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			sendMessage(question);
			setQuestion('');
		},
		[question, sendMessage],
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
