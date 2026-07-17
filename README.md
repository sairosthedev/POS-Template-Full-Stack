# Belcit Trading POS

A full-stack Point of Sale system for retail businesses: an Android POS app for cashiers, a web back-office dashboard for admins and managers, and a shared REST API.

| App | Path | Stack | Who uses it |
| --- | --- | --- | --- |
| Backend API | [`backend/`](backend/) | Node.js, Express 5, MongoDB (Mongoose), JWT | Both clients |
| Back-office dashboard | [`dashboard/`](dashboard/) | React 19, Vite, TailwindCSS | Admins, managers |
| Mobile POS | [`mobile/`](mobile/) | Expo / React Native, Redux Toolkit, SQLite | Cashiers (Android phones, Sunmi POS) |

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full design document.

## Prerequisites

- Node.js 20+
- MongoDB (local install, Docker, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- For the mobile app: the [Expo Go](https://expo.dev/go) app on a phone, or Android Studio for an emulator

## 1. Backend

```bash
cd backend
npm install
cp .env.example .env    # then edit .env: set MONGO_URI and a strong JWT_SECRET
npm run dev             # starts on http://localhost:5000
```

### Create the first admin account

There is no public sign-up — run the seed script once:

```bash
npm run seed:admin -- admin@example.com StrongPassword123 "Store Owner"
```

All further staff accounts are created from the dashboard's **People** page.

## 2. Dashboard (back office)

```bash
cd dashboard
npm install
npm run dev             # http://localhost:5173, expects the API on localhost:5000
```

If the API is hosted elsewhere, copy `.env.example` to `.env` and set `VITE_API_URL`.

## 3. Mobile POS app

```bash
cd mobile
npm install
npx expo start          # scan the QR code with Expo Go on the same Wi-Fi network
```

In development the app auto-detects your dev machine's IP and calls the API on port 5000. For a production build, set `EXPO_PUBLIC_API_BASE_URL` (see `mobile/.env.example`).

## Roles

| Role | Mobile POS | Dashboard |
| --- | --- | --- |
| Cashier | Sell, view own sales | No access |
| Manager | Full access | Everything except Stores & Settings; cannot manage Admin accounts |
| Admin | Full access | Full access |

Cashiers can sign in with email + password or a numeric PIN.

## Offline sales

The mobile app works offline: sales are queued in on-device SQLite and pushed to the API when connectivity returns. Every sale carries a client-generated `clientSaleId`, which the backend uses to deduplicate retries, so a flaky network cannot double-record a sale. Queued sales the server permanently rejects (e.g. stock ran out in the meantime) are parked in a local `sync_failed` table instead of blocking the queue.

## Known limitations

- **Sunmi receipt printing is a stub.** [`mobile/services/printer.js`](mobile/services/printer.js) calls a native Sunmi module if one is present, but no native module ships in this repo — in Expo Go it falls back to sharing a PDF receipt. Real printing on Sunmi hardware requires an Expo dev build with a native printer module (see [`mobile/SUNMI_PRINTER.md`](mobile/SUNMI_PRINTER.md)).
- **Stock is global, not per-branch.** Products carry a single stock count; branch-level inventory and branch-filtered reports are not implemented yet.
- **No password-reset flow.** An admin resets passwords from the People page (or via `npm run seed:admin` for the admin account itself).
- **No automated tests yet.**

## Production notes

- Set a strong `JWT_SECRET`; never deploy with the example value.
- Serve the API behind HTTPS (e.g. Nginx + Let's Encrypt).
- Restrict CORS to your dashboard's domain and add rate limiting before exposing the API to the internet.
