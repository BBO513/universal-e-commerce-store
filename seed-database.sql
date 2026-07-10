-- Seed Database Script for E-Commerce Application
-- Run this after schema.sql to populate with test data

-- Insert test users (password is 'password123' hashed with bcrypt)
INSERT INTO users (email, password_hash, name, role, banned) VALUES
('admin@autoparts.com', '$2b$10$JA2WBZc.e3u8Xh145VXNU.j0AXGoKiXv4x7gLPoQ4NvKpYIMUU73K', 'Admin User', 'admin', false),
('customer@example.com', '$2b$10$JA2WBZc.e3u8Xh145VXNU.j0AXGoKiXv4x7gLPoQ4NvKpYIMUU73K', 'John Customer', 'customer', false),
('jane@example.com', '$2b$10$JA2WBZc.e3u8Xh145VXNU.j0AXGoKiXv4x7gLPoQ4NvKpYIMUU73K', 'Jane Smith', 'customer', false);

-- Insert categories
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Engine Parts', 'engine-parts', NULL, 'All engine related components'),
('Brakes', 'brakes', NULL, 'Brake systems and components'),
('Suspension', 'suspension', NULL, 'Suspension and steering parts'),
('Electrical', 'electrical', NULL, 'Electrical components and accessories'),
('Body Parts', 'body-parts', NULL, 'Exterior and interior body parts'),
('Filters', 'filters', NULL, 'Oil, air, and fuel filters');

-- Insert subcategories
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Oil Filters', 'oil-filters', 6, 'Engine oil filters'),
('Air Filters', 'air-filters', 6, 'Engine air filters'),
('Brake Pads', 'brake-pads', 2, 'Brake pad sets'),
('Brake Rotors', 'brake-rotors', 2, 'Brake disc rotors');



-- Insert products
INSERT INTO products (title, description, price, sku, condition, category_id, stock, images, brand) VALUES
-- Oil Filters
('Premium Oil Filter - Toyota/Lexus', 'High-quality oil filter suitable for Toyota and Lexus vehicles. Ensures optimal engine performance and longevity.', 24.99, 'OF-TOY-001', 'new', 7, 150, ARRAY['/images/products/oil-filter-1.jpg'], 'Ryco'),
('Economy Oil Filter - Honda', 'Reliable oil filter for Honda vehicles. Good value for money.', 18.99, 'OF-HON-001', 'new', 7, 200, ARRAY['/images/products/oil-filter-2.jpg'], 'Sakura'),

-- Air Filters
('Performance Air Filter - Universal', 'High-flow air filter for improved engine performance. Washable and reusable.', 89.99, 'AF-UNI-001', 'new', 8, 75, ARRAY['/images/products/air-filter-1.jpg'], 'K&N'),
('Standard Air Filter - Ford Ranger', 'OEM-quality air filter for Ford Ranger. Direct replacement.', 32.99, 'AF-FOR-001', 'new', 8, 120, ARRAY['/images/products/air-filter-2.jpg'], 'Ryco'),

-- Brake Pads
('Ceramic Brake Pads - Front - Toyota Camry', 'Premium ceramic brake pads for quiet, dust-free braking. Front axle set.', 129.99, 'BP-TOY-001', 'new', 9, 80, ARRAY['/images/products/brake-pads-1.jpg'], 'Bendix'),
('Semi-Metallic Brake Pads - Rear - Honda Civic', 'Durable semi-metallic brake pads. Rear axle set.', 89.99, 'BP-HON-001', 'new', 9, 95, ARRAY['/images/products/brake-pads-2.jpg'], 'Bendix'),

-- Brake Rotors
('Slotted Brake Rotors - Front Pair - Mazda CX-5', 'Performance slotted rotors for improved braking and heat dissipation.', 249.99, 'BR-MAZ-001', 'new', 10, 45, ARRAY['/images/products/brake-rotor-1.jpg'], 'DBA'),
('Standard Brake Rotors - Rear Pair - Ford Ranger', 'OEM-quality brake rotors. Rear axle pair.', 189.99, 'BR-FOR-001', 'new', 10, 60, ARRAY['/images/products/brake-rotor-2.jpg'], 'RDA'),

-- Engine Parts
('Spark Plug Set - 4 Pack - Toyota', 'Iridium spark plugs for extended life and performance.', 79.99, 'SP-TOY-001', 'new', 1, 100, ARRAY['/images/products/spark-plugs-1.jpg'], 'NGK'),
('Timing Belt Kit - Honda Civic', 'Complete timing belt kit including tensioner and water pump.', 299.99, 'TB-HON-001', 'new', 1, 35, ARRAY['/images/products/timing-belt-1.jpg'], 'Gates'),

-- Suspension
('Front Shock Absorbers - Pair - Ford Ranger', 'Heavy-duty shock absorbers for improved ride quality.', 349.99, 'SA-FOR-001', 'new', 3, 40, ARRAY['/images/products/shocks-1.jpg'], 'Monroe'),
('Rear Coil Springs - Pair - Holden Commodore', 'OEM-quality coil springs for rear suspension.', 189.99, 'CS-HOL-001', 'new', 3, 30, ARRAY['/images/products/springs-1.jpg'], 'King Springs'),

-- Electrical
('Battery - 12V 70Ah - Universal', 'Maintenance-free car battery with 3-year warranty.', 199.99, 'BAT-UNI-001', 'new', 4, 50, ARRAY['/images/products/battery-1.jpg'], 'Century'),
('Alternator - Toyota Camry', 'Remanufactured alternator with 2-year warranty.', 299.99, 'ALT-TOY-001', 'used', 4, 15, ARRAY['/images/products/alternator-1.jpg'], 'Bosch'),

-- Body Parts
('Side Mirror - Right - Honda Civic', 'Replacement side mirror with indicator. Right side.', 149.99, 'SM-HON-001', 'new', 5, 25, ARRAY['/images/products/mirror-1.jpg'], 'Genuine Honda'),
('Headlight Assembly - Left - Mazda CX-5', 'OEM-quality headlight assembly. Left side.', 399.99, 'HL-MAZ-001', 'new', 5, 18, ARRAY['/images/products/headlight-1.jpg'], 'TYC');



-- Insert sample addresses
INSERT INTO addresses (user_id, type, street, city, state, postcode, is_default) VALUES
(2, 'shipping', '123 Main Street', 'Sydney', 'NSW', '2000', true),
(2, 'billing', '123 Main Street', 'Sydney', 'NSW', '2000', false),
(3, 'shipping', '456 Queen Street', 'Melbourne', 'VIC', '3000', true);

-- Insert sample reviews
INSERT INTO reviews (user_id, product_id, rating, comment, approved) VALUES
(2, 1, 5, 'Great quality oil filter. Fits perfectly and good value for money.', true),
(3, 5, 4, 'Good brake pads, very quiet operation. Slight dust but acceptable.', true),
(2, 9, 5, 'Excellent spark plugs. Engine runs smoother and better fuel economy.', true),
(3, 13, 5, 'Battery works perfectly. Easy to install and great warranty.', true);

-- Insert sample orders
INSERT INTO orders (user_id, total, status, stripe_payment_id, created_at) VALUES
(2, 154.98, 'delivered', 'pi_test_123456789', NOW() - INTERVAL '7 days'),
(3, 219.98, 'shipped', 'pi_test_987654321', NOW() - INTERVAL '3 days'),
(2, 89.99, 'processing', 'pi_test_456789123', NOW() - INTERVAL '1 day');

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES
(1, 1, 2, 24.99),
(1, 5, 1, 129.99),
(2, 13, 1, 199.99),
(2, 4, 1, 32.99),
(3, 3, 1, 89.99);

-- Insert wishlist items
INSERT INTO wishlists (user_id, product_id) VALUES
(2, 7),
(2, 11),
(3, 10),
(3, 16);

-- Insert inventory history
INSERT INTO inventory_history (product_id, change_quantity, reason) VALUES
(1, 150, 'Initial stock'),
(2, 200, 'Initial stock'),
(3, 75, 'Initial stock'),
(5, -1, 'Sold in order #1'),
(1, -2, 'Sold in order #1'),
(13, -1, 'Sold in order #2');

-- Verify data
SELECT 'Users created:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Categories created:', COUNT(*) FROM categories
UNION ALL
SELECT 'Products created:', COUNT(*) FROM products
UNION ALL
SELECT 'Orders created:', COUNT(*) FROM orders
UNION ALL
SELECT 'Reviews created:', COUNT(*) FROM reviews;
