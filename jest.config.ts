import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
	dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
	collectCoverage: true,
	coverageProvider: 'v8',
	collectCoverageFrom: [
		'**/*.{js,jsx,ts,tsx}',
		'!**/*.d.ts',
		'!**/node_modules/**',
		'!<rootDir>/out/**',
		'!<rootDir>/.next/**',
		'!<rootDir>/*.config.js',
		'!<rootDir>/coverage/**',
		'!<rootDir>/**/*.config.ts',
		'!<rootDir>/**/*.setup.ts',
		'!<rootDir>/middleware.ts',
	],
	moduleNameMapper: {
		'^.+\\.(css|sass|scss)$': '<rootDir>/tests/__mocks__/styleMock.ts',
		'^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i': '<rootDir>/__mocks__/fileMock.ts',
		'^@/components/(.*)$': '<rootDir>/components/$1',
		'react-markdown': '<rootDir>/tests/__mocks__/reactMarkdownMock.tsx',
	},
	preset: 'ts-jest',
	moduleDirectories: ['node_modules', '<rootDir>'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				tsconfig: 'tsconfig.jest.json',
			},
		],
	},
	transformIgnorePatterns: ['/node_modules/', 'node_modules/(?!react-markdown/)', '^.+\\.module\\.(css|sass|scss)$'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
