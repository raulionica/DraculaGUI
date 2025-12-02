import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';

const StyledSlider = styled(Slider)(({ theme }) => ({
    color: '#00bcd494',
    '& .MuiSlider-thumb': {
        backgroundColor: '#00cfe8',
    },
}));

export default StyledSlider;
