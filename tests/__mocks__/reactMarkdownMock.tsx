export const Markdown = ({ children }) => {
	// Mock implementation, handle undefined content
	return <div data-testid="mocked-react-markdown">{children || 'No content available'}</div>;
};

export const defaultUrlTransform = (url) => {
	// Mock URL transform function, you can customize this as needed
	return url;
};
