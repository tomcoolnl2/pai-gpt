import React from 'react';
import Head from 'next/head';
import '../styles/globals.css';

const App = ({ Component, pageProps }) => {
	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.png" />
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default App;
