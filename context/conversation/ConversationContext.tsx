import React from 'react';
import { AnswerMessage, Conversation, Message, QuestionMessage, SystemMessage, SystemWarningMessage } from 'model';
import { ConversationSet } from '../../model/ConversationSet';
import { ConversationApi } from './ConversationApi';

interface ConversationState {
	conversations: Conversation[] | null;
	currentConversation: Conversation | null;
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
	const [currentConversation, setCurrentConversation] = React.useState(null);
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

	const sendMessage = React.useCallback(
		async (question: string) => {
			if (question.length > 3) {
				setSystemMessage(null);
				const message = new QuestionMessage(question);
				if (!currentConversation) {
					const conversation = await conversationApi.createConversation(message.payload);
					setCurrentConversation(conversation);
					setConversations((prev) => [...prev, conversation]);
				} else {
					addToConversation(message);
				}
				setAnswerStream(new AnswerMessage());
				conversationApi.sendMessage(message.payload);
			} else {
				const warning = 'Tip: For better responses, aim for questions longer than 3 characters.';
				const message = new SystemWarningMessage(warning);
				setSystemMessage(message);
			}
		},
		[currentConversation, conversationApi],
	);

	const addToConversation = React.useCallback(
		async (message: Message) => {
			await conversationApi.addMessage(currentConversation.id, message.payload);
			setCurrentConversation((prevConversation: Conversation) => {
				const conversation = new Conversation(prevConversation.id, prevConversation.title);
				Object.assign(conversation, prevConversation);
				conversation.messages.add(message);
				return conversation;
			});
		},
		[currentConversation],
	);

	const contextValue = {
		conversations,
		answerStream,
		currentConversation,
		systemMessage,
		sendMessage,
	};

	return <ConversationContext.Provider value={contextValue}>{children}</ConversationContext.Provider>;
};
