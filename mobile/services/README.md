## Mobile services (architecture-aligned)

- `api.js`: Axios client for backend REST API (see `ARCHITECTURE.md`).
- `db.js`: SQLite tables for offline-first POS data + a simple sync queue.
- `sync.js`: Minimal sync worker that flushes `sync_queue` to the backend.

