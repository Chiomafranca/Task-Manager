import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock fetch
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ tasks: [], users: [] }),
    })
  );
});

afterAll(() => {
  global.fetch.mockClear();
  delete global.fetch;
});

test('renders task manager title', async () => {
  await act(async () => {
    render(<App />);
  });

  const titleElement = screen.getByText(/task manager/i);
  expect(titleElement).toBeInTheDocument();
});
