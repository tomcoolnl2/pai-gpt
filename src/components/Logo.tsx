import React from 'react';

export const Logo: React.FC = () => {
	return (
		<>
			<figure className="flex max-w-lg flex-col items-center">
				<img src="/logo.svg" width={100} height={100} />
				<figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">PAI - GPT</figcaption>
			</figure>
			<hr className="mx-auto my-4 h-1 w-48 rounded border-0 bg-gray-100 dark:bg-gray-700 md:my-10" />
		</>
	);
};
