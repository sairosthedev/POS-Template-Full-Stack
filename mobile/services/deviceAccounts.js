import * as SecureStore from 'expo-secure-store';

const LIST_KEY = 'miccs.deviceAccounts';

export async function listDeviceAccounts() {
  const raw = await SecureStore.getItemAsync(LIST_KEY);
  const arr = raw ? JSON.parse(raw) : [];
  if (!Array.isArray(arr)) return [];
  // normalize + unique
  const seen = new Set();
  const out = [];
  for (const a of arr) {
    const email = String(a?.email || '').toLowerCase().trim();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    out.push({ email });
  }
  return out;
}

export async function saveDeviceAccount({ email }) {
  const e = String(email || '').toLowerCase().trim();
  if (!e) throw new Error('Invalid email');

  const list = await listDeviceAccounts();
  const next = [{ email: e }, ...list.filter((x) => x.email !== e)];
  await SecureStore.setItemAsync(LIST_KEY, JSON.stringify(next));
}

export async function deleteDeviceAccount(email) {
  const e = String(email || '').toLowerCase().trim();
  const list = await listDeviceAccounts();
  const next = list.filter((x) => x.email !== e);
  await SecureStore.setItemAsync(LIST_KEY, JSON.stringify(next));
}

