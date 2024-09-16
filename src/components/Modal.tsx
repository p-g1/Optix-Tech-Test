import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import ReviewInput from './ReviewInput';
import { movieItem } from '../types/types';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
};

type ModalProps = {
  movieId: string;
  selectedMovie: movieItem;
  open: boolean;
  setOpen: (open: boolean) => void;
  setSelectedMovie: (movie: movieItem | null) => void;
};

const BasicModal = (
  { movieId, 
    selectedMovie, 
    open, 
    setOpen, 
    setSelectedMovie 
  }: ModalProps): JSX.Element => {

  const handleClose = (): void => {
    setOpen(false);
    setSelectedMovie(null);
  };

  return (
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <ReviewInput movieId={movieId} selectedMovie={selectedMovie} />
      </Box>
    </Modal>
  );
};

export default BasicModal;
