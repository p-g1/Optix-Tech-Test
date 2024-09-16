import { render, screen, waitFor, act, fireEvent, cleanup } from '@testing-library/react';
import { App } from '../App';
import '@testing-library/jest-dom';
import { formattedMovieItem } from '../types/types';

// Mock @mui/material module
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(() => false),
  useTheme: jest.fn(() => ({
    breakpoints: {
      down: jest.fn(() => 'sm'),
    },
  })),
}));

// Mock components
jest.mock('../components/Grid', () => ({
  __esModule: true,
  default: ({ formattedMovies }: { formattedMovies: formattedMovieItem[] }) => (
    <div data-testid="grid">
      {formattedMovies.map(movie => (
        <div key={movie.id}>
          <div>{movie.title}</div>
          <div>{movie.filmCompany}</div>
          <div>{movie.averageReview}</div>
        </div>
      ))}
    </div>
  ),
}));

jest.mock('../components/ReviewInput', () => ({
  __esModule: true,
  default: () => <div data-testid="review-input">Review Input Component</div>,
}));

jest.mock('../components/Modal', () => ({
  __esModule: true,
  default: () => <div data-testid="modal">Modal Component</div>,
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock;

//tests
describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders welcome message', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('Welcome to Movie database!')).toBeInTheDocument();
  });

  test('fetches and displays data', async () => {
    const mockMovies = [{ id: '1', title: 'Test Movie', reviews: [4, 5], filmCompanyId: 'c1', cost: 1000000, releaseYear: 2022 }];
    const mockCompanies = [{ id: 'c1', name: 'Test Company' }];

    (global.fetch as jest.Mock).mockImplementation((url: string) => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(url.includes('movies') ? mockMovies : mockCompanies),
      })
    );

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('grid')).toBeInTheDocument();
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });
  });

  test('displays error message on fetch failure', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
      })
    );

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to load data. Please try again.')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  test('renders "No movies or companies found" when data is empty', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('No movies or companies found')).toBeInTheDocument();
    });
  });

  test('formats movie data correctly', async () => {
    const mockMovies = [
      { id: '1', title: 'Test Movie', reviews: [4, 5], filmCompanyId: 'c1', cost: 1000000, releaseYear: 2022 }
    ];
    const mockCompanies = [{ id: 'c1', name: 'Test Company' }];

    // Mock fetch to return test data
    (global.fetch as jest.Mock).mockImplementation((url: string) => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(url.includes('movies') ? mockMovies : mockCompanies),
      })
    );

    await act(async () => {
      render(<App />);
    });

    // Wait for the data to be formatted and rendered
    await waitFor(() => {
      // Check if the Grid component is rendered
      const gridElement = screen.getByTestId('grid');
      expect(gridElement).toBeInTheDocument();

      // Check if the formatted movie data is correctly displayed
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
      expect(screen.getByText('Test Company')).toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });
  });

  test('refreshData calls fetchData', async () => {
    const mockMovies = [{ id: '1', title: 'Test Movie', reviews: [4, 5], filmCompanyId: 'c1', cost: 1000000, releaseYear: 2022 }];
    const mockCompanies = [{ id: 'c1', name: 'Test Company' }];

    // Mock fetch to return test data
    const fetchMock = jest.fn().mockImplementation((url: string) => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(url.includes('movies') ? mockMovies : mockCompanies),
      })
    );
    global.fetch = fetchMock as jest.Mock;

    await act(async () => {
      render(<App />);
    });

    // Wait for initial render to complete
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });

    // Clear the fetch mock calls
    fetchMock.mockClear();

    // Find and click the refresh button
    const refreshButton = screen.getByRole('button');
    fireEvent.click(refreshButton);

    // Check if fetch was called again
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2); // Once for movies, once for companies
    });
  });
});
