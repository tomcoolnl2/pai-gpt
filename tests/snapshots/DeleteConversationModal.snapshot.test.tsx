import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import { DeleteConversationModal } from 'components';

describe('DeleteConversationModal', () => {
	beforeAll(() => {
		jest.spyOn(ReactDOM, 'createPortal').mockImplementation((element) => {
			return element as React.ReactPortal;
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it(' matches snapshot', () => {
		const { container } = render(<DeleteConversationModal open handleClose={jest.fn} handleDelete={jest.fn} />);
		expect(container).toMatchSnapshot();
	});
});
