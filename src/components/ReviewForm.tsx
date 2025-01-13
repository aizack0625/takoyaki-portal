import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface ReviewFormProps {
  shopId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ shopId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from('reviews').insert({
      shop_id: shopId,
      rating,
      comment,
    });

    setIsSubmitting(false);

    if (!error) {
      setRating(0);
      setComment('');
      onReviewSubmitted();
    }
  };

  if (!user) {
    return <p className="text-center text-gray-600">レビューを投稿するにはログインが必要です。</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">レビューを投稿</h3>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">評価</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="focus:outline-none"
            >
              <Star
                className={`w-6 h-6 ${
                  value <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block text-gray-700 mb-2">
          コメント
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
          rows={4}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || rating === 0 || !comment}
        className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50"
      >
        {isSubmitting ? '送信中...' : 'レビューを投稿'}
      </button>
    </form>
  );
}
