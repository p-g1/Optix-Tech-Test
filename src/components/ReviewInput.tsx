import { useState } from 'react';
import { Button, Box, TextField, Typography } from '@mui/material';
import { movieItem } from '../types/types';

interface ReviewInputProps {
  movieId: string;
  selectedMovie: movieItem;
}

export default function ReviewInput({ movieId, selectedMovie }: ReviewInputProps) {
  const [review, setReview] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (review.length > 100) {
      setError('Review must be 100 characters or less');
      return;
    }
    if (review.length === 0) {
      setError('Cannot submit an empty review');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/submitReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId, review }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const data = await response.json();
      setSuccessMessage(data.message);

      setReview('');
      setError(null);
      
      // You might want to add some success feedback here
    } catch (error) {
      setError('Failed to submit review. Please try again.');
    }
  };

  return (
    <>
    {selectedMovie ? selectedMovie.title as any ? "You have selected " +  selectedMovie.title  as any : "No Movie Title" : "No Movie Selected"}
       {selectedMovie && <p>Please leave a review in the box below</p> }
    <Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          id="outlined-multiline-static"
          label="Review"
          multiline
          rows={4}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Please leave a review"
          error={!!error}
          helperText={error || `${review.length}/100 characters`}
        />
      </div>
      <Button variant="contained" onClick={handleSubmit}>Submit</Button>
      {!error && <Typography color="green">{successMessage}</Typography>} 
    </Box>
    </>
  );
}
