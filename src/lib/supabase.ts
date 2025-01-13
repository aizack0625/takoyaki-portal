import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qlqwdcafsjwmuaxavjef.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscXdkY2Fmc2p3bXVheGF2amVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMTA4OTgsImV4cCI6MjA1MTc4Njg5OH0.dBo1lZNCa-HDsY7apbGO29xCcWeJaGlCRej3VZvBDb0';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const testDatabaseConnection = async () => {
  try {
    // shops テーブルの存在確認
    const { data: shopsData, error: shopsError } = await supabase
      .from('shops')
      .select('count')
      .single();

    if (shopsError) {
      console.error('shops テーブルエラー:', shopsError);
      return false;
    }

    console.log('データベース接続成功');
    return true;
  } catch (error) {
    console.error('データベース接続エラー:', error);
    return false;
  }
};
