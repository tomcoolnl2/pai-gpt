'use client';
import React from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { AnimatedWaves, Logo, Spinner } from '../components';

export default function Home() {
	const { isLoading, error, user } = useUser();

	// if error => error page

	if (error) {
		console.error(error);
	}

	return (
		<>
			<div className="bg-animation-waves">
				<AnimatedWaves />
			</div>
			<div className="splash-page">
				<Logo />
				{isLoading && <Spinner />}
				{!user && !isLoading && (
					<Link href="/api/auth/login" className="btn">
						Login
					</Link>
				)}
			</div>
		</>
	);
}
