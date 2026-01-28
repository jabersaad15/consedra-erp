import * as SecureStore from 'expo-secure-store';

const BASE = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:4000';

async function getHeaders(): Promise<Record<string, string>> {
  const token = await SecureStore.getItemAsync('accessToken');
  const tenant = await SecureStore.getItemAsync('tenantSlug');
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = 'Bearer ' + token;
  if (tenant) h['X-Tenant-Slug'] = tenant;
  return h;
}

export async function api<T = any>(endpoint: string, opts?: RequestInit): Promise<T> {
  const headers = await getHeaders();
  const res = await fetch(BASE + endpoint, { ...opts, headers: { ...headers, ...opts?.headers } });
  if (res.status === 401) {
    const ok = await refreshToken();
    if (ok) return api(endpoint, opts);
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function refreshToken(): Promise<boolean> {
  const rt = await SecureStore.getItemAsync('refreshToken');
  if (!rt) return false;
  try {
    const res = await fetch(BASE + '/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    await SecureStore.setItemAsync('accessToken', data.accessToken);
    await SecureStore.setItemAsync('refreshToken', data.refreshToken);
    return true;
  } catch { return false; }
}
