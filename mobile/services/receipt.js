import { currencySymbol } from './settings';

// Builds receipts from the store details configured in the Back Office
// (Settings page) — never hardcode the shop name here.

function esc(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function fmtDate(d) {
  const date = d ? new Date(d) : new Date();
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function buildReceiptHtml({ store = {}, receiptNo, createdAt, cashierName, paymentMethod, items = [], total, paid, change }) {
  const sym = currencySymbol(store.currency);
  const m = (n) => `${sym}${Number(n || 0).toFixed(2)}`;

  const rows = items
    .map(
      (i) => `
      <div class="item">
        <div class="item-name">${esc(i.name)}</div>
        <div class="item-line">
          <span>${Number(i.quantity)} × ${m(i.price)}</span>
          <span>${m(Number(i.price) * Number(i.quantity))}</span>
        </div>
      </div>`,
    )
    .join('');

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Courier New', Courier, monospace; background: #ffffff; color: #111; display: flex; justify-content: center; padding: 18px 0; }
      .paper { width: 300px; padding: 8px 14px; }
      .center { text-align: center; }
      .store { font-size: 17px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
      .muted { font-size: 11px; color: #444; margin-top: 2px; }
      .dashed { border-top: 1px dashed #888; margin: 10px 0; }
      .row { display: flex; justify-content: space-between; font-size: 12px; margin-top: 3px; }
      .item { margin-top: 6px; }
      .item-name { font-size: 12px; font-weight: 700; }
      .item-line { display: flex; justify-content: space-between; font-size: 12px; color: #333; }
      .total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; margin-top: 4px; }
      .footer { text-align: center; font-size: 12px; margin-top: 12px; }
    </style>
  </head>
  <body>
    <div class="paper">
      <div class="center">
        <div class="store">${esc(store.companyName || 'Receipt')}</div>
        ${store.address ? `<div class="muted">${esc(store.address)}</div>` : ''}
        ${store.phone ? `<div class="muted">Tel: ${esc(store.phone)}</div>` : ''}
        ${store.email ? `<div class="muted">${esc(store.email)}</div>` : ''}
      </div>
      <div class="dashed"></div>
      <div class="row"><span>Receipt</span><span>${esc(receiptNo)}</span></div>
      <div class="row"><span>Date</span><span>${esc(fmtDate(createdAt))}</span></div>
      ${cashierName ? `<div class="row"><span>Cashier</span><span>${esc(cashierName)}</span></div>` : ''}
      <div class="row"><span>Payment</span><span>${esc(String(paymentMethod || '').toUpperCase())}</span></div>
      <div class="dashed"></div>
      ${rows}
      <div class="dashed"></div>
      <div class="total"><span>TOTAL</span><span>${m(total)}</span></div>
      <div class="row"><span>Paid</span><span>${m(paid)}</span></div>
      <div class="row"><span>Change</span><span>${m(change)}</span></div>
      <div class="dashed"></div>
      <div class="footer">Thank you for shopping with us!</div>
    </div>
  </body>
</html>`;
}

// 32-column plain text for thermal printers (Sunmi).
const WIDTH = 32;

function centerLine(s) {
  const t = String(s ?? '').slice(0, WIDTH);
  const padLeft = Math.max(0, Math.floor((WIDTH - t.length) / 2));
  return ' '.repeat(padLeft) + t;
}

function splitLine(left, right) {
  const r = String(right ?? '');
  const l = String(left ?? '').slice(0, WIDTH - r.length - 1);
  return l + ' '.repeat(Math.max(1, WIDTH - l.length - r.length)) + r;
}

export function buildReceiptTextLines({ store = {}, receiptNo, createdAt, cashierName, paymentMethod, items = [], total, paid, change }) {
  const sym = currencySymbol(store.currency);
  const m = (n) => `${sym}${Number(n || 0).toFixed(2)}`;
  const divider = '-'.repeat(WIDTH);

  const lines = [centerLine((store.companyName || 'RECEIPT').toUpperCase())];
  if (store.address) lines.push(centerLine(store.address));
  if (store.phone) lines.push(centerLine(`Tel: ${store.phone}`));
  lines.push(divider);
  lines.push(splitLine('Receipt', String(receiptNo)));
  lines.push(splitLine('Date', fmtDate(createdAt)));
  if (cashierName) lines.push(splitLine('Cashier', cashierName));
  lines.push(splitLine('Payment', String(paymentMethod || '').toUpperCase()));
  lines.push(divider);
  for (const i of items) {
    lines.push(String(i.name).slice(0, WIDTH));
    lines.push(splitLine(`  ${Number(i.quantity)} x ${m(i.price)}`, m(Number(i.price) * Number(i.quantity))));
  }
  lines.push(divider);
  lines.push(splitLine('TOTAL', m(total)));
  lines.push(splitLine('Paid', m(paid)));
  lines.push(splitLine('Change', m(change)));
  lines.push(divider);
  lines.push(centerLine('Thank you for shopping'));
  lines.push(centerLine('with us!'));
  return lines;
}
