import React from 'react';
import { ConversationSet } from './ConversationSet';
import { ConversationApi } from './ConversationApi';
import { AnswerMessage, Message, QuestionMessage, SystemMessage, SystemWarningMessage } from './ConversationMessage';

interface ConversationState {
	conversation: ConversationSet<Message> | null;
	answerStream: Message | null;
	systemMessage: SystemMessage | null;
	getConversationList: () => Promise<void>;
	submitQuestion: (question: string) => void;
}

const initialConversationContext = {
	conversation: null,
	answerStream: null,
	systemMessage: null,
	getConversationList: () => void 0,
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
	const [systemMessage, setSystemMessage] = React.useState<SystemMessage>(null);
	const { current: conversationApi } = React.useRef(new ConversationApi(setAnswerStream));

	React.useEffect(() => {
		if (answerStream?.done) {
			addToConversation(answerStream);
			setAnswerStream(null);
		}
	}, [answerStream]);

	const getConversationList = React.useCallback(async () => {
		return await conversationApi.getConversationList();
	}, []);

	const submitQuestion = React.useCallback(
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
		setConversation((prevConv) => {
			const conversation = new ConversationSet([...prevConv]);
			return conversation.add(message);
		});
	}, []);

	const contextValue = React.useMemo(
		() => ({ answerStream, conversation, systemMessage, getConversationList, submitQuestion }),
		[answerStream, conversation, systemMessage, getConversationList, submitQuestion],
	);

	return <ConversationContext.Provider value={contextValue}>{children}</ConversationContext.Provider>;
};
