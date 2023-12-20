import React from 'react';
import Head from 'next/head';
import { useMemo, useState } from 'react';
import { ChatSidebar } from 'components';

export default function ChatPage() {
	//
	const [messageText, setMessageText] = useState<string>('What is your name?');
	const [incommingMessage, setsetIncommingMessageMessageText] = useState<string>('');

	const prompt = useMemo(
		() => `Q: ${messageText}. Generate a response with less than 200 characters.`,
		[messageText]
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('MESSAGE TEXT: ', messageText);

		const response = await fetch('/api/chat/sendMessage', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ prompt }),
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		const data = response.body;
		if (!data) {
			return;
		}

		const reader = data.getReader();
		const decoder = new TextDecoder();
		let done = false;

		while (!done) {
			const { value, done: doneReading } = await reader.read();
			done = doneReading;
			const chunkValue = decoder.decode(value);
			setsetIncommingMessageMessageText((prev) => prev + chunkValue);
		}
	};

	return (
		<>
			<Head>
				<title>New Chat</title>
			</Head>
			<div className="grid h-screen grid-cols-[260px_1fr]">
				<ChatSidebar />
				<div className="flex flex-col bg-gray-700">
					<div className="flex-1">{incommingMessage}</div>
					<footer className="bg-gray-800 p-10">
						<form onSubmit={handleSubmit}>
							<fieldset className="flex gap-2">
								<textarea
									value={messageText}
									onChange={(e) => setMessageText(e.target.value)}
									placeholder="Send a message..."
									className="textarea"
								/>
								<button type="submit" className="btn">
									Send
								</button>
							</fieldset>
						</form>
					</footer>
				</div>
			</div>
		</>
	);
}
