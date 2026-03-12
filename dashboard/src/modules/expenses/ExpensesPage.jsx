import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Receipt, DollarSign, Calendar, Tag } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Table, TableHead, TableBody, TableHeader, TableRow, TableCell } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';

const API = 'http://localhost:5000/api';
const emptyExpense = { title: '', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] };

const CATEGORIES = ['Rent', 'Utilities', 'Salaries', 'Supplies', 'Marketing', 'Maintenance', 'Insurance', 'Other'];

const ExpensesManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(emptyExpense);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API}/expenses`);
      setExpenses(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch expenses', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/expenses`, current);
      setShowModal(false);
      fetchExpenses();
      setCurrent(emptyExpense);
    } catch (err) {
      alert('Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`${API}/expenses/${id}`);
        fetchExpenses();
      } catch (err) {
        alert('Failed to delete expense');
      }
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-text-main tracking-tight leading-none">Expense Control</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1.5">Track and manage business operational costs</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-primary hover:bg-blue-700 shadow-lg shadow-primary/20 gap-2 h-11 px-6 font-bold rounded-xl active:scale-95 transition-all">
          <Plus size={18} /> Add Record
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary hover:scale-[1.02] transition-transform cursor-default">
          <div className="flex justify-between items-start">
            <p className="text-xs font-black text-white/60 uppercase tracking-widest">Global Outflow</p>
            <DollarSign size={20} className="text-white/40" />
          </div>
          <p className="text-3xl font-black text-white mt-3">${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
        </Card>
        <Card className="hover:scale-[1.02] transition-transform cursor-default border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="flex justify-between items-start">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Period</p>
            <Calendar size={20} className="text-slate-200" />
          </div>
          <p className="text-3xl font-black text-text-main mt-3">${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
        </Card>
        <Card className="hover:scale-[1.02] transition-transform cursor-default border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="flex justify-between items-start">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Entries</p>
            <Tag size={20} className="text-slate-200" />
          </div>
          <p className="text-3xl font-black text-text-main mt-3">{expenses.length}</p>
        </Card>
      </div>

      <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <Table>
          <TableHead>
            <TableRow className="bg-slate-50/50">
              <TableHeader className="text-[11px] font-black uppercase tracking-widest py-4">Transaction Date</TableHeader>
              <TableHeader className="text-[11px] font-black uppercase tracking-widest py-4">Title / Purpose</TableHeader>
              <TableHeader className="text-[11px] font-black uppercase tracking-widest py-4">Category</TableHeader>
              <TableHeader className="text-[11px] font-black uppercase tracking-widest py-4 text-center">Amount</TableHeader>
              <TableHeader className="text-[11px] font-black uppercase tracking-widest py-4 text-right">Action</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense._id} className="group hover:bg-slate-50/50 transition-colors">
                <TableCell className="text-slate-400 font-bold text-xs py-5">
                  {new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </TableCell>
                <TableCell className="font-bold text-text-main">{expense.title}</TableCell>
                <TableCell>
                  <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                    {expense.category}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-black text-danger">-${expense.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </TableCell>
                <TableCell className="text-right">
                  <button 
                    onClick={() => handleDelete(expense._id)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-danger/5 text-danger hover:bg-danger hover:text-white transition-all ml-auto"
                  >
                    <Trash2 size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {expenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-slate-300 italic">
                  <Receipt size={48} className="mx-auto mb-4 opacity-10" />
                  <p className="font-bold">No financial outflows recorded in this view.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Register Expense Entry">
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <Input 
            label="Transaction Title" 
            placeholder="e.g. Server Infrastructure Payment"
            value={current.title}
            onChange={e => setCurrent({...current, title: e.target.value})}
            required
            className="bg-slate-50/50"
          />
          <div className="grid grid-cols-2 gap-6">
            <Input 
              label="Net Amount ($)" 
              type="number"
              step="0.01"
              placeholder="0.00"
              value={current.amount}
              onChange={e => setCurrent({...current, amount: e.target.value})}
              required
              className="bg-slate-50/50"
            />
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Entry Category</label>
              <select 
                className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium appearance-none"
                value={current.category}
                onChange={e => setCurrent({...current, category: e.target.value})}
                required
              >
                <option value="">Select Class</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <Input 
            label="Execution Date" 
            type="date"
            value={current.date}
            onChange={e => setCurrent({...current, date: e.target.value})}
            required
            className="bg-slate-50/50"
          />
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Internal Memo (Required)</label>
            <textarea 
              className="px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium h-24"
              placeholder="Provide a brief explanation for this expenditure..."
              value={current.description}
              onChange={e => setCurrent({...current, description: e.target.value})}
            />
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="font-bold text-slate-500">Discard Entry</Button>
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-blue-700 shadow-md shadow-primary/20 font-bold px-8">
              {loading ? 'Processing...' : 'Save Record'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExpensesManagement;
