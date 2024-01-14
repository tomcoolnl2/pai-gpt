import { render } from '@testing-library/react';
import { UserProvider, useUser } from '@auth0/nextjs-auth0/client';
import { ChatMessage } from 'components';
import { Role } from 'model';

jest.mock('@auth0/nextjs-auth0/client', () => ({
	...jest.requireActual('@auth0/nextjs-auth0/client'),
	useUser: jest.fn(),
	UserProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('react-markdown', () => ({
	__esModule: true,
	default: ({ children }) => <div data-testid="mocked-react-markdown">{children}</div>,
}));

jest.mock('next/image', () => ({
	__esModule: true,
	default: ({ src }) => <img src={src} alt="mocked-avatar" />,
}));

describe('ChatMessage Component', () => {
	it('should match the snapshot', () => {
		// Mock the return value of useUser
		(useUser as jest.Mock).mockReturnValue({
			user: {
				name: 'marydoe@gmail.com',
				email: 'marydoe@gmail.com',
			},
		});

		const { container } = render(
			<UserProvider>
				<ChatMessage id="1" role={Role.USER} content="Hello, World!" done />
			</UserProvider>,
		);

		expect(container).toMatchSnapshot();
	});
});
