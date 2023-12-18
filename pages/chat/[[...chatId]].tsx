import Head from 'next/head';

export default function Chat({ chatId }) {
	return (
		<div>
			<Head>
				<title>PAI - GPT</title>
			</Head>
			<h1>Chat ID {chatId}</h1>
		</div>
	);
}
