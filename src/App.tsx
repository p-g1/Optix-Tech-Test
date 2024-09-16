import { useState, useEffect } from 'react';
import { movieItem, movieCompanyItem } from './types/types';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ReviewInput from './components/ReviewInput';
import Modal from './components/Modal';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { SlRefresh, SlClock } from "react-icons/sl";

export const App = () =>  {
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
 
  const mobileColumns: GridColDef<(typeof formattedMovies)[number]>[] = [
    { 
      field: 'title', 
      headerName: 'Title', 
      width: 200, 
      editable: false 
    },
    {
      field: 'averageReview',
      headerName: 'Rating',
      width: 120,
      editable: false,
    },
  ];

  const desktopColumns: GridColDef<(typeof formattedMovies)[number]>[] = [
    ...mobileColumns,
    {
      field: 'filmCompany',
      headerName: 'Film Company',
      width: 200,
      editable: false,
    }
  ];

  return (
    <Box sx={{margin: '10%'}}>
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 style={{fontSize: '1.2rem'}}>Welcome to Movie database!</h1>
        <Button onClick={refreshData}>{isLoading ? <SlClock /> : <SlRefresh />}</Button> 
      </div> 
      
      <Box sx={{ 
        height: isMobile ? 300 : 400, 
        width: '100%', 
        overflowX: isMobile ? 'auto' : 'hidden' 
      }}>
        {
        (movies.length && movieCompanies.length) ?
          (<DataGrid
            rows={formattedMovies}
            columns={isMobile ? mobileColumns : desktopColumns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            onRowClick={(params) => {
              setSelectedMovie(params.row);
              setOpen(true);
            }}
          />) 
        : error && <p style={{ color: 'red' }}>{error}</p>
      }
    </Box>


    <div>
      {selectedMovie && (
        isMobile ? (
          open && <Modal movieId={selectedMovie.id} selectedMovie={selectedMovie} open={open} setOpen={setOpen} />
        ) : (
          <ReviewInput movieId={selectedMovie.id} selectedMovie={selectedMovie} />
        )
      )}
    </div>
  </div>
  </Box>
  );
}