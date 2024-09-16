import { useState } from 'react';
import Modal from '@mui/material/Modal';
import ReviewInput from './ReviewInput';
import { movieItem } from './types';

// const style = {
//   position: 'absolute' as 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

export default function BasicModal({ movieId, selectedMovie }: { movieId: string, selectedMovie: movieItem }) {
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ReviewInput movieId={movieId} selectedMovie={selectedMovie} />
      </Modal>
  );
}
