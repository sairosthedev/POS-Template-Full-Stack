import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Store } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Card } from '../../components/ui/Card';

const API = 'http://localhost:5000/api';
const empty = { name: '', address: '', contactNumber: '', status: 'Active' };

const StoreManagement = () => {
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(empty);

  useEffect(() => { fetchBranches(); }, []);

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${API}/branches`);
      setBranches(res.data.data || []);
    } catch { setBranches([]); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (current._id) {
        await axios.put(`${API}/branches/${current._id}`, current);
      } else {
        await axios.post(`${API}/branches`, current);
      }
      setShowModal(false);
      fetchBranches();
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this branch?')) {
      await axios.delete(`${API}/branches/${id}`);
      fetchBranches();
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-text-main tracking-tight leading-none">Branch Network</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1.5">Manage your retail outlets and locations</p>
        </div>
        <Button onClick={() => { setCurrent(empty); setShowModal(true); }} className="bg-primary hover:bg-blue-700 shadow-lg shadow-primary/20 gap-2 h-11 px-6 font-bold rounded-xl active:scale-95 transition-all">
          <Plus size={18} /> Register Branch
        </Button>
      </div>

      {branches.length === 0 ? (
        <div className="text-center py-32 bg-white/50 border border-dashed border-slate-200 rounded-[32px]">
          <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
            <Store size={40} />
          </div>
          <p className="text-slate-400 font-bold tracking-tight text-lg">No active branches configured.</p>
          <p className="text-slate-300 text-sm mt-1">Start by adding your headquarters or first retail outlet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {branches.map(b => (
            <Card key={b._id} className="group hover:border-primary/20 transition-all duration-300 shadow-xl shadow-slate-200/50">
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Store size={24} />
                </div>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                  b.status === 'Active' ? 'bg-success/10 text-success border-success/20' : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {b.status}
                </span>
              </div>
              <h3 className="text-lg font-black text-text-main mb-1 tracking-tight">{b.name}</h3>
              <div className="space-y-2 mt-4">
                {b.address && (
                  <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    {b.address}
                  </div>
                )}
                {b.contactNumber && (
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    {b.contactNumber}
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6 pt-5 border-t border-slate-50">
                <button onClick={() => { setCurrent(b); setShowModal(true); }}
                  className="flex-1 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-primary hover:text-white font-bold text-xs transition-all active:scale-95">
                  <Edit2 size={14} className="mr-2" /> Modify
                </button>
                <button onClick={() => handleDelete(b._id)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-danger/5 text-danger hover:bg-danger hover:text-white transition-all active:scale-95">
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={current._id ? 'Edit Branch Configuration' : 'Register New Outlet'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-4">
          <Input label="Display Name" placeholder="e.g. Harare CBD Branch" value={current.name} onChange={e => setCurrent({ ...current, name: e.target.value })} required className="bg-slate-50/50" />
          <Input label="Physical Address" placeholder="123 Samora Machel Ave" value={current.address} onChange={e => setCurrent({ ...current, address: e.target.value })} className="bg-slate-50/50" />
          <Input label="Contact Line" placeholder="+263 77..." value={current.contactNumber} onChange={e => setCurrent({ ...current, contactNumber: e.target.value })} className="bg-slate-50/50" />
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Operation Status</label>
            <select value={current.status} onChange={e => setCurrent({ ...current, status: e.target.value })}
              className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium appearance-none">
              <option value="Active">Active Operational</option>
              <option value="Inactive">Temporary Closed</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="font-bold text-slate-500">Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-blue-700 shadow-md shadow-primary/20 font-bold px-8">Save config</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StoreManagement;
