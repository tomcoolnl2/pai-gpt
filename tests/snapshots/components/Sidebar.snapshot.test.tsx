import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import { Sidebar } from 'components';

describe('Sidebar', () => {
	beforeAll(() => {
		jest.spyOn(ReactDOM, 'createPortal').mockImplementation((element) => {
			return element as React.ReactPortal;
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('matches snapshot', () => {
		const { container } = render(<Sidebar conversationId="1" />);
		expect(container).toMatchSnapshot();
	});
});
