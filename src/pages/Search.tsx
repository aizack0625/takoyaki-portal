import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import ShopCard from '../components/ShopCard';
import { Search as SearchIcon } from 'lucide-react';

interface Shop {
  id: number;
  name: string;
  address: string;
  opening_hours: string;
  reviews?: { rating: number }[];
  averageRating?: number;
}

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [shops, setShops] = useState<Shop[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          reviews (
            rating
          )
        `)
        .or(`name.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`);

      if (error) throw error;

      if (data) {
        const shopsWithRating = data.map(shop => ({
          ...shop,
          averageRating: shop.reviews?.length
            ? shop.reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / shop.reviews.length
            : null
        }));
        setShops(shopsWithRating);
      }
    } catch (error) {
      console.error('検索エラー:', error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">店舗検索</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="店舗名や住所で検索..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
          >
            <SearchIcon size={20} />
            <span>検索</span>
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>

      {shops.length === 0 && searchTerm && !searching && (
        <p className="text-center text-gray-600">
          検索結果が見つかりませんでした。
        </p>
      )}
    </div>
  );
}
