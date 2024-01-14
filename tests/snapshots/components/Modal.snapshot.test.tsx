import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import { Modal } from 'components';

describe('Modal', () => {
	beforeAll(() => {
		jest.spyOn(ReactDOM, 'createPortal').mockImplementation((element) => {
			return element as React.ReactPortal;
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('matches snapshot', () => {
		const { container } = render(
			<Modal open handleClose={jest.fn()}>
				<span />
			</Modal>,
		);
		expect(container).toMatchSnapshot();
	});
});
