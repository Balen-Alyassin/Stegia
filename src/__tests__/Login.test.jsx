import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, BrowserRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { themeSettings } from '../theme';
import Login from '../scenes/login/index';

const theme = createTheme(themeSettings('light'));

// Mock useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(() => jest.fn()),
}));

describe('Login Component', () => {
    beforeAll(() => {
        global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Logged in successfully' })
        }));
      });
      
      beforeEach(() => {
        jest.clearAllMocks();
      });
      

  test('renders login form', () => {
    render(
<MemoryRouter>
  <ThemeProvider theme={theme}>
    <Login />
  </ThemeProvider>
</MemoryRouter>

    );


    // Assert that the email and password input fields are rendered
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();

    // Assert that the login button is rendered
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  test('submits form with valid credentials', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

   // Fill in email and password fields
   fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'test@example.com' } });
   fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

  
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
  
    await waitFor(() => {
        expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });
  });

  test('displays error message for missing credentials', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
  
    await waitFor(() => {
      expect(screen.getByText('Please enter both email and password.')).toBeInTheDocument();
    });
  
    expect(mockNavigate).not.toHaveBeenCalled();  // Ensure navigation did not occur
  });
  
});