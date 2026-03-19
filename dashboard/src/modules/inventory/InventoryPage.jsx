import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2, Plus, AlertTriangle, Package, Archive, Layers } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Table, TableHead, TableBody, TableHeader, TableRow, TableCell } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';

const API = ''; // baseURL is configured globally (services/axios.config.js)
const empty = { name: '', category: '', stock: '', cost: '', price: '', unit: 'Unit', stockAlert: 5 };

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(empty);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data.data || []);
    } catch { setProducts([]); }
  };

  const handleAdjustStock = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/products/${current._id}`, { stock: Number(current.stock) });
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      alert('Failed to update stock: ' + (err.response?.data?.message || err.message));
    }
  };

  const lowStock = products.filter(p => p.stock > 0 && p.stock <= (p.stockAlert || 5));
  const outOfStock = products.filter(p => p.stock === 0);

  const filtered = filter === 'low' ? lowStock
    : filter === 'out' ? outOfStock
    : products;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-text-main tracking-tight leading-none">Inventory Logistics</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1.5">Monitor stock availability and supply chain alerts</p>
        </div>
      </div>

      {/* Modern Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card 
          className={`flex items-center gap-5 border-slate-100 shadow-xl shadow-slate-200/50 cursor-pointer transition-all duration-300 ${filter === 'all' ? 'ring-2 ring-primary border-primary/20 scale-[1.02]' : 'hover:scale-[1.01]'}`} 
          onClick={() => setFilter('all')}
        >
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
            <Layers size={24} className="text-slate-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Catalog Size</p>
            <p className="text-2xl font-black text-text-main tracking-tight leading-none">{products.length}</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">Total unique SKUs</p>
          </div>
        </Card>

        <Card 
          className={`flex items-center gap-5 border-slate-100 shadow-xl shadow-slate-200/50 cursor-pointer transition-all duration-300 ${filter === 'low' ? 'ring-2 ring-warning border-warning/20 scale-[1.02]' : 'hover:scale-[1.01]'}`} 
          onClick={() => setFilter('low')}
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 shadow-sm">
            <AlertTriangle size={24} className="text-warning" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Restock Alerts</p>
            <p className="text-2xl font-black text-warning tracking-tight leading-none">{lowStock.length}</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">Critical levels reached</p>
          </div>
        </Card>

        <Card 
          className={`flex items-center gap-5 border-slate-100 shadow-xl shadow-slate-200/50 cursor-pointer transition-all duration-300 ${filter === 'out' ? 'ring-2 ring-danger border-danger/20 scale-[1.02]' : 'hover:scale-[1.01]'}`} 
          onClick={() => setFilter('out')}
        >
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0 shadow-sm">
            <Archive size={24} className="text-danger" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Depleted Items</p>
            <p className="text-2xl font-black text-danger tracking-tight leading-none">{outOfStock.length}</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">Immediate action required</p>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-8">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-base font-black text-text-main tracking-tight uppercase tracking-widest text-[11px]">Inventory Ledger</h3>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Inventory data</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-8 py-4">Product Resource</th>
                <th className="px-8 py-4 text-center">Category Tag</th>
                <th className="px-8 py-4 text-center">Measurement</th>
                <th className="px-8 py-4 text-center">Availability</th>
                <th className="px-8 py-4 text-center">Safety Threshold</th>
                <th className="px-8 py-4 text-center">Condition</th>
                <th className="px-8 py-4 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(p => {
                const isOut = p.stock === 0;
                const isLow = !isOut && p.stock <= (p.stockAlert || 5);
                return (
                  <tr key={p._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-text-main">{p.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">#{p._id.slice(-6).toUpperCase()}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-primary text-[10px] font-black uppercase tracking-wider border border-blue-100/50">
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
                        {isOut ? 'Critical Depletion' : isLow ? 'Low Resource' : 'Operational'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => { setCurrent({ ...p }); setShowModal(true); }}
                        className="w-9 h-9 inline-flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-primary hover:text-white transition-all active:scale-90"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-slate-300 italic font-medium">
                    No items detected within the "{filter}" logistics filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Quantities Adjustment">
        <form onSubmit={handleAdjustStock} className="flex flex-col gap-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Product</p>
            <p className="text-xl font-black text-text-main tracking-tight">{current.name}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Current Balance</p>
              <p className="text-2xl font-black text-primary tracking-tight">{current.stock} <span className="text-xs uppercase opacity-60 font-bold">{current.unit}</span></p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Alert Floor</p>
              <p className="text-2xl font-black text-slate-400 tracking-tight">{current.stockAlert} <span className="text-xs uppercase opacity-60 font-bold">{current.unit}</span></p>
            </div>
          </div>

          <Input
            label="Logistics Inventory Correction"
            type="number"
            value={current.stock}
            onChange={e => setCurrent({ ...current, stock: e.target.value })}
            required
            className="text-lg font-black tracking-tight"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Abandon</Button>
            <Button type="submit" className="bg-primary hover:bg-blue-700 shadow-xl shadow-primary/20 px-8 font-black uppercase tracking-widest text-[10px]">Override Quantities</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryManagement;
