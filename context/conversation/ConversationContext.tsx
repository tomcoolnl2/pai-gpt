import React from 'react';
import { v4 as uuid } from 'uuid';
import { ConversationSet } from './ConversationSet';
import { ChatMessageApi } from './ChatMessageApi';
import { Answer, ConversationRole, Message } from './ChatMessage';
import demoConversation from 'public/demo.json';

interface ConversationState {
	conversation: ConversationSet<Message>;
	answerStream: Answer;
	addToConversation: (item: Message) => void;
	submitQuestion: (question: string) => void;
}

const initialConversationContext = {
	conversation: null,
	answerStream: null,
	addToConversation: () => void 0,
	submitQuestion: () => void 0,
};

const ConversationContext = React.createContext<ConversationState>(initialConversationContext);

export const useConversationContext = () => {
	return React.useContext(ConversationContext);
};

interface Props {
	children: React.ReactNode;
}

export const ConversationProvider: React.FC<Props> = ({ children }) => {
	//
	const [answerStream, setAnswerStream] = React.useState<Answer>(new Answer());
	const [conversation, setConversation] = React.useState(new ConversationSet<Message>());
	const { current: api } = React.useRef(new ChatMessageApi(setAnswerStream));

	React.useEffect(() => {
		// for development purposes
		demoConversation.map((message) => conversation.add(message as Message));
	}, []);

	React.useEffect(() => {
		if (answerStream.done) {
			const message = convertAnswerToMessage(answerStream);
			addToConversation(message);
			setAnswerStream(new Answer());
		}
	}, [answerStream.done]);

	const convertAnswerToMessage = React.useCallback((answer: Answer): Message => {
		const { content } = answer;
		const role = ConversationRole.ASSISTENT;
		return new Message(uuid(), role, content);
	}, []);

	const submitQuestion = React.useCallback(
		(question: string) => {
			api.sendMessage(question);
		},
		[api],
	);

	const addToConversation = React.useCallback((message: Message) => {
		setConversation((prevConv) => new ConversationSet([...prevConv]).add(message));
	}, []);

	const contextValue = React.useMemo(
		() => ({
			answerStream,
			conversation,
			addToConversation,
			submitQuestion,
		}),
		[answerStream, conversation, addToConversation, submitQuestion],
	);

	return <ConversationContext.Provider value={contextValue}>{children}</ConversationContext.Provider>;
};
