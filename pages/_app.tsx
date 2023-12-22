import React from 'react';
import Head from 'next/head';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ConversationProvider } from 'context/conversation';
import '../styles/globals.css';

const App = ({ Component, pageProps }) => {
	return (
		<UserProvider>
			<ConversationProvider>
				<Head>
					<link rel="icon" href="/logo.svg" />
				</Head>
				<Component {...pageProps} />
			</ConversationProvider>
		</UserProvider>
	);
};

export default App;
