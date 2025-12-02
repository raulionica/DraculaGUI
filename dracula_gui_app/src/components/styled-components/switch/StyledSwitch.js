import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

const StyledSwitch = styled(Switch)(({ theme }) => ({
    '& .Mui-checked + .MuiSwitch-track': {
        backgroundColor: '#00bcd494 !Important',
    },
}));

export default StyledSwitch;
