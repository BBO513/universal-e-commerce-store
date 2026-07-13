'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

interface FadeAspectImageProps extends Omit<ImageProps, 'width' | 'height' | 'fill'> {
  aspect?: 'aspect-square' | 'aspect-video' | string;
  wrapperClassName?: string;
}

export default function FadeAspectImage({
  aspect = 'aspect-square',
  wrapperClassName = '',
  className = '',
  onLoadingComplete,
  ...props
}: FadeAspectImageProps) {
  const [loaded, setLoaded] = useState(false);

  const handleLoadingComplete = (img: HTMLImageElement) => {
    setLoaded(true);
    onLoadingComplete?.(img);
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-slate-100 ${aspect} ${wrapperClassName}`}>
      <Image
        {...props}
        fill
        className={`object-cover transition duration-700 ease-out ${loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-105'} ${className}`}
        onLoadingComplete={handleLoadingComplete}
      />
    </div>
  );
}
