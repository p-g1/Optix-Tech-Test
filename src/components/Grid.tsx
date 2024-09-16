import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { formattedMovieItem } from '../types/types';

type GridProps = {
    formattedMovies: formattedMovieItem[];
    isMobile: boolean;
    setSelectedMovie: (movie: formattedMovieItem) => void;
    setOpen: (open: boolean) => void;
};

const Grid = ({formattedMovies, isMobile, setSelectedMovie, setOpen}: GridProps) =>  {

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

    return(
        <DataGrid
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
        />
    )
};

export default Grid;