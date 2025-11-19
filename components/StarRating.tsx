import React from 'react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

const StarRating = ({ rating, maxRating = 5 }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="text-yellow-400">&#9733;</span>
      ))}
      {halfStar && <span className="text-yellow-400">&#9733;</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-300">&#9733;</span>
      ))}
    </div>
  );
};

export default StarRating;
