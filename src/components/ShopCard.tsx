import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

export async function getStaticProps() {
  const { data: shops } = await supabase
    .from('shops')
    .select(`
      id, name,
      reviews(
        rating
      )
    `);

  const shopsWithRating = shops?.map((shop: any) => {
    const totalRating = shop.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    const averageRating = shop.reviews.length
      ? totalRating / shop.reviews.length
      : null;

    return { ...shop, averageRating };
  });

  return {
    props: {
      shops: shopsWithRating,
    },
  };
}

interface ShopCardProps {
  shop: {
    id: number;
    name: string;
    address: string;
    opening_hours: string;
    average_rating?: number;
    averageRating?: number;
  };
}

export default function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link to={`/shop/${shop.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
        <h3 className="text-xl font-bold text-gray-900">{shop.name}</h3>
        <div className="mt-2 flex items-center">
          <Star className="text-yellow-400" size={20} />
          <span className="ml-1 text-gray-700">
            {shop.averageRating?.toFixed(1) || '未評価'}
          </span>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-gray-600">
            <span className="font-semibold">住所:</span> {shop.address}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">営業時間:</span> {shop.opening_hours}
          </p>
        </div>
      </div>
    </Link>
  );
}
