import React from 'react'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import { CleaningServices } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles'
import { Tooltip } from '@mui/material';

const StyledIconButton = styled(IconButton)`
  color: #969eb6;
  border: none; /* Remove any border */
  &:hover {
    color: #ea5455;
    background: transparent; /* Ensure no background on hover */
  }
`

const CleanButton = ({ title, onClick, sx }) => {
  const theme = useTheme()

  const defaultSx = {
    position: 'absolute',
    top: theme.spacing(0.5),
    left: theme.spacing(0.5)
  }

  return (
    <StyledIconButton size='small' sx={sx || defaultSx} onClick={onClick}>
      <Tooltip title={title || "Clean"}>
        <CleaningServices />
      </Tooltip>
    </StyledIconButton>
  )
}

export default CleanButton
