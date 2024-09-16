import { useState, useEffect } from 'react';
import { SlRefresh, SlClock } from "react-icons/sl";
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';

import ReviewInput from './components/ReviewInput';
import BasicModal from './components/Modal';
import Grid from './components/Grid';
import { movieItem, movieCompanyItem } from './types/types';

export const App = (): JSX.Element =>  {
	const [movies, setMovies] = useState<movieItem[]>([]);
	const [movieCompanies, setMovieCompanies] = useState<movieCompanyItem[]>([]);
	const [formattedMovies, setFormattedMovies] = useState<movieItem[]>([]);
	const [selectedMovie, setSelectedMovie] = useState<movieItem | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

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
  };

  const formatData = () => {
    const formattedData = movies.map((movie) => ({
      ...movie,
      filmCompany: movieCompanies.find((company) => company.id === movie.filmCompanyId)?.name,
      averageReview: Number((movie.reviews.reduce((acc, i) => acc + i, 0) / movie.reviews.length).toFixed(1))
    }));
    setFormattedMovies(formattedData);
  };

  return (
    <Box sx={{margin: '10%'}}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 style={{fontSize: '1.2rem'}}>Welcome to Movie database!</h1>
        <Button onClick={refreshData}>{isLoading ? <SlClock /> : <SlRefresh />}</Button> 
      </Box> 
      <Box sx={{ height: 400, width: '100%', overflowX: isMobile ? 'auto' : 'hidden' }}>
        {(movies.length && movieCompanies.length) ?
          (<Grid 
            formattedMovies={formattedMovies} 
            isMobile={isMobile} 
            setSelectedMovie={setSelectedMovie} 
            setOpen={setOpen} 
          />) 
          : error && <p style={{ color: 'red' }}>{error}</p>
        }
      </Box>
      <Box sx={{ margin: '10px' }}>
        {!selectedMovie && <Typography sx={{marginTop: '10px'}}>Select a movie to review</Typography>}
        {selectedMovie && (
        isMobile ? (
            open && <BasicModal movieId={selectedMovie.id} selectedMovie={selectedMovie} open={open} setOpen={setOpen} setSelectedMovie={setSelectedMovie} />
          ) : (
            <ReviewInput movieId={selectedMovie.id} selectedMovie={selectedMovie} />
          )
        )}
      </Box>
    </Box>
  );
};