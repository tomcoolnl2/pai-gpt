import React from 'react';
import { ConversationSet } from './ConversationSet';
import { ConversationApi } from './ConversationApi';
import { Message, AnswerMessage, SystemMessage } from './ChatMessage';
import demoConversation from 'public/demo.json';

interface ConversationState {
	conversation: ConversationSet<Message> | null;
	answerStream: Message;
	addToConversation: (message: Message) => void;
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
	const [answerStream, setAnswerStream] = React.useState<Message>(null);
	const [conversation, setConversation] = React.useState(new ConversationSet<Message>());
	const { current: api } = React.useRef(new ConversationApi(setAnswerStream));

	React.useEffect(() => {
		if (answerStream?.done) {
			addToConversation(answerStream);
			setAnswerStream(null);
		}
	}, [answerStream]);

	const submitQuestion = React.useCallback(
		(question: string) => {
			setAnswerStream(new AnswerMessage());
			api.sendMessage(question);
		},
		[api],
	);

	const addToConversation = React.useCallback((message: Message): void => {
		setConversation((prevConv) => {
			const conversation = new ConversationSet([...prevConv]);
			return conversation.add(message);
		});
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
