import Head from 'next/head';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getSession } from '@auth0/nextjs-auth0';
import { AnimatedWaves, Logo, Spinner } from 'components';

export const Home: React.FC = () => {
	//
	const { isLoading, error, user } = useUser();

	if (error) {
		return <div>{error.message}</div>;
	}

	return (
		<>
			<Head>
				<title>PAI - GPT</title>
			</Head>
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
};

export default Home;

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
