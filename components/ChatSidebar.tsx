import Link from 'next/link';

export const ChatSidebar: React.FC = () => {
	return (
		<aside className="bg-gray-900 text-white p-10">
			<Link href="/api/auth/logout">Logout</Link>
		</aside>
	);
};
