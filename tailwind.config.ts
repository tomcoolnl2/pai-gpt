import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		container: {
			center: true,
		},
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
			},
			fontFamily: {
				body: 'var(--font-outfit), sans-serif',
			},
			animation: {
				ellipsis: 'ellipsis steps(4,end) 900ms infinite',
			},
			keyframes: {
				ellipsis: {
					to: { width: '1.25em' },
				},
			},
		},
	},
	plugins: [typography()],
} satisfies Config;
