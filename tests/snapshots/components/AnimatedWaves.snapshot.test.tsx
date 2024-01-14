import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { AnimatedWaves } from 'components';

global.ResizeObserver = require('resize-observer-polyfill');

test('renders AnimatedWaves component correctly', async () => {
	let container;

	await act(async () => {
		const { container: renderedContainer } = render(<AnimatedWaves />);
		container = renderedContainer;
	});

	expect(container).toMatchSnapshot();
});
