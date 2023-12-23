import React from 'react';
import Head from 'next/head';
import { ChatSidebar, ChatMessage, ChatMessageForm } from 'components';
import { Conversation } from 'context';

export default function ChatPage() {
	//
	const { conversation, answerStream } = Conversation.useConversationContext();

	const disabled = React.useMemo(() => {
		if (answerStream instanceof Conversation.AnswerMessage) {
			return !answerStream.done;
		}
		return false;
	}, [answerStream]);

	React.useEffect(() => {
		console.log('answerStream', answerStream);
	}, [answerStream]);

	return (
		<>
			<Head>
				<title>New Chat</title>
			</Head>
			<div className="grid h-screen grid-cols-[260px_1fr]">
				<ChatSidebar />
				<div className="flex flex-col bg-gray-700 overflow-hidden">
					<ul className="flex-1 text-white p-10 overflow-scroll">
						{conversation.map((message) => (
							<ChatMessage key={message.id} {...message} />
						))}
						{answerStream && <ChatMessage {...answerStream} />}
					</ul>
					<ChatMessageForm disabled={disabled} />
				</div>
			</div>
		</>
	);
}
