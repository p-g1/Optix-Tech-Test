import { useState, useEffect} from 'react';
import { movieItem, movieCompanyItem } from './types';

export const App = () =>  {

  const [selectedMovie, setSelectedMovie] = useState(0); 
  const [movieCompanies, setMovieCompanies] = useState<movieCompanyItem[]>([]);
  const [movies, setMovies] = useState<movieItem[]>([]);
  const [movieCompaniesError, setMovieCompaniesError] = useState<string | null>(null);
  const [moviesError, setMoviesError] = useState<string | null>(null);

  useEffect(() => {
    getData("movieCompanies", "movie companies", setMovieCompanies, setMovieCompaniesError);
    getData("movies", "movies", setMovies, setMoviesError);
  }, []);

  const getData = async (endPoint: string, dataType: string, setterFunction: any, errorSetterFunction: any) => {
    try {
      const response = await fetch(`http://localhost:3000/${endPoint}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${dataType}`);
      }
      const data = await response.json();
      setterFunction(data);
      errorSetterFunction(null);
    } catch (error) {
      errorSetterFunction(`Failed to load ${dataType}. Please try again.`);
    }
  };

  const refreshButton = (buttonText: any) => {
    if (movieCompanies) {
      return <button>{buttonText}</button>
    } else {
      return <p>No movies loaded yet</p>
    }   
  };

  return (
    <div>
      <h2>Welcome to Movie database!</h2>
      {refreshButton("Refresh")}
      {movieCompaniesError && <p style={{ color: 'red' }}>{movieCompaniesError}</p>}
      {moviesError && <p style={{ color: 'red' }}>{moviesError}</p>}
      <p>Total movies displayed {movies.length}</p>
      <span>Title - Review - Film Company</span>
      <br/>
      {movies.map((movie: any) => 
        <span onClick={() => {setSelectedMovie(movie)}} key={movie.id}>
          {movie.title}{" "}
          {movie.reviews.reduce((acc: any, i: any) => (acc + i)/movie.reviews.length, 0)?.toString().substring(0, 3)}{" "}
          {movieCompanies.find((f: any) => f.id === movie.filmCompanyId)?.name}
          <br/>
        </span>
      )}
      <br/>
      <div>
       {selectedMovie ? selectedMovie.title as any ? "You have selected " +  selectedMovie.title  as any : "No Movie Title" : "No Movie Seelcted"}
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