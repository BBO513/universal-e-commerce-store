import type { Metadata } from 'next';
import theme from '@/config/theme.json';

export const metadata: Metadata = {
  title: theme.metadata.title,
  description: theme.metadata.description,
  openGraph: {
    title: theme.metadata.title,
    description: theme.metadata.description,
    type: 'website',
    images: [
      {
        url: theme.heroImage,
        alt: theme.storeName,
      },
    ],
  },
};
