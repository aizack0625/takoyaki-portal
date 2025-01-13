import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Star, MapPin, Clock } from 'lucide-react';
import ReviewForm from '../components/ReviewForm';

interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    name: string;
  };
}

export default function ShopDetail() {
  const { id } = useParams();
  const [shop, setShop] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShopData = async () => {
    try {
      const { data: shopData } = await supabase
        .from('shops')
        .select('*')
        .eq('id', id)
        .single();

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('shop_id', id)
        .order('created_at', { ascending: false });

      if (shopData) {
        setShop(shopData);
      }
      if (reviewsData) {
        setReviews(reviewsData);
      }
      setLoading(false);
    } catch (error) {
      console.error('データ取得エラー:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopData();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  if (!shop) {
    return <div className="text-center py-8">店舗が見つかりませんでした。</div>;
  }

  const averageRating = reviews.length
    ? reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / reviews.length
    : null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{shop.name}</h1>

        {averageRating && (
          <div className="flex items-center mb-4">
            <Star className="text-yellow-400" size={24} />
            <span className="ml-2 text-xl font-semibold">
              {averageRating.toFixed(1)}
            </span>
            <span className="ml-2 text-gray-600">
              ({reviews.length}件のレビュー)
            </span>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-start">
            <MapPin className="text-gray-400 mt-1" size={20} />
            <div className="ml-2">
              <h3 className="font-semibold text-gray-700">住所</h3>
              <p className="text-gray-600">{shop.address}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="text-gray-400 mt-1" size={20} />
            <div className="ml-2">
              <h3 className="font-semibold text-gray-700">営業時間</h3>
              <p className="text-gray-600">{shop.opening_hours}</p>
            </div>
          </div>

          {shop.description && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 mb-2">店舗説明</h3>
              <p className="text-gray-600">{shop.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">レビュー</h2>
          <div className="space-y-6">
            {reviews.map((review: any) => (
              <div key={review.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}

            {reviews.length === 0 && (
              <p className="text-gray-600">まだレビューがありません。</p>
            )}
          </div>
        </div>

        <div>
          <ReviewForm shopId={id!} onReviewSubmitted={fetchShopData} />
        </div>
      </div>
    </div>
  );
}
