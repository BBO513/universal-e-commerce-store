import React from 'react';
import StarRating from '@/components/StarRating';

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center mb-2">
                <StarRating rating={review.rating} />
                <p className="ml-2 text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
              <h3 className="font-semibold">{review.title}</h3>
              <p className="text-gray-700 mt-1">{review.content}</p>
              <p className="text-sm text-gray-500 mt-2">- {review.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;