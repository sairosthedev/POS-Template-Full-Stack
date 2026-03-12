import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuickAccessBtn from '../components/QuickAccessBtn';
import BigStatCard from '../components/BigStatCard';
import SmallStatCard from '../components/SmallStatCard';
import { Package, Store, Users, CheckCircle2, TrendingUp, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    grossSales: 0,
    netProfit: 0,
    productsSold: 0,
    totalExpenses: 0,
    totalProducts: 0,
    totalStores: 0,
    totalEmployees: 0,
    totalSalesCount: 0
  });

  const [activeTab, setActiveTab] = useState('Daily');

  useEffect(() => {
    axios.get('http://localhost:5000/api/reports/stats')
      .then(res => {
        const data = res.data.data;
        setStats({
          grossSales: data.grossSales || 0,
          netProfit: data.grossProfit || 0,
          productsSold: data.productsSold || 0,
          totalExpenses: data.totalExpenses || 0,
          totalSalesCount: data.transactions || 0,
          totalProducts: data.totalProducts || 0,
          totalStores: data.totalStores || 0,
          totalEmployees: data.totalEmployees || 0,
        });
      })
      .catch(err => console.error('Failed to fetch stats', err));
  }, []);

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-text-main tracking-tight">Enterprise Overview</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">Monitor your business performance in real-time</p>
        </div>
        
        <div className="bg-white p-1 rounded-xl border border-border-subtle shadow-sm flex gap-1">
          {['Daily', 'Weekly', 'Monthly'].map((tab) => (
            <button 
              key={tab}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-400 hover:text-text-main hover:bg-slate-50'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="flex flex-col gap-8">
          
          {/* Big Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <BigStatCard title="Gross Sales" value={`$${stats.grossSales.toLocaleString(undefined, {minimumFractionDigits: 2})}`} type="gross" trend={12} />
            <BigStatCard title="Net Profit" value={`$${stats.netProfit.toLocaleString(undefined, {minimumFractionDigits: 2})}`} type="net" trend={8} />
            <BigStatCard title="Products Sold" value={stats.productsSold} type="products" trend={15} />
            <BigStatCard title="Total Expenses" value={`$${stats.totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}`} type="cost" />
          </div>

          {/* Business Snapshot Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-text-main tracking-tight">Business Snapshot</h3>
            <div className="flex gap-4">
              <QuickAccessBtn title="Add Product" to="/products" variant="outline" />
              <button className="btn-primary flex items-center gap-2 group">
                Download Report <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
            <Card className="min-h-[300px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-text-main">Sales Performance</h3>
                <div className="text-xs font-bold text-success flex items-center gap-1 bg-success/10 px-2 py-1 rounded-lg">
                  +2.5% vs last week
                </div>
              </div>
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-3 italic">
                <TrendingUp size={48} className="opacity-20" />
                <p>Advanced Sales Analytics Loading...</p>
              </div>
            </Card>
            <Card className="min-h-[300px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-text-main">Top Selling Products</h3>
                <Button size="sm" variant="ghost" onClick={() => navigate('/products')}>View Catalog</Button>
              </div>
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-3 italic">
                <Package size={48} className="opacity-20" />
                <p>Processing Product Insights...</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Sidebar Stats */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none">Global Assets</h3>
          </div>
          <div className="flex flex-col gap-4">
            <SmallStatCard 
              icon={<Package size={20} />} 
              label="Active Products" 
              value={stats.totalProducts} 
            />
            <SmallStatCard 
              icon={<Store size={20} />} 
              label="Retail Outlets" 
              value={stats.totalStores} 
            />
            <SmallStatCard 
              icon={<Users size={20} />} 
              label="Total Employees" 
              value={stats.totalEmployees} 
            />
            <SmallStatCard 
              icon={<CheckCircle2 size={20} />} 
              label="Completed Sales" 
              value={stats.totalSalesCount} 
            />
          </div>

          <Card className="mt-4 bg-primary/5 border-primary/10">
            <h4 className="text-sm font-bold text-text-main mb-2">Quick Action</h4>
            <p className="text-xs text-slate-500 mb-4 font-medium italic">Perform a manual inventory sync or check for system updates.</p>
            <Button className="w-full bg-primary text-white font-bold h-10 rounded-xl" onClick={() => window.location.reload()}>
              Force Refresh Data
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
