let demoSettings: any = {
  store_name: 'My Store',
  primary_color: '#0F4B5F',
  social_links: {},
};

let demoProducts: any[] = [];
let demoNextId = 1;

const demoCategories: any[] = [
  { id: 1, name: 'Handmade', slug: 'handmade', description: 'Handmade items from our community' },
];

export function getDemoSettings() {
  return { ...demoSettings, id: 1 };
}

export function updateDemoSettings(settings: any) {
  Object.assign(demoSettings, settings);
  return { ...demoSettings, id: 1 };
}

export function getDemoProducts() {
  return [...demoProducts];
}

export function addDemoProduct(product: any) {
  const newProduct = {
    ...product,
    id: demoNextId++,
    created_at: new Date().toISOString(),
  };
  demoProducts.unshift(newProduct);
  return newProduct;
}

export function getDemoCategories() {
  return [...demoCategories];
}

export function hydrateFromCookie(cookieJson: string | undefined) {
  if (!cookieJson) return;
  try {
    const data = JSON.parse(cookieJson);
    if (data.settings) {
      Object.assign(demoSettings, data.settings);
    }
    if (data.products && Array.isArray(data.products)) {
      demoProducts = data.products;
      demoNextId = demoProducts.reduce((max, p) => Math.max(max, p.id || 0), 0) + 1;
    }
  } catch {
    // ignore corrupt cookie
  }
}

export function getCookiePayload(): string {
  return JSON.stringify({
    settings: demoSettings,
    products: demoProducts,
  });
}

export function saveToLocalStorage() {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('demo_data');
    const existing = raw ? JSON.parse(raw) : { settings: {}, products: [] };
    localStorage.setItem('demo_data', JSON.stringify({
      settings: { ...existing.settings, ...demoSettings },
      products: demoProducts.length > 0 ? demoProducts : existing.products || [],
    }));
  } catch {
    // quota exceeded — silently ignore
  }
}

export function addToLocalStorage(product: any) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('demo_data');
    const data = raw ? JSON.parse(raw) : { settings: demoSettings, products: [] };
    const existingIds = new Set(data.products.map((p: any) => p.id));
    if (!existingIds.has(product.id)) {
      data.products.unshift(product);
      localStorage.setItem('demo_data', JSON.stringify(data));
      demoProducts = data.products;
      demoNextId = Math.max(demoNextId, product.id + 1);
    }
  } catch {
    // ignore
  }
}

export function loadFromLocalStorage() {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('demo_data');
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.settings) {
      Object.assign(demoSettings, data.settings);
    }
    if (data.products && Array.isArray(data.products)) {
      demoProducts = data.products;
      demoNextId = demoProducts.reduce((max: number, p: any) => Math.max(max, p.id || 0), 0) + 1;
    }
  } catch {
    // ignore corrupt data
  }
}
