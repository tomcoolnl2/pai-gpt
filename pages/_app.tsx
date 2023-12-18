import React from 'react';
import Head from 'next/head';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import '../styles/globals.css';

const App = ({ Component, pageProps }) => {
	return (
		<UserProvider>
			<Head>
				<link rel="icon" href="/logo.svg" />
			</Head>
			<Component {...pageProps} />
		</UserProvider>
	);
};

export default App;
