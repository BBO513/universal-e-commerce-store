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
  const lightweightProducts = demoProducts.map((p) => ({
    ...p,
    images: [],
  }));
  return JSON.stringify({
    settings: demoSettings,
    products: lightweightProducts,
  });
}
