import { api } from './api';
import { getKV, setKV } from './db';

// Store details used on receipts, configured by the Admin in the Back Office
// (Settings page). Cached locally so receipts still print while offline.
const DEFAULTS = {
  companyName: 'Belcit Trading',
  address: '',
  phone: '',
  email: '',
  currency: 'USD',
};

let cache = null;

export async function getStoreSettings({ refresh = false } = {}) {
  if (cache && !refresh) return cache;
  try {
    const res = await api.get('/api/settings');
    const s = res?.data?.data || {};
    cache = { ...DEFAULTS, ...s };
    await setKV('storeSettings', JSON.stringify(cache));
  } catch {
    try {
      const saved = await getKV('storeSettings');
      cache = saved ? { ...DEFAULTS, ...JSON.parse(saved) } : { ...DEFAULTS };
    } catch {
      cache = { ...DEFAULTS };
    }
  }
  return cache;
}

export function currencySymbol(currency) {
  const c = String(currency || 'USD').toUpperCase();
  if (c === 'USD') return '$';
  if (c === 'ZWL' || c === 'ZIG') return c + ' ';
  return c + ' ';
}
