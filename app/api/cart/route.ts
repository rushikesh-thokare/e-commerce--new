import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Add item to cart
export async function POST(request: Request) {
  const { userId, productId, quantity, access_token } = await request.json();
  if (!access_token) {
    return NextResponse.json({ error: 'Missing access token' }, { status: 401 });
  }
  const supabaseWithAuth = supabase;
  supabaseWithAuth.auth.setSession({ access_token, refresh_token: '' });
  const { data, error } = await supabaseWithAuth
    .from('cart')
    .insert([{ user_id: userId, product_id: productId, quantity }]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ cartItem: data && data[0] ? data[0] : null }, { status: 200 });
}

// Get cart items for a user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const access_token = searchParams.get('access_token');
  if (!userId || !access_token) {
    return NextResponse.json({ error: 'Missing userId or access token' }, { status: 400 });
  }
  const supabaseWithAuth = supabase;
  supabaseWithAuth.auth.setSession({ access_token, refresh_token: '' });
  const { data, error } = await supabaseWithAuth
    .from('cart')
    .select('*')
    .eq('user_id', userId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ cart: data }, { status: 200 });
}

// Remove item from cart
export async function DELETE(request: Request) {
  const { userId, productId, access_token } = await request.json();
  if (!access_token) {
    return NextResponse.json({ error: 'Missing access token' }, { status: 401 });
  }
  const supabaseWithAuth = supabase;
  supabaseWithAuth.auth.setSession({ access_token, refresh_token: '' });
  const { error } = await supabaseWithAuth
    .from('cart')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true }, { status: 200 });
}
