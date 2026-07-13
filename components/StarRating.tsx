import React from 'react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  editable?: boolean;
  onRatingChange?: (rating: number) => void;
}

const StarRating = ({
  rating,
  maxRating = 5,
  editable = false,
  onRatingChange,
}: StarRatingProps) => {
  const stars = Array.from({ length: maxRating }, (_, index) => index + 1);

  return (
    <div className="flex items-center gap-1" role="img" aria-label={`Rated ${rating} out of ${maxRating} stars`}>
      {stars.map((value) => {
        const isActive = value <= Math.round(rating);
        const starClassName = isActive ? 'text-yellow-400' : 'text-gray-300';

        if (!editable) {
          return (
            <span key={value} className={starClassName}>
              &#9733;
            </span>
          );
        }

        return (
          <button
            key={value}
            type="button"
            className={`${starClassName} text-xl leading-none transition-transform hover:scale-110`}
            onClick={() => onRatingChange?.(value)}
            aria-label={`Rate ${value} out of ${maxRating}`}
          >
            &#9733;
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
