import React from 'react';
import IconMappings from './icon-mapping';

const IconThoe2 = ({ icon, color, sx, ...props }) => {
  if (!icon) return null;

  // Extrage categoria și numele iconiței
  const [category, iconName] = icon.split(':');

  // Verifică dacă categoria există în IconMappings
  const CategoryIcons = IconMappings[category];
  if (!CategoryIcons) return null;

  const formattedIconName = `Icon${iconName
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')}`;

  // Verifică dacă iconița există în categoria specificată
  const IconComponent = CategoryIcons[formattedIconName];
  if (!IconComponent) return null;

  // Returnează componenta de iconiță, aplicând props și culoarea, dacă este specificată
  return (
    <IconComponent
      color={color || sx?.color || undefined}
      sx={{
        ...sx,
        transition: 'all 0.3s ease', // Tranziție lină
        '&:hover': {
          color: sx?.hoverColor || 'white',
          transform: sx?.hoverTransform || 'scale(1.2)',
        },
      }}
      {...props}
    />
  );
};

export default IconThoe2;
