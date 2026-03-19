import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from '../../components/ui/Card';
import { TrendingUp, DollarSign, ShoppingCart, Package } from 'lucide-react';

const API = ''; // baseURL is configured globally (services/axios.config.js)

const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

const StatBadge = ({ icon, label, value, sub }) => (
  <Card className="flex items-center gap-5 border-slate-100 shadow-xl shadow-slate-200/50 hover:border-primary/20 hover:scale-[1.02] transition-all duration-300">
    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-text-main tracking-tight leading-none">{value}</p>
      {sub && <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">{sub}</p>}
    </div>
  </Card>
);

const Reports = () => {
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState({ grossSales: 0, netSales: 0, transactions: 0, productsSold: 0 });
  const [period, setPeriod] = useState('daily');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [salesRes, statsRes] = await Promise.all([
        axios.get(`${API}/sales`),
        axios.get(`${API}/sales/stats`),
      ]);
      setSales(salesRes.data.data || []);
      setStats(statsRes.data.data || { grossSales: 0, netSales: 0, transactions: 0, productsSold: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  const buildChartData = () => {
    const map = {};
    sales.forEach(sale => {
      const date = new Date(sale.createdAt);
      let key;
      if (period === 'daily') key = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      else if (period === 'monthly') key = date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
      else key = `Week ${Math.ceil(date.getDate() / 7)} ${date.toLocaleDateString('en-GB', { month: 'short' })}`;
      map[key] = (map[key] || 0) + sale.total;
    });
    return Object.entries(map).map(([name, total]) => ({ name, total: +total.toFixed(2) }));
  };

  const paymentData = () => {
    const map = {};
    sales.forEach(s => { map[s.paymentMethod] = (map[s.paymentMethod] || 0) + s.total; });
    return Object.entries(map).map(([name, value]) => ({ name, value: +value.toFixed(2) }));
  };

  const chartData = buildChartData();
  const pieData = paymentData();

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-text-main tracking-tight leading-none">Financial Intelligence</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1.5">Comprehensive analysis of business performance</p>
        </div>
        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex gap-1">
          {['daily', 'weekly', 'monthly'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${period === p ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-400 hover:text-text-main hover:bg-slate-50'}`}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatBadge icon={<DollarSign size={24} className="text-primary" />} label="Gross Turnover" value={`$${Number(stats.grossSales).toLocaleString(undefined, {minimumFractionDigits: 2})}`} />
        <StatBadge icon={<TrendingUp size={24} className="text-success" />} label="Net Contribution" value={`$${Number(stats.netSales).toLocaleString(undefined, {minimumFractionDigits: 2})}`} />
        <StatBadge icon={<ShoppingCart size={24} className="text-indigo-500" />} label="Total Activity" value={stats.transactions || 0} sub="Closed transactions" />
        <StatBadge icon={<Package size={24} className="text-warning" />} label="Volume Moved" value={stats.productsSold || 0} sub="Items delivered" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2 shadow-xl shadow-slate-200/40">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-black text-text-main tracking-tight">Revenue Dynamics</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2.5 py-1 rounded-lg">Performance Trend</span>
          </div>
          {chartData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-300 gap-3 italic">
              <TrendingUp size={48} className="opacity-10" />
              <p>No historical data projection available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dx={-10} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ border: 'none', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '12px' }}
                  formatter={v => [`$${v}`, 'Revenue']} 
                />
                <Bar dataKey="total" fill="#2563EB" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="shadow-xl shadow-slate-200/40">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-black text-text-main tracking-tight">Payment Split</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-success bg-success/5 px-2.5 py-1 rounded-lg">Real-time</span>
          </div>
          {pieData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-300 gap-3 italic text-center">
              <DollarSign size={48} className="opacity-10" />
              <p>Payment distribution <br/> not yet available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
                </Pie>
                <Tooltip 
                   contentStyle={{ border: 'none', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '12px' }}
                   formatter={v => `$${v}`} 
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-8">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-base font-black text-text-main tracking-tight">Transaction Ledger</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Showing last 20 entries</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-8 py-4">Receipt Token</th>
                <th className="px-8 py-4">Timestamp</th>
                <th className="px-8 py-4">Inventory Size</th>
                <th className="px-8 py-4">Tender Type</th>
                <th className="px-8 py-4 text-right">Settlement Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sales.length === 0 && (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-300 italic font-medium">No system settlements recorded as of {new Date().toLocaleDateString()}.</td></tr>
              )}
              {sales.slice(0, 20).map(sale => (
                <tr key={sale._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 font-mono text-[11px] font-bold text-slate-400 group-hover:text-primary transition-colors">#{sale._id.slice(-8).toUpperCase()}</td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500 whitespace-nowrap">
                    {new Date(sale.createdAt).toLocaleString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-text-main">{sale.items?.length || 0} Product(s)</td>
                  <td className="px-8 py-5">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-50 text-primary border border-blue-100">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-black text-text-main text-right text-lg">${Number(sale.total).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
