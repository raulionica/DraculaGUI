import React from 'react'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import { IoIosAddCircle } from "react-icons/io";

const StyledIconButton = styled(IconButton)`
  color: #969eb6;
  border: none; /* Remove any border */
  &:hover {
    color:rgb(84, 179, 234);
    background: transparent; /* Ensure no background on hover */
  }
`

const AddButton = ({ onClick, sx }) => {
  const theme = useTheme()

  const defaultSx = {
    position: 'absolute',
    top: theme.spacing(0.5),
    right: theme.spacing(0.5)
  }

  return (
    <StyledIconButton size='small' sx={sx || defaultSx} onClick={onClick}>
      <IoIosAddCircle />
    </StyledIconButton>
  )
}

export default AddButton
