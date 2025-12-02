import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'
import MuiTab from '@mui/material/Tab'
import { Avatar, Box, Typography } from '@mui/material'
import IconThoe2 from '../../custom-icons/index'

const TabList = styled(MuiTabList)(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box'
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: '#00cfe838',
  },
  '& .MuiTab-root': {
    position: 'relative', // Pentru suprapunerea blurului și lacătului
    minWidth: 65,
    minHeight: 38,
    lineHeight: 1,
    borderRadius: 5,
    '&:hover': {
      color: `${theme.palette.common.white} !important`
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: 130
    },
    '&[data-disabled="true"]': {
      pointerEvents: 'none', // Dezactivare click
      opacity: 0.5,
      color: theme.palette.text.disabled,
    }
  }
}))

const Tab = styled(MuiTab)(({ theme, active, disabled }) => ({
  background: !disabled ? '#00cfe80d' : 'none',
  cursor: disabled ? 'not-allowed !important' : 'pointer',
  border: !disabled ? '1px solid #00cfe838' : 'none',
  transition: 'background-color 0.3s ease, color 0.3s ease',
  ...(disabled && {
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#080d1273',
      borderRadius: 5,
      backdropFilter: 'blur(15px)',
      zIndex: 1
    },
    '& .MuiTab-wrapper': {
      position: 'relative',
      zIndex: 2
    },
    '& .MuiTab-iconWrapper': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 3,
      color: theme.palette.error.main
    }
  }),
  ...(active && {
    background: 'red',
    color: theme.palette.primary.main,
    fontWeight: 'bold'
  })
}))

const TabWithLock = ({ icon, label, disabled, active, ...props }) => {
  return (
    <Tab
      {...props}
      label={
        <>
          {icon ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: active ? 'white' : 'text.disabled',
                transition: 'color 0.3s ease',
                cursor: disabled ? 'not-allowed' : 'pointer'
              }}
            >
              {icon}
            </Box>
          ) : (
            <Typography
              color={active ? 'white' : 'text.disabled'}
              sx={{
                transition: 'color 0.3s ease', // Tranziție pentru un efect plăcut
                '&:hover': {
                  color: !disabled ? 'white' : 'text.disabled', // Culoare albă la hover doar dacă nu e dezactivat
                },
              }}
            >
              {label}
            </Typography>
          )}
          {disabled && (
            <Box
              className="MuiTab-iconWrapper"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: disabled ? 0.5 : 1,
              }}
            >
              <IconThoe2 icon='common:lock' color='white' fontSize="small"/>
            </Box>
          )}
        </>
      }
      sx={{
        mx: 2
      }}
      disabled={disabled}
      data-disabled={disabled}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      active={active ? 1 : 0}
    />
  )
}

export { TabList, TabWithLock, Tab }
