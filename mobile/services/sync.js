import { api } from './api';
import { deleteSyncQueueItem, getSyncQueue, markSyncQueueItemFailed } from './db';

export async function runSyncOnce() {
  const queue = await getSyncQueue({ limit: 25 });
  if (!queue?.length) return { processed: 0, failed: 0 };

  let processed = 0;
  let failed = 0;

  for (const item of queue) {
    if (item.type !== 'sale:create') {
      // Unknown type: keep it (or you can drop it if desired)
      continue;
    }

    const payload = JSON.parse(item.payload || '{}');
    try {
      // Payloads carry a clientSaleId, so the backend ignores retries of a sale
      // it has already recorded.
      await api.post('/api/sales', payload);
      await deleteSyncQueueItem(item._id);
      processed += 1;
    } catch (err) {
      const status = err?.response?.status;
      if (status >= 400 && status < 500) {
        // Permanently rejected (e.g. stock ran out while offline). Park it so it
        // can't block the rest of the queue forever.
        const reason = err?.response?.data?.message || `HTTP ${status}`;
        await markSyncQueueItemFailed(item, reason);
        failed += 1;
        continue;
      }
      // Network/server error: stop and retry the whole batch on the next sync.
      break;
    }
  }

  return { processed, failed };
}
