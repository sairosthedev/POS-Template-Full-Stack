import React, { useState, useEffect, useCallback } from 'react';
import { Spinner } from '../../components/ui/Spinner';
import axios from 'axios';
import { Edit2, AlertTriangle, Archive, Layers, ChevronLeft, ChevronRight, Banknote, History, ClipboardList } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Card } from '../../components/ui/Card';

const API = ''; // baseURL is configured globally (services/axios.config.js)

const LIMIT = 25;

const money = (n) => `$${Number(n || 0).toFixed(2)}`;

const ADJUST_MODES = [
  { key: 'restock', label: 'Restock (+)', hint: 'Goods received — adds to stock' },
  { key: 'remove', label: 'Remove (−)', hint: 'Damage, loss or correction — subtracts' },
  { key: 'set', label: 'Stock take (=)', hint: 'Set the exact counted quantity' },
];

const InventoryManagement = () => {
  const [tab, setTab] = useState('stock'); // stock | history
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(null);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: LIMIT, total: 0, totalPages: 0 });
  const [stats, setStats] = useState({ skus: 0, units: 0, costValue: 0, retailValue: 0, lowStock: 0, outOfStock: 0 });
  const [loading, setLoading] = useState(true);

  // Adjustment modal state
  const [mode, setMode] = useState('restock');
  const [qty, setQty] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  // History tab state
  const [logs, setLogs] = useState([]);
  const [logPage, setLogPage] = useState(1);
  const [logPagination, setLogPagination] = useState({ page: 1, limit: LIMIT, total: 0, totalPages: 0 });
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/inventory/stats`);
      if (res.data?.data) setStats(res.data.data);
    } catch { /* keep last known stats */ }
  }, []);

  const fetchProducts = useCallback(async (p = 1, f = 'all') => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/products`, { params: { page: p, limit: LIMIT, filter: f } });
      const d = res.data;
      setProducts(d.data || []);
      if (d.pagination) setPagination(d.pagination);
    } catch { setProducts([]); } finally { setLoading(false); }
  }, []);

  const fetchLogs = useCallback(async (p = 1) => {
    try {
      setLogsLoading(true);
      const res = await axios.get(`${API}/inventory/logs`, { params: { page: p, limit: LIMIT } });
      setLogs(res.data?.data || []);
      if (res.data?.pagination) setLogPagination(res.data.pagination);
    } catch { setLogs([]); } finally { setLogsLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(page, filter); }, [page, filter, fetchProducts]);
  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { if (tab === 'history') fetchLogs(logPage); }, [tab, logPage, fetchLogs]);

  const openAdjust = (product) => {
    setCurrent(product);
    setMode('restock');
    setQty('');
    setNote('');
    setShowModal(true);
  };

  const handleAdjustStock = async (e) => {
    e.preventDefault();
    const amount = Number(qty);
    if (!Number.isFinite(amount) || amount < 0) return alert('Enter a valid quantity');
    setSaving(true);
    try {
      if (mode === 'set') {
        await axios.post(`${API}/inventory/set`, {
          productId: current._id,
          stock: amount,
          note: note || 'Stock take',
        });
      } else {
        await axios.post(`${API}/inventory/adjust`, {
          productId: current._id,
          quantity: amount,
          changeType: mode === 'restock' ? 'Restock' : 'Damage',
          note: note || (mode === 'restock' ? 'Goods received' : 'Stock removed'),
        });
      }
      setShowModal(false);
      fetchProducts(page, filter);
      fetchStats();
      if (tab === 'history') fetchLogs(1);
    } catch (err) {
      alert('Failed to update stock: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleFilter = (f) => { setFilter(f); setPage(1); setTab('stock'); };

  const Pager = ({ pg, onPrev, onNext, busy }) => (
    pg.totalPages > 1 ? (
      <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Page {pg.page} of {pg.totalPages} · {pg.total} entries
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={pg.page <= 1 || busy} onClick={onPrev}><ChevronLeft size={16} /></Button>
          <span className="text-sm font-bold text-slate-600 min-w-[4rem] text-center">{pg.page} / {pg.totalPages}</span>
          <Button variant="outline" size="sm" disabled={pg.page >= pg.totalPages || busy} onClick={onNext}><ChevronRight size={16} /></Button>
        </div>
      </div>
    ) : null
  );

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-text-main tracking-tight leading-none">Inventory Management</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1.5">Stock levels, valuation and movement history</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card
          className={`flex items-center gap-5 border-slate-100 shadow-xl shadow-slate-200/50 cursor-pointer transition-all duration-300 ${filter === 'all' && tab === 'stock' ? 'ring-2 ring-primary border-primary/20 scale-[1.02]' : 'hover:scale-[1.01]'}`}
          onClick={() => handleFilter('all')}
        >
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
            <Layers size={24} className="text-slate-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Catalog Size</p>
            <p className="text-2xl font-black text-text-main tracking-tight leading-none">{stats.skus}</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">{stats.units} units on hand</p>
          </div>
        </Card>

        <Card
          className={`flex items-center gap-5 border-slate-100 shadow-xl shadow-slate-200/50 cursor-pointer transition-all duration-300 ${filter === 'low' && tab === 'stock' ? 'ring-2 ring-warning border-warning/20 scale-[1.02]' : 'hover:scale-[1.01]'}`}
          onClick={() => handleFilter('low')}
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 shadow-sm">
            <AlertTriangle size={24} className="text-warning" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Low Stock</p>
            <p className="text-2xl font-black text-warning tracking-tight leading-none">{stats.lowStock}</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">At or below alert level</p>
          </div>
        </Card>

        <Card
          className={`flex items-center gap-5 border-slate-100 shadow-xl shadow-slate-200/50 cursor-pointer transition-all duration-300 ${filter === 'out' && tab === 'stock' ? 'ring-2 ring-danger border-danger/20 scale-[1.02]' : 'hover:scale-[1.01]'}`}
          onClick={() => handleFilter('out')}
        >
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0 shadow-sm">
            <Archive size={24} className="text-danger" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Out of Stock</p>
            <p className="text-2xl font-black text-danger tracking-tight leading-none">{stats.outOfStock}</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">Cannot be sold</p>
          </div>
        </Card>

        <Card className="flex items-center gap-5 border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0 shadow-sm">
            <Banknote size={24} className="text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Valuation</p>
            <p className="text-2xl font-black text-primary tracking-tight leading-none">{money(stats.costValue)}</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">Retail value {money(stats.retailValue)}</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setTab('stock')}
          className={`inline-flex items-center gap-2 px-5 h-10 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'stock' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-white text-slate-400 border border-slate-200 hover:text-primary hover:border-primary/40'}`}
        >
          <ClipboardList size={15} /> Stock Ledger
        </button>
        <button
          onClick={() => setTab('history')}
          className={`inline-flex items-center gap-2 px-5 h-10 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'history' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-white text-slate-400 border border-slate-200 hover:text-primary hover:border-primary/40'}`}
        >
          <History size={15} /> Movement History
        </button>
      </div>

      {tab === 'stock' ? (
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-8">
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-black text-text-main uppercase tracking-widest text-[11px]">Inventory Ledger</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live inventory data</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-4">Product</th>
                  <th className="px-8 py-4 text-center">Category</th>
                  <th className="px-8 py-4 text-center">Unit</th>
                  <th className="px-8 py-4 text-center">In Stock</th>
                  <th className="px-8 py-4 text-center">Alert Level</th>
                  <th className="px-8 py-4 text-center">Status</th>
                  <th className="px-8 py-4 text-right">Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-20"><div className="flex flex-col items-center gap-3 text-slate-400 font-medium"><Spinner size="lg" /><span>Loading inventory…</span></div></td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center text-slate-300 italic font-medium">
                      No items match this filter.
                    </td>
                  </tr>
                ) : (
                  products.map(p => {
                    const isOut = p.stock === 0;
                    const isLow = !isOut && p.stock <= (p.stockAlert || 5);
                    return (
                      <tr key={p._id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <p className="text-sm font-black text-text-main">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">#{p._id.slice(-6).toUpperCase()}</p>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="px-2.5 py-1 rounded-lg bg-green-50 text-primary text-[10px] font-black uppercase tracking-wider border border-green-100/50">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center text-sm font-bold text-slate-500 uppercase tracking-tighter">{p.unit}</td>
                        <td className="px-8 py-5 text-center">
                          <p className="text-lg font-black text-text-main leading-none">{p.stock}</p>
                        </td>
                        <td className="px-8 py-5 text-center text-sm font-bold text-slate-400 italic">
                          {p.stockAlert || 5} units
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                            isOut ? 'bg-red-50 text-danger border-red-100' :
                            isLow ? 'bg-amber-50 text-warning border-amber-100' :
                            'bg-emerald-50 text-success border-emerald-100'
                          }`}>
                            {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => openAdjust(p)}
                            className="w-9 h-9 inline-flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-primary hover:text-white transition-all active:scale-90"
                          >
                            <Edit2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <Pager pg={pagination} busy={loading} onPrev={() => setPage((p) => Math.max(1, p - 1))} onNext={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} />
        </div>
      ) : (
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-8">
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-black text-text-main uppercase tracking-widest text-[11px]">Stock Movement History</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Every change, by whom, and why</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4">Product</th>
                  <th className="px-8 py-4 text-center">Change</th>
                  <th className="px-8 py-4 text-center">New Level</th>
                  <th className="px-8 py-4 text-center">Action</th>
                  <th className="px-8 py-4">Reason</th>
                  <th className="px-8 py-4">By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logsLoading ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-20"><div className="flex flex-col items-center gap-3 text-slate-400 font-medium"><Spinner size="lg" /><span>Loading history…</span></div></td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center text-slate-300 italic font-medium">
                      No stock movements recorded yet. Sales and adjustments will appear here.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const isIncrease = Number(log.newStock) > Number(log.previousStock);
                    return (
                      <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-4 text-xs font-bold text-slate-500 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="px-8 py-4">
                          <p className="text-sm font-black text-text-main">{log.productId?.name || 'Deleted product'}</p>
                        </td>
                        <td className={`px-8 py-4 text-center text-sm font-black ${isIncrease ? 'text-success' : 'text-danger'}`}>
                          {isIncrease ? '+' : '−'}{log.quantity}
                        </td>
                        <td className="px-8 py-4 text-center text-sm font-bold text-slate-500">{log.newStock}</td>
                        <td className="px-8 py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                            log.changeType === 'Sale' ? 'bg-green-50 text-primary border-green-100' :
                            log.changeType === 'Restock' ? 'bg-emerald-50 text-success border-emerald-100' :
                            log.changeType === 'Damage' ? 'bg-red-50 text-danger border-red-100' :
                            'bg-slate-50 text-slate-500 border-slate-100'
                          }`}>
                            {log.changeType}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-xs font-medium text-slate-500">{log.note || '—'}</td>
                        <td className="px-8 py-4 text-xs font-bold text-slate-600">{log.performedBy?.name || '—'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <Pager pg={logPagination} busy={logsLoading} onPrev={() => setLogPage((p) => Math.max(1, p - 1))} onNext={() => setLogPage((p) => Math.min(logPagination.totalPages, p + 1))} />
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Adjust Stock">
        {current ? (
          <form onSubmit={handleAdjustStock} className="flex flex-col gap-5">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Product</p>
              <p className="text-xl font-black text-text-main tracking-tight">{current.name}</p>
              <p className="text-xs font-bold text-slate-400 mt-1">Current stock: <span className="text-primary">{current.stock} {current.unit}</span></p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {ADJUST_MODES.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMode(m.key)}
                  className={`px-3 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all ${
                    mode === m.key
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
                      : 'bg-white text-slate-400 border-slate-200 hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <p className="text-xs font-medium text-slate-400 -mt-2">{ADJUST_MODES.find((m) => m.key === mode)?.hint}</p>

            <Input
              label={mode === 'set' ? 'Counted quantity' : 'Quantity'}
              type="number"
              min="0"
              step="any"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              required
              className="text-lg font-black tracking-tight"
            />

            <Input
              label="Reason / note"
              type="text"
              placeholder={mode === 'restock' ? 'e.g. Delivery from supplier' : mode === 'remove' ? 'e.g. Damaged in storage' : 'e.g. Monthly stock take'}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
              <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" loading={saving} className="px-8">
                {mode === 'restock' ? 'Add Stock' : mode === 'remove' ? 'Remove Stock' : 'Set Stock'}
              </Button>
            </div>
          </form>
        ) : null}
      </Modal>
    </div>
  );
};

export default InventoryManagement;
