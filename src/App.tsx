import { useState, useEffect } from 'react';
import { movieItem, movieCompanyItem } from './types';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

export const App = () =>  {
	const [movies, setMovies] = useState<movieItem[]>([]);
	const [movieCompanies, setMovieCompanies] = useState<movieCompanyItem[]>([]);
	const [formattedMovies, setFormattedMovies] = useState<movieItem[]>([]);
	const [selectedMovie, setSelectedMovie] = useState<movieItem | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

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

  const formatData = () => {
    const formattedData = movies.map((movie) => ({
      ...movie,
      filmCompany: movieCompanies.find((company) => company.id === movie.filmCompanyId)?.name,
      averageReview: Number((movie.reviews.reduce((acc, i) => acc + i, 0) / movie.reviews.length).toFixed(1))
    }));
    setFormattedMovies(formattedData);
  };

  const refreshButton = (buttonText: any) => {
    if (movieCompanies) {
      return <button>{buttonText}</button>
    } else {
      return <p>No movies loaded yet</p>
    }   
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
      <DataGrid
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
        disableRowSelectionOnClick
      />
    </Box>
    
      {refreshButton("Refresh")}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div>
       {selectedMovie ? selectedMovie.title as any ? "You have selected " +  selectedMovie.title  as any : "No Movie Title" : "No Movie Selected"}
       {selectedMovie && <p>Please leave a review below</p> }
       {selectedMovie && 
        <form onSubmit={() => {}}>
          <label>
          Review:
          <input type="text"/>
        </label>
        </form>}
      </div>
    </div>
  );
}