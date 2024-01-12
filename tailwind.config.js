/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx}',
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',

		// Or if using `src` directory:
		'./src/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		container: {
			center: true,
		},
		extend: {
			fontFamily: {
				body: 'var(--font-outfit), sans-serif'
			},
			animation: {
				ellipsis: 'ellipsis steps(4,end) 900ms infinite',
			},
			keyframes: {
				ellipsis: {
				  	'to': { width: '1.25em' },
				}
			}
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
