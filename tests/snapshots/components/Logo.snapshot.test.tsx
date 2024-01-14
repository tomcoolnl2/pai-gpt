import { render } from '@testing-library/react';
import { Logo } from 'components';

test('Logo matches snapshot', () => {
	const { container } = render(<Logo />);
	expect(container).toMatchSnapshot();
});
