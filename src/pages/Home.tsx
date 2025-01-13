import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ShopCard from '../components/ShopCard';

interface Shop {
  id: number;
  name: string;
  address: string;
  created_at: string;
  opening_hours: string;
  rating: number;
  averageRating?: number;
}

export default function Home() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const { data: shopsData, error: shopsError } = await supabase
          .from('shops')
          .select(`
            *,
            reviews (
              rating
            )
          `)
          .order('created_at', { ascending: false });

        if (shopsError) throw shopsError;

        const shopsWithRating = shopsData.map((shop: any) => {
          const totalRating = shop.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
          const averageRating = shop.reviews.length ? totalRating / shop.reviews.length : undefined;
          return { ...shop, averageRating };
        });

        setShops(shopsWithRating || []);
      } catch (error) {
        console.error('データ取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  return (
    <div className="relative min-h-screen bg-amber-50 py-8 px-4">
      <div className="absolute inset-0 bg-repeat opacity-20 market-pattern z-10"/>

      <div className="absolute top-0 left-0 w-full h-32 noren-pattern" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 bg-orange-100 rounded-full transform rotate-45 opacity-90"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            <div className="absolute inset-2 bg-orange-200 rounded-full">
              <div className="absolute inset-3 bg-orange-300 rounded-full opacity-10" />
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-brown-900 mb-8 text-center relative">
          <span className="relative inline-block">
            おすすめのたこ焼き屋
            <span className="absolute -top-6 -right-8 text-2xl">🐙</span>
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop: any) => (
            <div key={shop.id} className="transform hover:scale-105 transition-transform duration-300">
              <ShopCard shop={shop} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
