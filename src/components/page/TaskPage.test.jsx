import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';   
import TaskPage from './TaskPage'; 


beforeAll(() => {
  global.fetch = jest.fn((url) => {
    if (url === '/api/tasks') {
      return Promise.resolve({
        json: () => Promise.resolve({ tasks: [{ id: 1, title: 'Tasks' }] }),
      });
    }
    if (url === '/api/users') {
      return Promise.resolve({
        json: () => Promise.resolve({ users: [] }),
      });
    }
  });
});

afterAll(() => {
  global.fetch.mockClear();
  delete global.fetch;
});

test('renders task title', async () => {
  render(<TaskPage />);
  const title = await screen.findByText(/Tasks/i);  
  expect(title).toBeInTheDocument();
});
