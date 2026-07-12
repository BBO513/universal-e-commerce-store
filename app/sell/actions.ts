'use server';

import { createProduct, getAllCategories, isDemoMode } from '@/lib/db';
import { getCookiePayload } from '@/lib/demo-store';
import { cookies } from 'next/headers';

export async function listItem(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const photo = formData.get('photo') as string;
    const title = formData.get('title') as string;
    const priceStr = formData.get('price') as string;
    const price = parseFloat(priceStr);

    if (!photo || !title || isNaN(price)) {
      return { success: false, error: 'Missing required fields' };
    }

    const categories = await getAllCategories();
    const categoryId = categories.length > 0 ? categories[0].id : 1;

    const sku = 'SKU-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    await createProduct(
      title,
      '',
      price,
      sku,
      'new',
      categoryId,
      1,
      [photo],
      undefined,
      [],
      {}
    );

    console.log('DEMO MODE: Saving product to cookie:', { title, price, sku });

    if (isDemoMode()) {
      const cookieStore = cookies();
      cookieStore.set('demo_data', getCookiePayload(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
