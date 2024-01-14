import { render } from '@testing-library/react';
import { SidebarItem } from 'components';

test('SidebarItem matches snapshot', () => {
	const { container } = render(<SidebarItem id="1" title="test" selected openDeleteModal={jest.fn} />);
	expect(container).toMatchSnapshot();
});
