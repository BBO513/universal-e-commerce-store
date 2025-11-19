const { Pool } = require('pg');
const { faker } = require('@faker-js/faker'); // Assuming faker is installed

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const NUM_PRODUCTS = 10000;
const NUM_VEHICLES = 500;

async function generateMockData() {
  console.log('Starting mock data generation...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Clear existing products and vehicles to avoid conflicts
    console.log('Clearing existing product and vehicle data...');
    // Clear tables in correct order due to foreign key constraints
    await client.query('DELETE FROM order_items;');
    await client.query('DELETE FROM cart_items;');
    await client.query('DELETE FROM reviews;');
    await client.query('DELETE FROM wishlists;');
    await client.query('DELETE FROM product_vehicle_map;');
    await client.query('DELETE FROM products;');
    await client.query('DELETE FROM vehicles;');
    await client.query('DELETE FROM orders;'); // Delete orders before users
    await client.query('DELETE FROM addresses;'); // Delete addresses before users
    await client.query('DELETE FROM users WHERE email NOT IN (\'admin@autoparts.com\', \'customer@example.com\', \'jane@example.com\');'); // Keep seed users
    await client.query('DELETE FROM categories WHERE id > 6;'); // Keep base categories

    // --- Generate Vehicles ---
    console.log(`Generating ${NUM_VEHICLES} mock vehicles...`);
    const vehicleMakes = ['Toyota', 'Honda', 'Ford', 'Mazda', 'Nissan', 'Hyundai', 'Kia', 'Subaru', 'Mitsubishi', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen'];
    const vehicleModels = ['Camry', 'Civic', 'Ranger', 'CX-5', 'Navara', 'i30', 'Cerato', 'Forester', 'Triton', 'X5', 'C-Class', 'A4', 'Golf'];
    const generatedVehicles = [];

    for (let i = 0; i < NUM_VEHICLES; i++) {
      const make = faker.helpers.arrayElement(vehicleMakes);
      const model = faker.helpers.arrayElement(vehicleModels);
      const yearStart = faker.number.int({ min: 2000, max: 2020 });
      const yearEnd = faker.number.int({ min: yearStart, max: 2023 });

      const { rows } = await client.query(
        `INSERT INTO vehicles (make, model, year_start, year_end) VALUES ($1, $2, $3, $4) RETURNING id`,
        [make, model, yearStart, yearEnd]
      );
      generatedVehicles.push({ id: rows[0].id, make, model, yearStart, yearEnd });
    }
    console.log('Mock vehicles generated.');

    // --- Get existing categories ---
    const { rows: categories } = await client.query('SELECT id, slug FROM categories');
    const categoryMap = new Map(categories.map(c => [c.slug, c.id]));

    // --- Generate Products ---
    console.log(`Generating ${NUM_PRODUCTS} mock products...`);
    const productBrands = ['Ryco', 'Bendix', 'K&N', 'Sakura', 'DBA', 'Bosch', 'NGK', 'Gates', 'Monroe', 'Century', 'Genuine Parts', 'Aftermarket'];
    const productConditions = ['new', 'used'];
    const productImages = [
      '/images/products/oil-filter-1.jpg',
      '/images/products/air-filter-1.jpg',
      '/images/products/brake-pads-1.jpg',
      '/images/products/spark-plugs-1.jpg',
      '/images/products/shocks-1.jpg',
      '/images/products/battery-1.jpg',
      '/images/products/mirror-1.jpg', // Added more local placeholders
      '/images/products/headlight-1.jpg',
      '/images/products/brake-rotor-1.jpg',
      '/images/products/timing-belt-1.jpg',
    ];

    for (let i = 0; i < NUM_PRODUCTS; i++) {
      const title = faker.commerce.productName();
      const description = faker.commerce.productDescription();
      const price = parseFloat(faker.commerce.price({ min: 10, max: 500, dec: 2 }));
      const sku = faker.string.alphanumeric(10).toUpperCase();
      const condition = faker.helpers.arrayElement(productConditions);
      const categoryId = faker.helpers.arrayElement(Array.from(categoryMap.values()));
      const stock = faker.number.int({ min: 0, max: 200 });
      const images = faker.helpers.arrayElements(productImages, { min: 1, max: 3 });
      const brand = faker.helpers.arrayElement(productBrands);

      const { rows: productRows } = await client.query(
        `INSERT INTO products (title, description, price, sku, condition, category_id, stock, images, brand)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [title, description, price, sku, condition, categoryId, stock, images, brand]
      );
      const productId = productRows[0].id;

      // Map product to a few random vehicles
      const vehiclesToMap = faker.helpers.arrayElements(generatedVehicles, { min: 1, max: 5 });
      for (const vehicle of vehiclesToMap) {
        await client.query(
          `INSERT INTO product_vehicle_map (product_id, vehicle_id) VALUES ($1, $2)`,
          [productId, vehicle.id]
        );
      }
    }
    console.log('Mock products generated and mapped to vehicles.');

    await client.query('COMMIT');
    console.log('Mock data generation complete!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error generating mock data:', error);
  } finally {
    client.release();
  }
}

// Check if this script is run directly
if (require.main === module) {
  // Load environment variables from .env.local
  require('dotenv').config({ path: './.env.local' });
  generateMockData().catch(console.error);
}
