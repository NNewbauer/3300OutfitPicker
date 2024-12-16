module.exports = {
    testEnvironment: "jsdom", // Required for DOM-based testing
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Optional, create setup script if needed
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js", // Mock image files
        "\\.(css|scss|sass)$": "identity-obj-proxy", // Mock CSS files
    },
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest", // Use Babel to transform JavaScript/JSX
    },
    transformIgnorePatterns: ["/node_modules/"], // Ignore node_modules for transformations
};
