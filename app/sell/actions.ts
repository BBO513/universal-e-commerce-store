'use server';

import { createProduct, getAllCategories } from '@/lib/db';

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

    const product = await createProduct(
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

    return { success: true, product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
