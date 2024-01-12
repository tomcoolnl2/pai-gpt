import React from 'react';
import Head from 'next/head';
import { Outfit } from 'next/font/google';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ConversationProvider } from 'context/conversation';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '../styles/globals.css';

config.autoAddCss = false;

const outfit = Outfit({
	subsets: ['latin'],
	variable: '--font-outfit',
});

const App = ({ Component, pageProps }) => {
	return (
		<UserProvider>
			<ConversationProvider>
				<Head>
					<link rel="icon" href="/logo.svg" />
				</Head>
				<main className={`${outfit.variable} font-body`}>
					<Component {...pageProps} />
				</main>
			</ConversationProvider>
		</UserProvider>
	);
};

export default App;
