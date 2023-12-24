import React from 'react';
import { AnswerMessage, Conversation, Message, QuestionMessage, SystemMessage, SystemWarningMessage } from 'model';
import { ConversationSet } from '../../model/ConversationSet';
import { ConversationApi } from './ConversationApi';

interface ConversationState {
	conversations: Conversation[] | null;
	currentConversation: ConversationSet<Message> | null;
	answerStream: Message | null;
	systemMessage: SystemMessage | null;
	sendMessage: (question: string) => void;
}

const initialConversationContext = {
	conversations: null,
	currentConversation: null,
	answerStream: null,
	systemMessage: null,
	sendMessage: () => void 0,
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
	const [conversations, setConversations] = React.useState<Conversation[]>(null);
	const [currentConversation, setCurrentConversation] = React.useState(new ConversationSet<Message>());
	const [answerStream, setAnswerStream] = React.useState<Message>(null);
	const [systemMessage, setSystemMessage] = React.useState<SystemMessage>(null);
	const { current: conversationApi } = React.useRef(new ConversationApi(setAnswerStream));

	React.useEffect(() => {
		if (answerStream?.done) {
			addToConversation(answerStream);
			setAnswerStream(null);
		}
	}, [answerStream]);

	React.useEffect(() => {
		const getConversations = async () => {
			const list = await conversationApi.getConversationList();
			setConversations(list);
		};
		getConversations();
	}, []);

	// const createConversation = React.useCallback(() => {
	// 	return conversationApi.createConversation();
	// }, []);

	const sendMessage = React.useCallback(
		(question: string) => {
			if (question.length > 3) {
				setSystemMessage(null);
				addToConversation(new QuestionMessage(question));
				setAnswerStream(new AnswerMessage());
				conversationApi.sendMessage(question);
			} else {
				const warning = 'Tip: For better responses, aim for questions longer than 3 characters.';
				const message = new SystemWarningMessage(warning);
				setSystemMessage(message);
			}
		},
		[conversationApi],
	);

	const addToConversation = React.useCallback((message: Message) => {
		setCurrentConversation((prevConv) => {
			const conversation = new ConversationSet([...prevConv]);
			return conversation.add(message);
		});
	}, []);

	const contextValue = {
		conversations,
		answerStream,
		currentConversation,
		systemMessage,
		sendMessage,
	};

	return <ConversationContext.Provider value={contextValue}>{children}</ConversationContext.Provider>;
};
