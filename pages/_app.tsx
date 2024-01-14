import React from 'react';
import Head from 'next/head';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Outfit } from 'next/font/google';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ErrorBoundary } from 'react-error-boundary';

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
		<ErrorBoundary fallback={<div>Something went wrong</div>}>
			<UserProvider>
				<ConversationProvider>
					<Head>
						<link rel="icon" href="/logo.svg" />
					</Head>
					<main className={`${outfit.variable} font-body`}>
						<Component {...pageProps} />
					</main>
					<SpeedInsights />
				</ConversationProvider>
			</UserProvider>
		</ErrorBoundary>
	);
};

export default App;
