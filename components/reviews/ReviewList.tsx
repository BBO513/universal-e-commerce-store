import React from 'react';
import StarRating from '@/components/StarRating';

interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  title: string;
  comment: string;
  is_approved: boolean;
  created_at: string;
  author_name: string;
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
                <p className="ml-2 text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
              </div>
              <h3 className="font-semibold">{review.title}</h3>
              <p className="text-gray-700 mt-1">{review.comment}</p>
              <p className="text-sm text-gray-500 mt-2">- {review.author_name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;