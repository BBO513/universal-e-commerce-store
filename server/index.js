const http = require('http');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');
let cachedProducts = [];
let dbLoaded = false;

// Load db.json once at startup
fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error loading db.json:', err);
        process.exit(1); // Exit if database cannot be loaded
    }
    const db = JSON.parse(data);
    cachedProducts = db.products;
    dbLoaded = true;
    console.log('db.json loaded and products cached.');
});

const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const { method, url } = req;

    if (method === 'GET' && url === '/api/products') {
        if (!dbLoaded) {
            res.writeHead(503, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Database not yet loaded' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cachedProducts));
    } else if (method === 'POST' && url === '/api/orders') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            fs.readFile(dbPath, 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Error reading database' }));
                    return;
                }
                const db = JSON.parse(data);
                const newOrder = JSON.parse(body);
                newOrder.id = db.orders.length + 1;
                db.orders.push(newOrder);

                fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Error writing to database' }));
                        return;
                    }
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(newOrder));
                });
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
