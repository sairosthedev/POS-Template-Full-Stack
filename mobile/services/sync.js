import { api } from './api';
import { deleteSyncQueueItem, getSyncQueue } from './db';

export async function runSyncOnce() {
  const queue = await getSyncQueue({ limit: 25 });
  if (!queue?.length) return { processed: 0 };

  let processed = 0;
  for (const item of queue) {
    const payload = JSON.parse(item.payload || '{}');

    if (item.type === 'sale:create') {
      // expected backend endpoint per ARCHITECTURE.md: POST /api/sales
      await api.post('/api/sales', payload);
      await deleteSyncQueueItem(item._id);
      processed += 1;
      continue;
    }

    // Unknown type: keep it (or you can drop it if desired)
  }

  return { processed };
}

