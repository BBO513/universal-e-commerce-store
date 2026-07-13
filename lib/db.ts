import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import {
  getDemoSettings,
  updateDemoSettings,
  getDemoProducts,
  addDemoProduct,
  getDemoCategories,
} from './demo-store';

let pool: Pool | null = null;
let demoMode = true;

function getPool(): Pool | null {
  return null;
}

export function isDemoMode() {
  return demoMode;
}

async function safeQuery(text: string, params?: any[]): Promise<any> {
  return { rows: [], rowCount: 0 };
}

export async function getUserByEmail(email: string) {
  const { rows } = await safeQuery(
    `SELECT id, email, name, role, password_hash FROM users WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}

export async function getAllCategories() {
  if (demoMode) return getDemoCategories();
  const { rows } = await safeQuery('SELECT * FROM categories ORDER BY name ASC');
  return rows;
}

export async function getCategoryBySlug(slug: string) {
  const { rows } = await safeQuery('SELECT * FROM categories WHERE slug = $1', [slug]);
  return rows[0];
}

export async function getCategoryById(id: number) {
  const { rows } = await safeQuery('SELECT * FROM categories WHERE id = $1', [id]);
  return rows[0];
}

export async function getChildCategories(parentId: number) {
  const { rows } = await safeQuery('SELECT * FROM categories WHERE parent_id = $1 ORDER BY name ASC', [parentId]);
  return rows;
}

export async function getProducts() {
  if (demoMode) return getDemoProducts();
  const { rows } = await safeQuery('SELECT * FROM products ORDER BY created_at DESC');
  return rows;
}

export async function getProductsByCategory(categorySlug: string) {
  const { rows } = await safeQuery(
    `SELECT p.* FROM products p
     JOIN categories c ON p.category_id = c.id
     WHERE c.slug = $1
     ORDER BY p.created_at DESC`,
    [categorySlug]
  );
  return rows;
}

export async function getProductById(id: string) {
  if (demoMode) return getDemoProducts().find((p: any) => String(p.id) === id) || null;
  const { rows } = await safeQuery('SELECT * FROM products WHERE id = $1', [parseInt(id, 10)]);
  return rows[0];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  sku: string;
  condition: 'new' | 'used';
  category_id?: number;
  stock: number;
  images: string[];
  created_at: string;
  brand?: string;
  variants?: any;
  attributes?: any;
}

interface ProductFilter {
  category_id?: number;
  minPrice?: number;
  maxPrice?: number;
  condition?: 'new' | 'used';
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'price_low_high' | 'price_high_low';
  searchQuery?: string;
  brand?: string;

  minStock?: number;
  maxStock?: number;
}

export async function filterProducts(filters: ProductFilter) {
  let query = 'SELECT * FROM products WHERE 1=1';
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.category_id) {
    query += ` AND category_id = $${paramIndex}`;
    params.push(filters.category_id);
    paramIndex++;
  }
  if (filters.minPrice) {
    query += ` AND price >= $${paramIndex}`;
    params.push(filters.minPrice);
    paramIndex++;
  }
  if (filters.maxPrice) {
    query += ` AND price <= $${paramIndex}`;
    params.push(filters.maxPrice);
    paramIndex++;
  }
  if (filters.condition) {
    query += ` AND condition = $${paramIndex}`;
    params.push(filters.condition);
    paramIndex++;
  }
  if (filters.searchQuery) {
    query += ` AND (LOWER(title) LIKE $${paramIndex} OR LOWER(description) LIKE $${paramIndex})`;
    params.push(`%${filters.searchQuery.toLowerCase()}%`);
    paramIndex++;
  }
  if (filters.brand) {
    query += ` AND LOWER(brand) LIKE $${paramIndex}`;
    params.push(`%${filters.brand.toLowerCase()}%`);
    paramIndex++;
  }
  if (filters.minStock) {
    query += ` AND stock >= $${paramIndex}`;
    params.push(filters.minStock);
    paramIndex++;
  }
  if (filters.maxStock) {
    query += ` AND stock <= $${paramIndex}`;
    params.push(filters.maxStock);
    paramIndex++;
  }

  // Handle sorting
  switch (filters.sortBy) {
    case 'price_low_high':
      query += ' ORDER BY price ASC';
      break;
    case 'price_high_low':
      query += ' ORDER BY price DESC';
      break;
    case 'newest':
    default:
      query += ' ORDER BY created_at DESC';
      break;
  }

  const limit = filters.limit || 20;
  const offset = ((filters.page || 1) - 1) * limit;
  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const { rows } = await safeQuery(query, params);
  return rows;
}

export async function getTotalProductCount(filters: ProductFilter) {
  let query = 'SELECT COUNT(*) FROM products WHERE 1=1';
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.category_id) {
    query += ` AND category_id = $${paramIndex}`;
    params.push(filters.category_id);
    paramIndex++;
  }
  if (filters.minPrice) {
    query += ` AND price >= $${paramIndex}`;
    params.push(filters.minPrice);
    paramIndex++;
  }
  if (filters.maxPrice) {
    query += ` AND price <= $${paramIndex}`;
    params.push(filters.maxPrice);
    paramIndex++;
  }
  if (filters.condition) {
    query += ` AND condition = $${paramIndex}`;
    params.push(filters.condition);
    paramIndex++;
  }
  if (filters.searchQuery) {
    query += ` AND (LOWER(title) LIKE $${paramIndex} OR LOWER(description) LIKE $${paramIndex})`;
    params.push(`%${filters.searchQuery.toLowerCase()}%`);
    paramIndex++;
  }
  if (filters.brand) {
    query += ` AND LOWER(brand) LIKE $${paramIndex}`;
    params.push(`%${filters.brand.toLowerCase()}%`);
    paramIndex++;
  }
  if (filters.minStock) {
    query += ` AND stock >= $${paramIndex}`;
    params.push(filters.minStock);
    paramIndex++;
  }
  if (filters.maxStock) {
    query += ` AND stock <= $${paramIndex}`;
    params.push(filters.maxStock);
    paramIndex++;
  }

  const { rows } = await safeQuery(query, params);
  return parseInt(rows[0]?.count || 0, 10);
}


// Cart methods
export async function getCartItems(userId: number) {
  const { rows } = await safeQuery(
    `SELECT ci.id as cart_item_id, ci.quantity, p.*
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = $1
     ORDER BY ci.id ASC`,
    [userId]
  );
  return rows;
}

export async function addToCart(userId: number, productId: number, quantity: number) {
  const { rows } = await safeQuery(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart_items.quantity + $3
     RETURNING *`,
    [userId, productId, quantity]
  );
  return rows[0];
}

export async function updateCartQuantity(cartItemId: number, quantity: number) {
  const { rows } = await safeQuery(
    `UPDATE cart_items
     SET quantity = $1
     WHERE id = $2
     RETURNING *`,
    [quantity, cartItemId]
  );
  return rows[0];
}

export async function removeCartItem(cartItemId: number) {
  const { rowCount } = await safeQuery(
    `DELETE FROM cart_items
     WHERE id = $1`,
    [cartItemId]
  );
  return rowCount > 0;
}

export async function clearCart(userId: number) {
  const { rowCount } = await safeQuery(
    `DELETE FROM cart_items
     WHERE user_id = $1`,
    [userId]
  );
  return rowCount > 0;
}

// Address methods
export async function getAddresses(userId: number) {
  const { rows } = await safeQuery(
    `SELECT * FROM addresses
     WHERE user_id = $1
     ORDER BY is_default DESC, id ASC`,
    [userId]
  );
  return rows;
}

export async function addAddress(
  userId: number,
  type: string,
  street: string,
  city: string,
  state: string,
  postcode: string,
  isDefault: boolean
) {
  if (isDefault) {
    await safeQuery(`UPDATE addresses SET is_default = FALSE WHERE user_id = $1`, [userId]);
  }
  const { rows } = await safeQuery(
    `INSERT INTO addresses (user_id, type, street, city, state, postcode, is_default)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, type, street, city, state, postcode, isDefault]
  );
  return rows[0];
}

export async function updateAddress(
  addressId: number,
  userId: number,
  type: string,
  street: string,
  city: string,
  state: string,
  postcode: string,
  isDefault: boolean
) {
  if (isDefault) {
    await safeQuery(`UPDATE addresses SET is_default = FALSE WHERE user_id = $1`, [userId]);
  }
  const { rows } = await safeQuery(
    `UPDATE addresses
     SET type = $1, street = $2, city = $3, state = $4, postcode = $5, is_default = $6
     WHERE id = $7 AND user_id = $8
     RETURNING *`,
    [type, street, city, state, postcode, isDefault, addressId, userId]
  );
  return rows[0];
}

export async function deleteAddress(addressId: number, userId: number) {
  const { rowCount } = await safeQuery(
    `DELETE FROM addresses
     WHERE id = $1 AND user_id = $2`,
    [addressId, userId]
  );
  return rowCount > 0;
}

export async function setDefaultAddress(userId: number, addressId: number) {
  await safeQuery(`UPDATE addresses SET is_default = FALSE WHERE user_id = $1`, [userId]);
  const { rows } = await safeQuery(
    `UPDATE addresses
     SET is_default = TRUE
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [addressId, userId]
  );
  return rows[0];
}

// Order methods
export async function createOrder(
  userId: number,
  total: number,
  status: string,
  stripePaymentId: string | null
) {
  const { rows } = await safeQuery(
    `INSERT INTO orders (user_id, total, status, stripe_payment_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, total, status, stripePaymentId]
  );
  return rows[0];
}

interface OrderItemData {
  productId: number;
  quantity: number;
  priceAtPurchase: number;
}

export async function addOrderItems(orderId: number, items: OrderItemData[]) {
  if (demoMode) return [];
  const p = getPool();
  if (!p) throw new Error('Database unavailable in demo mode');
  const client = await p.connect();
  try {
    await client.query('BEGIN');
    const values = items.map(item => `(${orderId}, ${item.productId}, ${item.quantity}, ${item.priceAtPurchase})`).join(',');
    const query = `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ${values} RETURNING *`;
    const { rows } = await client.query(query);
    await client.query('COMMIT');
    return rows;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function updateOrderStatus(orderId: number, status: string) {
  const { rows } = await safeQuery(
    `UPDATE orders
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, orderId]
  );
  return rows[0];
}

export async function getOrderById(orderId: number) {
  const { rows: orderRows } = await safeQuery(
    `SELECT
        o.id,
        o.user_id,
        o.total,
        o.status,
        o.stripe_payment_id,
        o.created_at,
        u.name as customer_name,
        u.email as customer_email,
        a.street,
        a.city,
        a.state,
        a.postcode
     FROM orders o
     JOIN users u ON o.user_id = u.id
     LEFT JOIN addresses a ON o.user_id = a.user_id AND a.is_default = TRUE -- Assuming default address is shipping
     WHERE o.id = $1`,
    [orderId]
  );
  const order = orderRows[0];

  if (!order) {
    return null;
  }

  const { rows: itemRows } = await safeQuery(
    `SELECT oi.*, p.title, p.images, p.condition
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1`,
    [orderId]
  );

  return {
    ...order,
    items: itemRows,
    shipping_address: {
      street: order.street,
      city: order.city,
      state: order.state,
      postcode: order.postcode,
    },
  };
}

export async function getUserRole(userId: number) {
  const { rows } = await safeQuery(
    `SELECT role FROM users WHERE id = $1`,
    [userId]
  );
  return rows[0]?.role || null;
}

export async function getDashboardMetrics() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalRevenueResult,
    totalOrdersResult,
    totalCustomersResult,
    lowStockCountResult,
  ] = await Promise.all([
    safeQuery(`SELECT COALESCE(SUM(total), 0) FROM orders WHERE created_at >= $1 AND status = 'paid'`, [thirtyDaysAgo]),
    safeQuery(`SELECT COUNT(*) FROM orders WHERE created_at >= $1 AND status = 'paid'`, [thirtyDaysAgo]),
    safeQuery(`SELECT COUNT(DISTINCT user_id) FROM orders WHERE created_at >= $1 AND status = 'paid'`, [thirtyDaysAgo]),
    safeQuery(`SELECT COUNT(*) FROM products WHERE stock < 10 AND stock > 0`),
  ]);

  return {
    totalRevenue: parseFloat(totalRevenueResult.rows[0]?.coalesce || 0),
    totalOrders: parseInt(totalOrdersResult.rows[0]?.count || 0, 10),
    totalCustomers: parseInt(totalCustomersResult.rows[0]?.count || 0, 10),
    lowStockCount: parseInt(lowStockCountResult.rows[0]?.count || 0, 10),
  };
}

export async function getRevenueByDay() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { rows } = await safeQuery(
    `SELECT DATE(created_at) as date, COALESCE(SUM(total), 0) as revenue
     FROM orders
     WHERE created_at >= $1 AND status = 'paid'
     GROUP BY DATE(created_at)
     ORDER BY date ASC`,
    [thirtyDaysAgo]
  );
  return rows;
}

export async function getOrdersByDay() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { rows } = await safeQuery(
    `SELECT DATE(created_at) as date, COUNT(*) as orders_count
     FROM orders
     WHERE created_at >= $1 AND status = 'paid'
     GROUP BY DATE(created_at)
     ORDER BY date ASC`,
    [thirtyDaysAgo]
  );
  return rows;
}

export async function deleteProduct(productId: number) {
  const { rowCount } = await safeQuery(
    `DELETE FROM products
     WHERE id = $1`,
    [productId]
  );
  return rowCount > 0;
}

export async function createProduct(
  title: string,
  description: string,
  price: number,
  sku: string,
  condition: 'new' | 'used',
  categoryId: number,
  stock: number,
  images: string[],
  brand?: string,
  variants?: any,
  attributes?: any
) {
  if (demoMode) {
    return addDemoProduct({ title, description, price, sku, condition, category_id: categoryId, stock, images, brand: brand || null, category_name: 'Handmade' });
  }
  const { rows } = await safeQuery(
    `INSERT INTO products (title, description, price, sku, condition, category_id, stock, images, brand, variants, attributes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [title, description, price, sku, condition, categoryId, stock, images, brand, JSON.stringify(variants || []), JSON.stringify(attributes || {})]
  );
  return rows[0];
}

export async function updateProduct(
  productId: number,
  title: string,
  description: string,
  price: number,
  sku: string,
  condition: 'new' | 'used',
  categoryId: number,
  stock: number,
  images: string[],
  brand?: string,
  variants?: any,
  attributes?: any
) {
  const { rows } = await safeQuery(
    `UPDATE products
     SET title = $1, description = $2, price = $3, sku = $4, condition = $5, category_id = $6, stock = $7, images = $8, brand = $9, variants = $10, attributes = $11
     WHERE id = $12
     RETURNING *`,
    [title, description, price, sku, condition, categoryId, stock, images, brand, JSON.stringify(variants || []), JSON.stringify(attributes || {}), productId]
  );
  return rows[0];
}

export async function deleteManyProducts(productIds: number[]) {
  const { rowCount } = await safeQuery(
    `DELETE FROM products
     WHERE id = ANY($1::int[])`,
    [productIds]
  );
  return rowCount;
}

export async function updateStockManyProducts(productIds: number[], stockChange: number) {
  const { rowCount } = await safeQuery(
    `UPDATE products
     SET stock = stock + $1
     WHERE id = ANY($2::int[])
     RETURNING *`,
    [stockChange, productIds]
  );
  return rowCount;
}

export async function updateConditionManyProducts(productIds: number[], condition: 'new' | 'used') {
  const { rowCount } = await safeQuery(
    `UPDATE products
     SET condition = $1
     WHERE id = ANY($2::int[])
     RETURNING *`,
    [condition, productIds]
  );
  return rowCount;
}

export async function getProductsWithInventory() {
  const { rows } = await safeQuery(
    `SELECT id, sku, title, stock FROM products ORDER BY title ASC`
  );
  return rows;
}

export async function updateProductStock(productId: number, change: number, reason: string) {
  if (demoMode) return 0;
  const p = getPool();
  if (!p) throw new Error('Database unavailable in demo mode');
  const client = await p.connect();
  try {
    await client.query('BEGIN');

    const { rows: productRows } = await client.query(
      `UPDATE products
       SET stock = stock + $1
       WHERE id = $2
       RETURNING stock`,
      [change, productId]
    );

    if (productRows.length === 0) {
      throw new Error('Product not found.');
    }

    await client.query(
      `INSERT INTO inventory_history (product_id, change_quantity, reason)
       VALUES ($1, $2, $3)`,
      [productId, change, reason]
    );

    await client.query('COMMIT');
    return productRows[0].stock; // Return new stock level
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function getInventoryHistory(productId: number) {
  const { rows } = await safeQuery(
    `SELECT ih.*, p.title as product_title, p.sku
     FROM inventory_history ih
     JOIN products p ON ih.product_id = p.id
     WHERE ih.product_id = $1
     ORDER BY ih.created_at DESC`,
    [productId]
  );
  return rows;
}

export async function getAllUsersWithOrderCount() {
  const { rows } = await safeQuery(
    `SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.banned,
        u.created_at,
        COUNT(o.id) AS order_count
     FROM users u
     LEFT JOIN orders o ON u.id = o.user_id
     GROUP BY u.id
     ORDER BY u.created_at DESC`
  );
  return rows;
}

export async function updateUserRole(userId: number, newRole: 'customer' | 'admin') {
  const { rows } = await safeQuery(
    `UPDATE users
     SET role = $1
     WHERE id = $2
     RETURNING *`,
    [newRole, userId]
  );
  return rows[0];
}

export async function updateUserBanStatus(userId: number, isBanned: boolean) {
  const { rows } = await safeQuery(
    `UPDATE users
     SET banned = $1
     WHERE id = $2
     RETURNING *`,
    [isBanned, userId]
  );
  return rows[0];
}

interface OrderFilter {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'total_asc' | 'total_desc';
}

export async function getOrders() {
  const { rows } = await safeQuery(
    `SELECT o.id, o.total, o.status, o.created_at, o.stripe_payment_id, u.name as customer_name, u.email as customer_email
     FROM orders o
     JOIN users u ON o.user_id = u.id
     ORDER BY o.created_at DESC`
  );
  return rows;
}

export async function filterOrders(filters: OrderFilter) {
  let query = `
    SELECT o.id, o.total, o.status, o.created_at, o.stripe_payment_id, u.name as customer_name, u.email as customer_email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.status) {
    query += ` AND o.status = $${paramIndex}`;
    params.push(filters.status);
    paramIndex++;
  }
  if (filters.startDate) {
    query += ` AND o.created_at >= $${paramIndex}`;
    params.push(filters.startDate);
    paramIndex++;
  }
  if (filters.endDate) {
    query += ` AND o.created_at <= $${paramIndex}`;
    params.push(filters.endDate);
    paramIndex++;
  }

  switch (filters.sortBy) {
    case 'total_asc':
      query += ' ORDER BY o.total ASC';
      break;
    case 'total_desc':
      query += ' ORDER BY o.total DESC';
      break;
    case 'newest':
    default:
      query += ' ORDER BY o.created_at DESC';
      break;
  }

  const limit = filters.limit || 10;
  const offset = ((filters.page || 1) - 1) * limit;
  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const { rows } = await safeQuery(query, params);
  return rows;
}

export async function getTotalOrderCount(filters: OrderFilter) {
  let query = `
    SELECT COUNT(*)
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.status) {
    query += ` AND o.status = $${paramIndex}`;
    params.push(filters.status);
    paramIndex++;
  }
  if (filters.startDate) {
    query += ` AND o.created_at >= $${paramIndex}`;
    params.push(filters.startDate);
    paramIndex++;
  }
  if (filters.endDate) {
    query += ` AND o.created_at <= $${paramIndex}`;
    params.push(filters.endDate);
    paramIndex++;
  }

  const { rows } = await safeQuery(query, params);
  return parseInt(rows[0]?.count || 0, 10);
}

export async function getUserProfile(userId: number) {
  const [userResult, addressesResult, ordersResult] = await Promise.all([
    safeQuery(`SELECT id, name, email FROM users WHERE id = $1`, [userId]),
    safeQuery(`SELECT id, type, street, city, state, postcode, is_default FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, id DESC`, [userId]),
    safeQuery(`SELECT id, total, status, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5`, [userId]),
  ]);

  const user = userResult.rows[0];
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    addresses: addressesResult.rows,
    recentOrders: ordersResult.rows,
  };
}

export async function getUserOrders(userId: number) {
  const { rows } = await safeQuery(
    `SELECT id, total, status, created_at
     FROM orders
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

export async function getUserOrderDetail(userId: number, orderId: number) {
  const { rows: orderRows } = await safeQuery(
    `SELECT
        o.id,
        o.user_id,
        o.total,
        o.status,
        o.stripe_payment_id,
        o.created_at,
        u.name as customer_name,
        u.email as customer_email,
        a.street,
        a.city,
        a.state,
        a.postcode
     FROM orders o
     JOIN users u ON o.user_id = u.id
     LEFT JOIN addresses a ON o.user_id = a.user_id AND a.is_default = TRUE -- Assuming default address is shipping
     WHERE o.id = $1 AND o.user_id = $2`,
    [orderId, userId]
  );
  const order = orderRows[0];

  if (!order) {
    return null;
  }

  const { rows: itemRows } = await safeQuery(
    `SELECT oi.*, p.title, p.images, p.condition
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1`,
    [orderId]
  );

  return {
    ...order,
    items: itemRows,
    shipping_address: {
      street: order.street,
      city: order.city,
      state: order.state,
      postcode: order.postcode,
    },
  };
}

export async function updateUserNameEmail(userId: number, name: string, email: string) {
  const { rows } = await safeQuery(
    `UPDATE users
     SET name = $1, email = $2
     WHERE id = $3
     RETURNING id, name, email`,
    [name, email, userId]
  );
  return rows[0];
}

export async function getUserPasswordHash(userId: number) {
  const { rows } = await safeQuery(
    `SELECT password_hash FROM users WHERE id = $1`,
    [userId]
  );
  return rows[0]?.password_hash || null;
}

export async function updateUserPassword(userId: number, passwordHash: string) {
  const { rows } = await safeQuery(
    `UPDATE users
     SET password_hash = $1
     WHERE id = $2
     RETURNING id` ,
    [passwordHash, userId]
  );
  return rows[0];
}

export async function updateDefaultAddress(userId: number, addressId: number) {
  if (demoMode) return null;
  const p = getPool();
  if (!p) throw new Error('Database unavailable in demo mode');
  const client = await p.connect();
  try {
    await client.query('BEGIN');
    // Set all addresses for the user to not default
    await client.query(`UPDATE addresses SET is_default = FALSE WHERE user_id = $1`, [userId]);
    // Set the specified address to default
    const { rows } = await client.query(
      `UPDATE addresses
       SET is_default = TRUE
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [addressId, userId]
    );
    await client.query('COMMIT');
    return rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  title: string;
  comment: string;
  is_approved: boolean;
  created_at: string;
  author_name: string; // Joined from users table
}

export interface ReviewInput {
  productId: number;
  userId: number;
  rating: number;
  title: string;
  comment: string;
}

export async function getApprovedReviewsByProductId(productId: string): Promise<Review[]> {
  const { rows } = await safeQuery(
    `SELECT
        r.id,
        r.product_id,
        r.user_id,
        r.rating,
        r.title,
        r.comment,
        r.is_approved,
        r.created_at,
        u.name as author_name
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.product_id = $1 AND r.is_approved = TRUE
     ORDER BY r.created_at DESC`,
    [parseInt(productId, 10)]
  );
  return rows;
}

export async function getAverageRatingAndCountByProductId(productId: string) {
  const { rows } = await safeQuery(
    `SELECT
        COALESCE(AVG(rating), 0)::numeric(10,2) as average_rating,
        COUNT(id) as review_count
     FROM reviews
     WHERE product_id = $1 AND is_approved = TRUE`,
    [parseInt(productId, 10)]
  );
  return {
    averageRating: parseFloat(rows[0]?.average_rating || 0),
    reviewCount: parseInt(rows[0]?.review_count || 0, 10),
  };
}

export async function submitReview({ productId, userId, rating, title, comment }: ReviewInput) {
  const { rows } = await safeQuery(
    `INSERT INTO reviews (product_id, user_id, rating, title, comment, is_approved)
     VALUES ($1, $2, $3, $4, $5, FALSE)
     RETURNING *`,
    [productId, userId, rating, title, comment]
  );
  return rows[0];
}

export async function hasUserPurchasedProduct(userId: number, productId: string): Promise<boolean> {
  const { rows } = await safeQuery(
    `SELECT EXISTS (
        SELECT 1
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = $1
          AND oi.product_id = $2
          AND o.status = 'paid' -- Only consider paid orders
    ) AS has_purchased`,
    [userId, parseInt(productId, 10)]
  );
  return rows[0]?.has_purchased || false;
}

export async function updateReviewStatus(reviewId: number, isApproved: boolean) {
  const { rows } = await safeQuery(
    `UPDATE reviews
     SET is_approved = $1
     WHERE id = $2
     RETURNING *`,
    [isApproved, reviewId]
  );
  return rows[0];
}

interface ReviewFilter {
  productId?: string;
  userId?: string;
  isApproved?: boolean;
  page?: number;
  limit?: number;
}

export async function getAllReviews(filters: ReviewFilter) {
  let query = `
    SELECT
        r.id,
        r.product_id,
        r.user_id,
        r.rating,
        r.title,
        r.comment,
        r.is_approved,
        r.created_at,
        u.name as author_name,
        p.title as product_title
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     JOIN products p ON r.product_id = p.id
     WHERE 1=1
  `;
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.productId) {
    query += ` AND r.product_id = $${paramIndex}`;
    params.push(parseInt(filters.productId, 10));
    paramIndex++;
  }
  if (filters.userId) {
    query += ` AND r.user_id = $${paramIndex}`;
    params.push(parseInt(filters.userId, 10));
    paramIndex++;
  }
  if (typeof filters.isApproved === 'boolean') {
    query += ` AND r.is_approved = $${paramIndex}`;
    params.push(filters.isApproved);
    paramIndex++;
  }

  query += ` ORDER BY r.created_at DESC`;

  const limit = filters.limit || 10;
  const offset = ((filters.page || 1) - 1) * limit;
  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const { rows } = await safeQuery(query, params);
  return rows;
}

export async function getTotalReviewCount(filters: ReviewFilter) {
  let query = `
    SELECT COUNT(*)
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     JOIN products p ON r.product_id = p.id
     WHERE 1=1
  `;
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.productId) {
    query += ` AND r.product_id = $${paramIndex}`;
    params.push(parseInt(filters.productId, 10));
    paramIndex++;
  }
  if (filters.userId) {
    query += ` AND r.user_id = $${paramIndex}`;
    params.push(parseInt(filters.userId, 10));
    paramIndex++;
  }
  if (typeof filters.isApproved === 'boolean') {
    query += ` AND r.is_approved = $${paramIndex}`;
    params.push(filters.isApproved);
    paramIndex++;
  }

  const { rows } = await safeQuery(query, params);
  return parseInt(rows[0]?.count || 0, 10);
}

// Wishlist methods
export async function getWishlist(userId: number) {
  const { rows } = await safeQuery(
    `SELECT w.id as wishlist_id, p.*
     FROM wishlists w
     JOIN products p ON w.product_id = p.id
     WHERE w.user_id = $1
     ORDER BY w.created_at DESC`,
    [userId]
  );
  return rows;
}

export async function addToWishlist(userId: number, productId: number) {
  const { rows } = await safeQuery(
    `INSERT INTO wishlists (user_id, product_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, product_id) DO NOTHING
     RETURNING *`,
    [userId, productId]
  );
  return rows[0];
}

export async function removeFromWishlist(userId: number, productId: number) {
  const { rowCount } = await safeQuery(
    `DELETE FROM wishlists
     WHERE user_id = $1 AND product_id = $2`,
    [userId, productId]
  );
  return rowCount > 0;
}

export async function isProductInWishlist(userId: number, productId: number): Promise<boolean> {
  const { rows } = await safeQuery(
    `SELECT EXISTS (
        SELECT 1
        FROM wishlists
        WHERE user_id = $1 AND product_id = $2
    ) AS in_wishlist`,
    [userId, productId]
  );
  return rows[0]?.in_wishlist || false;
}

export async function getAllUniqueBrands(): Promise<string[]> {
  const { rows } = await safeQuery(
    `SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL AND brand != '' ORDER BY brand ASC`
  );
  return rows.map((row: any) => row.brand);
}

export interface StoreSettings {
  id: number;
  store_name: string;
  logo_url: string | null;
  primary_color: string;
  currency: string;
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export async function getStoreSettings(): Promise<StoreSettings> {
  if (demoMode) return getDemoSettings();
  const { rows } = await safeQuery(
    `SELECT * FROM store_settings LIMIT 1`
  );
  return rows[0] || null;
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  if (demoMode) {
    return updateDemoSettings({
      store_name: settings.store_name,
      primary_color: settings.primary_color,
      social_links: settings.social_links,
    });
  }
  const params: any[] = [];
  const columns: string[] = [];

  if (settings.store_name !== undefined) { columns.push('store_name'); params.push(settings.store_name); }
  if (settings.logo_url !== undefined) { columns.push('logo_url'); params.push(settings.logo_url); }
  if (settings.primary_color !== undefined) { columns.push('primary_color'); params.push(settings.primary_color); }
  if (settings.currency !== undefined) { columns.push('currency'); params.push(settings.currency); }
  if (settings.social_links !== undefined) { columns.push('social_links'); params.push(JSON.stringify(settings.social_links)); }

  const valuePlaceholders = columns.map((_, i) => `$${i + 1}`);
  const updateSet = columns.map((col, i) => `${col} = EXCLUDED.${col}`);

  const { rows } = await safeQuery(
    `INSERT INTO store_settings AS s (id, ${columns.join(', ')})
     VALUES (1, ${valuePlaceholders.join(', ')})
     ON CONFLICT (id) DO UPDATE SET ${updateSet.join(', ')}, updated_at = NOW()
     RETURNING *`,
    params
  );
  return rows[0];
}
