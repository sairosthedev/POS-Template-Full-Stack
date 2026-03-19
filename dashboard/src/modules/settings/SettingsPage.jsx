import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, Save, Building, Globe, Mail, Phone, Percent, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const API = ''; // baseURL is configured globally (services/axios.config.js)

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    companyName: '',
    currency: 'USD',
    address: '',
    phone: '',
    email: '',
    taxRate: 0,
    theme: 'light'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API}/settings`);
      if (res.data.data) {
        setSettings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch settings', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axios.put(`${API}/settings`, settings);
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-text-main tracking-tight leading-none">System Architecture</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1.5">Configure global terminal and enterprise parameters</p>
        </div>
        {message && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
            <CheckCircle2 size={14} />
            {message}
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h3 className="text-sm font-black text-text-main uppercase tracking-widest mb-2">Entity Identity</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">Official business information used for receipt headers and legal documentation.</p>
          </div>
          
          <Card className="lg:col-span-2 shadow-xl shadow-slate-200/40 border-slate-100 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Company Legal Name" 
                value={settings.companyName} 
                onChange={e => setSettings({...settings, companyName: e.target.value})} 
                required
                className="font-bold border-slate-200"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Currency</label>
                <select 
                  className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold appearance-none shadow-sm"
                  value={settings.currency}
                  onChange={e => setSettings({...settings, currency: e.target.value})}
                >
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="ZWL">ZWL - Zimbabwe Dollar</option>
                  <option value="ZAR">ZAR (R) - Rand</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - Sterling</option>
                </select>
              </div>
              <Input 
                label="Public Email" 
                type="email"
                value={settings.email} 
                onChange={e => setSettings({...settings, email: e.target.value})} 
                className="font-bold border-slate-200"
              />
              <Input 
                label="Public Phone" 
                value={settings.phone} 
                onChange={e => setSettings({...settings, phone: e.target.value})} 
                className="font-bold border-slate-200"
              />
              <div className="md:col-span-2">
                <Input 
                  label="Headquarters Address" 
                  value={settings.address} 
                  onChange={e => setSettings({...settings, address: e.target.value})} 
                  className="font-bold border-slate-200"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h3 className="text-sm font-black text-text-main uppercase tracking-widest mb-2">Financial Engine</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">Taxation rules and fiscal preferences applied globally across all terminals.</p>
          </div>

          <Card className="lg:col-span-2 shadow-xl shadow-slate-200/40 border-slate-100 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <Input 
                  label="Global Tax Rate (%)" 
                  type="number"
                  step="0.01"
                  value={settings.taxRate} 
                  onChange={e => setSettings({...settings, taxRate: parseFloat(e.target.value)})} 
                  className="font-bold border-slate-200"
                />
                <Percent size={14} className="absolute right-4 top-[38px] text-slate-300 group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h3 className="text-sm font-black text-text-main uppercase tracking-widest mb-2">Visual Branding</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">Customize the look and feel of the back office dashboard for your team.</p>
          </div>

          <Card className="lg:col-span-2 shadow-xl shadow-slate-200/40 border-slate-100 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dashboard Theme</label>
                <select 
                  className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold appearance-none shadow-sm"
                  value={settings.theme}
                  onChange={e => setSettings({...settings, theme: e.target.value})}
                >
                  <option value="light">Light Onyx</option>
                  <option value="dark">Midnight Deep</option>
                  <option value="blue">Executive Blue</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end pt-8 border-t border-slate-100">
          <Button 
            type="submit" 
            disabled={loading} 
            className="px-10 py-7 bg-primary hover:bg-blue-700 shadow-2xl shadow-primary/30 font-black uppercase tracking-widest text-[11px] rounded-2xl active:scale-95 transition-all"
          >
            {loading ? <span className="flex items-center gap-2 italic">Processing Updates...</span> : (
              <span className="flex items-center gap-3">
                <Save size={18} /> Deploy Configuration
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;
