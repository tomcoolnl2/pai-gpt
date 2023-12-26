import React from 'react';
import { NextRouter, useRouter } from 'next/router';
import { UserContext, useUser } from '@auth0/nextjs-auth0/client';
import { AnswerMessage, Conversation, Message, QuestionMessage, SystemMessage, SystemWarningMessage } from 'model';
import { ConversationApi } from 'api';

interface ConversationState {
	conversations: Conversation[] | null;
	currentThread: Conversation | null;
	answerStream: Message | null;
	systemMessage: SystemMessage | null;
	sendMessage: (conversationId: string, question: string) => void;
	deleteConversation: (conversationId: string) => Promise<void>;
}

const initialConversationContext = {
	conversations: null,
	currentThread: null,
	answerStream: null,
	systemMessage: null,
	sendMessage: () => void 0,
	deleteConversation: () => void 0,
};

const ConversationContext = React.createContext<ConversationState>(initialConversationContext);

export const useConversationContext = () => {
	return React.useContext(ConversationContext);
};

interface Props {
	children: React.ReactNode;
}

export const ConversationProvider: React.FC<Props> = React.memo(({ children }) => {
	//
	const [conversations, setConversations] = React.useState<Conversation[]>(null);
	const [currentThread, setCurrentThread] = React.useState<Conversation>(null);
	const [answerStream, setAnswerStream] = React.useState<Message>(null);
	const [systemMessage, setSystemMessage] = React.useState<SystemMessage>(null);

	const { current: conversationApi } = React.useRef(new ConversationApi(setAnswerStream));

	const { user }: UserContext = useUser();
	const router: NextRouter = useRouter();

	React.useEffect(() => {
		if (user) {
			(async () => {
				const list = await conversationApi.getConversationList();
				setConversations(list);
			})();
		}
	}, [user]);

	React.useEffect(() => {
		if (user) {
			(async () => {
				const { conversationId: [id = null] = [] } = router.query;

				// a new chat started
				if (id == null) {
					setCurrentThread(null);
					setAnswerStream(null);
					setSystemMessage(null);
				}

				// the route has changed
				if (id && currentThread?.id !== id) {
					// if a stream is producing a answer cancel it
					if (answerStream instanceof Message && !answerStream?.done) {
						conversationApi.cancelReadableStream = true;
					}
					const conversation = await conversationApi.getConversation(id);
					setCurrentThread(conversation);
				}
			})();
		}
	}, [user, router.query, currentThread]);

	React.useEffect(() => {
		if (!user) {
			return;
		}
		if (answerStream instanceof AnswerMessage && answerStream.done) {
			console.log('answerStream done', answerStream);
			addToConversation(answerStream);
		}
	}, [user, answerStream?.done]);

	const sendMessage = React.useCallback(
		async (conversationId: string, question: string) => {
			if (question.length > 3) {
				//
				setSystemMessage(null);
				const message = new QuestionMessage(question);

				if (!currentThread) {
					const conversation = await conversationApi.createConversation(message.payload);
					setCurrentThread(conversation);
					setConversations((prev) => [...prev, conversation]);
					router.push(`/chat/${conversation.id}`);
					//
				} else {
					await addToConversation(message);
					await conversationApi.sendMessage(conversationId, message.payload);
				}
				setAnswerStream(new AnswerMessage());
			} else {
				const warning = 'Tip: For better responses, aim for questions longer than 3 characters.';
				const message = new SystemWarningMessage(warning);
				setSystemMessage(message);
			}
		},
		[currentThread, conversationApi, router],
	);

	const addToConversation = React.useCallback(
		async (message: Message) => {
			const added = await conversationApi.addMessage(currentThread.id, message.payload);
			if (added) {
				setCurrentThread((prevConversation: Conversation) => {
					const conversation = new Conversation(prevConversation.id, prevConversation.title);
					Object.assign(conversation, prevConversation);
					conversation.messages.add(message);
					return conversation;
				});
				if (message instanceof AnswerMessage) {
					setAnswerStream(null);
				}
			}
		},
		[currentThread],
	);

	const deleteConversation = React.useCallback(
		async (conversationId: string) => {
			await conversationApi.deleteConversation(conversationId);
			setConversations(conversations.filter((conversation) => conversation.id !== conversationId));
			router.push('/chat');
		},
		[conversations, conversationApi],
	);

	const contextValue = React.useMemo(() => {
		return !user
			? initialConversationContext
			: {
					conversations,
					answerStream,
					currentThread,
					systemMessage,
					sendMessage,
					deleteConversation,
				};
	}, [user, conversations, answerStream, currentThread, systemMessage, sendMessage, deleteConversation]);

	return <ConversationContext.Provider value={contextValue}>{children}</ConversationContext.Provider>;
});
