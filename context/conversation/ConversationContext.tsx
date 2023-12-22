import React from 'react';
import { ConversationSet } from './ConversationSet';
import { ChatMessageApi } from './ChatMessageApi';
import { Message } from './ChatMessage';

interface ConversationState {
	conversation: ConversationSet<Message>;
	answerStream: string;
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
	const [answerStream, setAnswerStream] = React.useState<string>('');
	const [conversation, setConversation] = React.useState(new ConversationSet<Message>());
	const { current: api } = React.useRef(new ChatMessageApi(setAnswerStream));

	const submitQuestion = React.useCallback(
		(question: string) => {
			api.sendMessage(question);
		},
		[api],
	);

	const addToConversation = React.useCallback((message: Message) => {
		setAnswerStream('');
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
