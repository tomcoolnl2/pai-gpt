import React from 'react';
import Head from 'next/head';
import { ChatSidebar, ChatMessage, ChatMessageForm } from 'components';
import { AnswerMessage, ConversationRole, SystemMessage, useConversationContext } from 'context/conversation';

export default function ChatPage() {
	//
	const { conversation, answerStream } = useConversationContext();

	const disabled = React.useMemo(() => {
		if (answerStream instanceof AnswerMessage) {
			return !answerStream.done;
		}
		return false;
	}, [answerStream]);

	return (
		<>
			<Head>
				<title>New Chat</title>
			</Head>
			<div className="grid h-screen grid-cols-[260px_1fr]">
				<ChatSidebar />
				<div className="flex flex-col bg-gray-700">
					<ul className="flex-1 text-white p-10">
						{conversation.map((message) => (
							<ChatMessage key={message.id} {...message} />
						))}
						{answerStream?.content && <ChatMessage {...answerStream} />}
					</ul>
					<ChatMessageForm disabled={disabled} />
				</div>
			</div>
		</>
	);
}
