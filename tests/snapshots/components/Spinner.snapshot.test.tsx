import { render } from '@testing-library/react';
import { Spinner } from 'components';

test('Spinner matches snapshot', () => {
	const { container } = render(<Spinner />);
	expect(container).toMatchSnapshot();
});
