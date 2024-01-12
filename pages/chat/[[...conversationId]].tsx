import React from 'react';
import Head from 'next/head';
import { Sidebar, ChatMessageForm, ChatMessage } from 'components';
import { useConversationContext } from 'context/conversation';
import { GetServerSideProps } from 'next';

export default function ChatPage({ conversationId }) {
	//
	const { currentThread, answerStream, systemMessage } = useConversationContext();

	return (
		<>
			<Head>
				<title>{currentThread?.title || 'New Chat'}</title>
			</Head>
			<div id="modal-root" className="grid h-screen grid-cols-[260px_1fr]">
				<Sidebar conversationId={conversationId} />
				<div className="flex flex-col bg-gray-700 overflow-hidden">
					<div className="flex-1 flex flex-col-reverse overflow-y-scroll no-scrollbar">
						<ul className="text-white p-10 mb-auto">
							{currentThread &&
								currentThread.messages.map((message) => <ChatMessage key={message.id} {...message} />)}
							{answerStream && <ChatMessage {...answerStream} />}
							{systemMessage && <ChatMessage {...systemMessage} />}
						</ul>
					</div>
					<ChatMessageForm conversationId={conversationId} />
				</div>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const conversationId = ctx.params?.conversationId?.[0] || null;
	return {
		props: {
			conversationId,
		},
	};
};
