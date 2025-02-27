'use client';

import { getImageUrl } from '@/utils/imageUrls';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';

interface AppCardProps {
  name: string;
  description: string;
  iconUrl?: string | null;
  faIcon?: string;
  onClick?: () => void;
  className?: string;
}

const getFontAwesomeIcon = (iconName: string): IconDefinition => {
  // Remove 'fa-' prefix if present
  const cleanName = iconName.startsWith('fa-') ? iconName.slice(3) : iconName;
  
  // Convert to camelCase format that FontAwesome expects
  const formattedName = 'fa' + cleanName.split('-').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('');
  
  console.log('FontAwesome icon name conversion:', { 
    input: iconName, 
    cleaned: cleanName, 
    output: formattedName,
    exists: formattedName in Icons
  });

  // Fallback to cube if icon doesn't exist
  if (!(formattedName in Icons)) {
    console.warn(`Icon ${formattedName} not found, falling back to cube`);
    return Icons.faCube;
  }

  return Icons[formattedName as keyof typeof Icons] as IconDefinition;
};

export default function AppCard({ 
  name, 
  description,
  iconUrl,
  faIcon = 'fa-cube',
  onClick,
  className = ''
}: AppCardProps) {
  console.log('AppCard props:', { name, iconUrl, faIcon });

  const [imageError, setImageError] = useState(false);
  const imageUrl = iconUrl ? getImageUrl(iconUrl) : null;

  useEffect(() => {
    console.log('AppCard mounted/updated:', { 
      iconUrl, 
      processedImageUrl: imageUrl, 
      imageError,
      showingIcon: !imageUrl || imageError 
    });
  }, [iconUrl, imageUrl, imageError]);

  const handleImageError = () => {
    console.log('Image failed to load:', { imageUrl, iconUrl });
    setImageError(true);
  };

  const showIcon = !imageUrl || imageError;

  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer hover:scale-105' : ''} ${className}`}
    >
      <div className={`w-20 h-20 rounded-2xl mb-4 flex items-center justify-center ${showIcon ? 'bg-indigo-100' : ''}`}>
        {!showIcon && imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-contain rounded-2xl"
            onError={handleImageError}
          />
        ) : (
          <FontAwesomeIcon
            icon={getFontAwesomeIcon(faIcon)}
            className="h-8 w-8 text-indigo-600"
          />
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-900 text-center">{name}</h3>
      <p className="mt-1 text-xs text-gray-500 text-center line-clamp-2">{description}</p>
    </div>
  );
} 