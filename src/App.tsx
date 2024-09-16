import { useState, useEffect } from 'react';
import { movieItem, movieCompanyItem } from './types/types';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ReviewInput from './components/ReviewInput';
import Modal from './components/Modal';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export const App = () =>  {
	const [movies, setMovies] = useState<movieItem[]>([]);
	const [movieCompanies, setMovieCompanies] = useState<movieCompanyItem[]>([]);
	const [formattedMovies, setFormattedMovies] = useState<movieItem[]>([]);
	const [selectedMovie, setSelectedMovie] = useState<movieItem | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false); //implement

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (!isLoading && !error) {
			formatData();
		}
	}, [isLoading, error, movies, movieCompanies]);

	const fetchData = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const [moviesResponse, companiesResponse] = await Promise.all([
				fetch('http://localhost:3000/movies'),
				fetch('http://localhost:3000/movieCompanies')
			]);

			if (!moviesResponse.ok || !companiesResponse.ok) {
				throw new Error('Failed to fetch data');
			}

			const moviesData = await moviesResponse.json();
			const companiesData = await companiesResponse.json();

			setMovies(moviesData);
			setMovieCompanies(companiesData);
		} catch (error) {
			console.error('Error fetching data:', error);
			setError('Failed to load data. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

  const refreshData = () => {
    setMovies([]);
    setMovieCompanies([]);
    setFormattedMovies([]);
    setSelectedMovie(null);
    fetchData();
  }

  const formatData = () => {
    const formattedData = movies.map((movie) => ({
      ...movie,
      filmCompany: movieCompanies.find((company) => company.id === movie.filmCompanyId)?.name,
      averageReview: Number((movie.reviews.reduce((acc, i) => acc + i, 0) / movie.reviews.length).toFixed(1))
    }));
    setFormattedMovies(formattedData);
  };
 
  const columns: GridColDef<(typeof formattedMovies)[number]>[] = [
    { 
      field: 'title', 
      headerName: 'Title', 
      width: 150, 
      editable: false 
    },
    {
      field: 'averageReview',
      headerName: 'Rating',
      width: 150,
      editable: false,
    },
    {
      field: 'filmCompany',
      headerName: 'Film Company',
      width: 150,
      editable: false,
    }
  ];

  return (
    <div>
      <h2>Welcome to Movie database!</h2>
      
      <Box sx={{ height: 400, width: '100%' }}>
      {(movies.length && movieCompanies.length) ?
       (<DataGrid
        rows={formattedMovies}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        onRowClick={(params) => {
          console.log(params.row);
          setSelectedMovie(params.row);
        }}
      />) 
      : error && <p style={{ color: 'red' }}>{error}</p>
    }
    </Box>
    
    
      <Button onClick={refreshData}>{isLoading ? "Loading..." : "Refresh Data"}</Button>
      
      
      <div>
       
       {selectedMovie && (
         isMobile ? (
           !open && <Modal movieId={selectedMovie.id} selectedMovie={selectedMovie} />
         ) : (
           <ReviewInput movieId={selectedMovie.id} selectedMovie={selectedMovie} />
         )
       )}
      </div>
    </div>
  );
}