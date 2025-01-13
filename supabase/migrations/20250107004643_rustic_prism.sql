/*
  # たこ焼き屋ポータルサイトの初期スキーマ

  1. 新規テーブル
    - `shops` (店舗情報)
      - `id` (uuid, プライマリーキー)
      - `name` (店舗名)
      - `address` (住所)
      - `opening_hours` (営業時間)
      - `description` (店舗説明)
      - `created_at` (作成日時)
      - `updated_at` (更新日時)

    - `reviews` (口コミ)
      - `id` (uuid, プライマリーキー)
      - `shop_id` (店舗ID、外部キー)
      - `user_id` (ユーザーID、外部キー)
      - `rating` (星評価 1-5)
      - `comment` (コメント)
      - `created_at` (作成日時)
      - `updated_at` (更新日時)

  2. セキュリティ
    - 全テーブルでRLSを有効化
    - 認証済みユーザーのみレビュー投稿可能
    - 店舗情報は誰でも閲覧可能
*/

-- 店舗テーブル
CREATE TABLE shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  opening_hours text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- レビューテーブル
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLSの有効化
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 店舗情報の閲覧ポリシー（全ユーザー）
CREATE POLICY "Anyone can view shops"
  ON shops
  FOR SELECT
  TO public
  USING (true);

-- レビューの閲覧ポリシー（全ユーザー）
CREATE POLICY "Anyone can view reviews"
  ON reviews
  FOR SELECT
  TO public
  USING (true);

-- レビューの作成ポリシー（認証済みユーザーのみ）
CREATE POLICY "Authenticated users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- レビューの更新・削除ポリシー（自分のレビューのみ）
CREATE POLICY "Users can update own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);