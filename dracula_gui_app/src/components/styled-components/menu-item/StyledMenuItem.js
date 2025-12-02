import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';


const StyledMenuItem = styled(MenuItem)(({ theme, selected }) => ({
    backgroundColor: selected ? 'red !important' : 'transparent !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&.Mui-selected': {
        backgroundColor: '#1b485d !important',
        color: "#00cfe8 !important"
    },
    '&:hover': {
        backgroundColor: '#1b485d !important',
        color: "#00cfe8 !important"
    }
}));

export default StyledMenuItem;