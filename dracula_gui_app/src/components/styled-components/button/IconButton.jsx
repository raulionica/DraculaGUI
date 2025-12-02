import { styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';

// Definire StyledIconButton
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  // position: 'absolute',
  backgroundColor: '#485a745e',
  border: `1px solid white`,
  width: 24,
  height: 24,
  minWidth: '24px',
  padding: 0,
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.3s ease, border-color 0.2s ease, color 0.2s ease',
  '&:hover': {
    borderColor: 'rgba(62, 192, 69, 0.14)',
    color: 'white',
  },
}));

export default StyledIconButton
