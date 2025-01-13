import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, PlusCircle, User, LogOut } from 'lucide-react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('ログアウトしました');
    } catch (error) {
      console.error('ログアウトエラー:', error);
      alert('ログアウトに失敗しました');
    }
  };

  return (
    <nav className="bg-orange-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="text-xl font-bold whitespace-nowrap">たこ焼き食べよか</span>
              <span className="text-sm sm:ml-2 whitespace-nowrap">たこ焼き屋ポータルサイト</span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-orange-200 flex items-center">
              <Home size={20} />
              <span className="hidden sm:inline ml-1">ホーム</span>
            </Link>
            <Link to="/search" className="hover:text-orange-200 flex items-center">
              <Search size={20} />
              <span className="hidden sm:inline ml-1">店舗検索</span>
            </Link>
            <Link to="/create-shop" className="hover:text-orange-200 flex items-center">
              <PlusCircle size={20} />
              <span className="hidden sm:inline ml-1">店舗登録</span>
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="hover:text-orange-200 flex items-center"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline ml-1">ログアウト</span>
              </button>
            ) : (
              <Link to="/auth" className="hover:text-orange-200 flex items-center">
                <User size={20} />
                <span className="hidden sm:inline ml-1">ログイン</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
