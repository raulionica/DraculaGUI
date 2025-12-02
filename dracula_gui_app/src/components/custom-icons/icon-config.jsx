import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

// Main SVG Config
export const Icon = ({ color, path, viewBox, transform = 'None', sx, ...props }) => (
    <SvgIcon
        {...props}
        sx={{
            ...sx, // Aplica toate stilurile din sx
            transition: 'all 0.3s ease', // Adaugă tranziții implicite
            '&:hover': {
                color: sx?.hoverColor || color || '#fff', // Aplica culoare la hover
                transform: sx?.hoverTransform || 'scale(1.2)', // Aplica transformare la hover
                ...sx?.['&:hover'], // Orice alt stil specificat pentru hover
            },
        }}
    >
        <svg viewBox={viewBox}>
            <g transform={transform}>
                <path wstroke="#083003" strokeWidth="8" strokeOpacity="1" fill={sx?.color || color || '#d0d0d0'} d={path} />
            </g>
        </svg>
    </SvgIcon>
);

export const IconMultiPath = ({ paths, viewBox, color, colors = [], transform, transforms = [], sx, ...props }) => (
    <SvgIcon {...props} sx={{ ...sx }}>
        <svg viewBox={viewBox}>
            {paths.map((path, index) => (
                <path
                    key={index}
                    d={path}
                    fill={sx?.color || (colors.length > 0 ? colors[index] : color) || '#c42121'}
                    transform={transforms.length > 0 ? transforms[index] || '' : transform || ''}
                />
            ))}
        </svg>
    </SvgIcon>
);
