'use server';

import { createProduct, getAllCategories } from '@/lib/db';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function listItem(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const photo = formData.get('photo') as string;
    const title = formData.get('title') as string;
    const priceStr = formData.get('price') as string;
    const price = parseFloat(priceStr);

    if (!photo || !title || isNaN(price)) {
      return { success: false, error: 'Missing required fields' };
    }

    let categories = await getAllCategories();
    let categoryId: number;

    if (categories.length > 0) {
      categoryId = categories[0].id;
    } else {
      const { rows } = await pool.query(
        `INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING id`,
        ['Handmade', 'handmade', 'Handmade items from our community']
      );
      categoryId = rows[0].id;
    }

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

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
