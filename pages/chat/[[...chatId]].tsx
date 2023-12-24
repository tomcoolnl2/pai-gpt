import React from 'react';
import Head from 'next/head';
import { Sidebar, ChatMessageForm, ChatMessage } from 'components';
import { useConversationContext } from 'context/conversation';

export default function ChatPage() {
	//
	const { currentConversation, answerStream, systemMessage } = useConversationContext();

	return (
		<>
			<Head>
				<title>New Chat</title>
			</Head>
			<div className="grid h-screen grid-cols-[260px_1fr]">
				<Sidebar />
				<div className="flex flex-col bg-gray-700 overflow-hidden">
					<ul className="flex-1 text-white p-10 overflow-scroll">
						{currentConversation.map((message) => (
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
