import '@testing-library/jest-dom';

// Polyfill fetch
import 'whatwg-fetch';

import * as mockServer from './test/mock-server';

// Establish API mocking before all tests.
beforeAll(() => mockServer.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => mockServer.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => mockServer.close());

// Setup process.env
process.env.REACT_APP_API_BASE_URL = 'http://localhost/jest-test-api';
