import React from 'react';
import Head from 'next/head';
import { ChatSidebar, ChatMessage, ChatMessageForm } from 'components';
import { useConversationContext } from 'context/conversation';

export default function ChatPage() {
	//
	const { conversation, answerStream, systemMessage } = useConversationContext();

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
						{systemMessage && <ChatMessage {...systemMessage} />}
					</ul>
					<ChatMessageForm />
				</div>
			</div>
		</>
	);
}
