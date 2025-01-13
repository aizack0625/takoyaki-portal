import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('登録が完了しました');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert('ログインしました');
      }
    } catch (error) {
      console.error('認証エラー:', error);
      alert('認証に失敗しました');
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert('Googleアカウントでログインしました');
    } catch (error) {
      console.error('Googleログインエラー:', error);
      alert('Googleログインに失敗しました');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">{isRegistering ? '新規登録' : 'ログイン'}</h1>
      <form onSubmit={handleAuth} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">パスワード</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700"
        >
          {isRegistering ? '登録' : 'ログイン'}
        </button>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-orange-600 hover:underline"
          >
            {isRegistering ? '既にアカウントをお持ちですか？ログイン' : '新規登録はこちら'}
          </button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Googleでログイン
        </button>
      </div>
    </div>
  );
}
