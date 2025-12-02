import React from 'react'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import { IoCloseCircle } from 'react-icons/io5'

const StyledIconButton = styled(IconButton)`
  color: #969eb6;
  border: none; /* Remove any border */
  &:hover {
    color: #ea5455;
    background: transparent; /* Ensure no background on hover */
  }
`

const CloseButton = ({ onClick, sx }) => {
  const theme = useTheme()

  const defaultSx = {
    position: 'absolute',
    top: theme.spacing(0.5),
    right: theme.spacing(0.5)
  }

  return (
    <StyledIconButton size='small' sx={sx || defaultSx} onClick={onClick}>
      <IoCloseCircle  />
    </StyledIconButton>
  )
}

export default CloseButton
