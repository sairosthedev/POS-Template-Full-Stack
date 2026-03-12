import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Table, TableHead, TableBody, TableHeader, TableRow, TableCell } from '../../components/ui/Table';

const API = 'http://localhost:5000/api';
const ROLES = ['Admin', 'Manager', 'Cashier'];
const empty = { name: '', email: '', password: '', role: 'Cashier', branchId: '' };

const roleColors = {
  Admin: 'bg-purple-100 text-purple-700',
  Manager: 'bg-blue-100 text-blue-700',
  Cashier: 'bg-green-100 text-green-700',
};

const PeopleManagement = () => {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(empty);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [usersRes, branchesRes] = await Promise.all([
        axios.get(`${API}/users`),
        axios.get(`${API}/branches`),
      ]);
      setUsers(usersRes.data.data || []);
      setBranches(branchesRes.data.data || []);
    } catch { }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...current };
      if (!payload.branchId) delete payload.branchId;
      if (current._id && !payload.password) delete payload.password;

      if (current._id) {
        await axios.put(`${API}/users/${current._id}`, payload);
      } else {
        await axios.post(`${API}/users`, payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this employee?')) {
      await axios.delete(`${API}/users/${id}`);
      fetchData();
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-text-main tracking-tight leading-none">Team Management</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1.5">Manage employee roles and permissions</p>
        </div>
        <Button onClick={() => { setCurrent(empty); setShowPassword(false); setShowModal(true); }} className="bg-primary hover:bg-blue-700 shadow-lg shadow-primary/20 gap-2 h-11 px-6 font-bold rounded-xl active:scale-95 transition-all">
          <Plus size={18} /> Add Employee
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow className="bg-slate-50/50">
            <TableHeader className="text-[11px] font-black uppercase tracking-widest py-4">Name</TableHeader>
            <TableHeader className="text-[11px] font-black uppercase tracking-widest py-4">Email</TableHeader>
            <TableHeader className="text-[11px] font-black uppercase tracking-widest py-4">Role</TableHeader>
            <TableHeader className="text-[11px] font-black uppercase tracking-widest py-4">Branch</TableHeader>
            <TableHeader className="text-[11px] font-black uppercase tracking-widest py-4 text-center">Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user._id} className="group hover:bg-slate-50/50 transition-colors">
              <TableCell className="font-bold text-text-main py-5">{user.name}</TableCell>
              <TableCell className="text-slate-500 font-medium">{user.email}</TableCell>
              <TableCell>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                  user.role === 'Admin' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                  user.role === 'Manager' ? 'bg-blue-50 text-primary border-blue-100' :
                  'bg-green-50 text-success border-green-100'
                }`}>
                  {user.role}
                </span>
              </TableCell>
              <TableCell className="text-slate-400 font-medium italic">
                {branches.find(b => b._id === user.branchId)?.name || 'Central Office'}
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2 transition-opacity">
                  <button onClick={() => { setCurrent({ ...user, password: '' }); setShowPassword(false); setShowModal(true); }}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all active:scale-90">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(user._id)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-danger/10 text-danger hover:bg-danger hover:text-white transition-all active:scale-90">
                    <Trash2 size={16} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-20 text-slate-300 italic font-medium">No employees found in the system.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={current._id ? 'Edit Employee Profile' : 'Configure New Employee'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-4">
          <Input label="Full Name" placeholder="e.g. Tendai M" value={current.name} onChange={e => setCurrent({ ...current, name: e.target.value })} required className="bg-slate-50/50" />
          <Input label="Email Workspace" type="email" placeholder="tendai@miccspos.co.zw" value={current.email} onChange={e => setCurrent({ ...current, email: e.target.value })} required className="bg-slate-50/50" />

          <div className="relative">
            <Input
              label={current._id ? 'Update Access Key (leave blank to keep)' : 'System Access Key'}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={current.password}
              onChange={e => setCurrent({ ...current, password: e.target.value })}
              required={!current._id}
              className="bg-slate-50/50"
            />
            <button type="button" onClick={() => setShowPassword(s => !s)}
              className="absolute right-4 top-10 text-slate-300 hover:text-primary transition-colors">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Global Role</label>
              <select value={current.role} onChange={e => setCurrent({ ...current, role: e.target.value })}
                className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium appearance-none">
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Branch Assignment</label>
              <select value={current.branchId || ''} onChange={e => setCurrent({ ...current, branchId: e.target.value })}
                className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium appearance-none">
                <option value="">Global / Headquarters</option>
                {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="font-bold text-slate-500">Discard Changes</Button>
            <Button type="submit" className="bg-primary hover:bg-blue-700 shadow-md shadow-primary/20 font-bold px-8">Save profile</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PeopleManagement;
