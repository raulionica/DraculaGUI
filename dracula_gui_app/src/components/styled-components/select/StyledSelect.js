import { Select } from '@mui/material';
import { styled } from '@mui/material/styles';


const StyledSelect = styled(Select)({
    textAlign: 'center',
    '& .MuiOutlinedInput-input': {
        padding: '10px 14px',
    },
});

export default StyledSelect;