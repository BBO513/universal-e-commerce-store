import React, { useState } from 'react';
import StarRating from '@/components/StarRating';

interface ReviewFormProps {
  productId: string;
  onSubmit: (rating: number, title: string, comment: string) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please provide a star rating.');
      return;
    }
    if (!title.trim()) {
      setError('Please provide a title for your review.');
      return;
    }
    if (!comment.trim()) {
      setError('Please provide a comment for your review.');
      return;
    }
    setError('');
    onSubmit(rating, title, comment);
    // Clear form after submission
    setRating(0);
    setTitle('');
    setComment('');
  };

  return (
    <div className="mt-8 p-6 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
            Your Rating:
          </label>
          <StarRating rating={rating} onRatingChange={setRating} editable />
          {error && rating === 0 && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Review Title:
          </label>
          <input
            type="text"
            id="title"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {error && !title.trim() && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            Your Comment:
          </label>
          <textarea
            id="comment"
            rows={5}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
          {error && !comment.trim() && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;