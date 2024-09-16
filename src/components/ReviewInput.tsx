import { useState } from 'react';
import { Button, Box, TextField, Typography } from '@mui/material';

import { formattedMovieItem } from '../types/types';

type ReviewInputProps = {
  movieId: string;
  selectedMovie: formattedMovieItem;
};

const ReviewInput = ({ movieId, selectedMovie }: ReviewInputProps): JSX.Element => {
  const [review, setReview] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (): Promise<void> => {
    if (review.length > 100) {
      setError('Review must be 100 characters or less');
      return;
    };
    if (review.length === 0) {
      setError('Cannot submit an empty review');
      return;
    };

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
      
    } catch (error) {
      setError('Failed to submit review. Please try again.');
    }
  };

  return (
    <Box sx={{backgroundColor: 'white', p: 4}} data-testid="review-input">
      <Box sx={{marginBottom: '10px'}}>
        <Box>
          <Typography><strong>{"Movie: " + selectedMovie.title}</strong></Typography>
        </Box>
       {selectedMovie && <Typography>Please leave a review in the box</Typography> }
      </Box>
      <Box
        component="form"
        noValidate
        autoComplete="off"
      >
        <Box sx={{ width: '240px' }}>
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
            fullWidth
          />
        </Box>
        <Box>
          <Button variant="contained" onClick={handleSubmit} sx={{ marginTop: '10px', marginBottom: '10px' }}>Submit</Button>
          {!error && <Typography color="green">{successMessage}</Typography>} 
        </Box>
      </Box>
    </Box>
  );
};

export default ReviewInput;
