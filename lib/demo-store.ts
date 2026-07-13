export const UNIVERSAL_STORE_STORAGE_KEY = 'universal_store_data';

export interface StoreSettings {
  storeName: string;
  themeColor: string;
  socials: Record<string, string>;
  stripe: boolean;
}

export interface UniversalStoreData {
  settings: StoreSettings;
  products: any[];
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: '',
  themeColor: '#0F4B5F',
  socials: {},
  stripe: false,
};

const DEFAULT_DATA: UniversalStoreData = {
  settings: DEFAULT_SETTINGS,
  products: [],
};

function normalizeSettings(settings: any = {}): StoreSettings {
  return {
    storeName: settings.storeName ?? settings.store_name ?? '',
    themeColor: settings.themeColor ?? settings.primary_color ?? '#0F4B5F',
    socials: settings.socials ?? settings.social_links ?? {},
    stripe: Boolean(settings.stripe ?? settings.stripeConnected ?? false),
  };
}

function normalizeData(data: any = {}): UniversalStoreData {
  const settings = normalizeSettings(data.settings);
  const products = Array.isArray(data.products) ? data.products : [];
  return {
    settings,
    products,
  };
}

export function readUniversalStoreData(): UniversalStoreData {
  if (typeof window === 'undefined') {
    return DEFAULT_DATA;
  }

  try {
    const raw = window.localStorage.getItem(UNIVERSAL_STORE_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_DATA;
    }

    return normalizeData(JSON.parse(raw));
  } catch {
    return DEFAULT_DATA;
  }
}

export async function writeUniversalStoreData(data: Partial<UniversalStoreData> = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  const current = readUniversalStoreData();
  const nextData = normalizeData({
    settings: data.settings ?? current.settings,
    products: data.products ?? current.products,
  });

  try {
    window.localStorage.setItem(UNIVERSAL_STORE_STORAGE_KEY, JSON.stringify(nextData));
  } catch {
    // ignore quota issues
  }

  await Promise.resolve();
}

export function getDemoSettings() {
  return { ...readUniversalStoreData().settings, id: 1 };
}

export function updateDemoSettings(settings: any) {
  const current = readUniversalStoreData();
  const updatedSettings = normalizeSettings({ ...current.settings, ...settings });
  writeUniversalStoreData({ settings: updatedSettings, products: current.products });
  return { ...updatedSettings, id: 1 };
}

export function getDemoProducts() {
  return [...readUniversalStoreData().products];
}

export function addDemoProduct(product: any) {
  const current = readUniversalStoreData();
  const nextProduct = {
    ...product,
    id: Date.now(),
    created_at: new Date().toISOString(),
  };
  const nextProducts = [nextProduct, ...current.products];
  writeUniversalStoreData({ settings: current.settings, products: nextProducts });
  return nextProduct;
}

export function getDemoCategories() {
  return [{ id: 1, name: 'Handmade', slug: 'handmade', description: 'Handmade items from our community' }];
}

export function hydrateFromCookie(_cookieJson: string | undefined) {
  return;
}

export function getCookiePayload(): string {
  return JSON.stringify(readUniversalStoreData());
}

export function saveToLocalStorage() {
  const current = readUniversalStoreData();
  writeUniversalStoreData(current);
}

export function addToLocalStorage(product: any) {
  const current = readUniversalStoreData();
  const existingIds = new Set(current.products.map((p: any) => p.id));
  if (existingIds.has(product.id)) {
    return;
  }

  const nextProducts = [product, ...current.products];
  writeUniversalStoreData({ settings: current.settings, products: nextProducts });
}

export function loadFromLocalStorage() {
  return readUniversalStoreData();
}
