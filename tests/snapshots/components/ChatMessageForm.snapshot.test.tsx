import { render } from '@testing-library/react';
import { ChatMessageForm } from 'components';

test('ChatMessageForm matches snapshot', () => {
	const { container } = render(<ChatMessageForm conversationId="1" />);
	expect(container).toMatchSnapshot();
});
