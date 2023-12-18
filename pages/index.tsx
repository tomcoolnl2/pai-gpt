import Head from 'next/head';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getSession } from '@auth0/nextjs-auth0';

export default function Home() {
	const { isLoading, error, user } = useUser();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error.message}</div>;
	}

	return (
		<>
			<Head>
				<title>PAI - GPT</title>
			</Head>
			<div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-800">
				<figure className="flex max-w-lg flex-col items-center">
					<img src="/logo.svg" width={100} />
					<figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
						PAI - GPT
					</figcaption>
				</figure>
				<hr className="mx-auto my-4 h-1 w-48 rounded border-0 bg-gray-100 dark:bg-gray-700 md:my-10" />
				{!!user && (
					<Link href="/api/auth/logout" className="text-white">
						Logout
					</Link>
				)}
				{!user && (
					<Link
						href="/api/auth/login"
						className="rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
					>
						Login
					</Link>
				)}
			</div>
		</>
	);
}

export const getServerSideProps = async ({ req, res }) => {
	const session = await getSession(req, res);
	return !session
		? { props: {} }
		: {
				redirect: {
					destination: '/chat',
				},
		  };
};
