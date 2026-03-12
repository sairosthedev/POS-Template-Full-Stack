import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

const API = 'http://localhost:5000/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      // Standard response returns { success, message, data: { token, user } }
      const { token, user } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decorative Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <Card className="w-full max-w-md p-10 shadow-2xl relative z-10 border-white/40 bg-white/80 backdrop-blur-xl">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-3xl mb-4 shadow-xl shadow-primary/30">
            M
          </div>
          <h1 className="text-2xl font-black text-sidebar tracking-tight">MICCS POS</h1>
          <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">Cloud Back Office</p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl text-xs font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-danger shrink-0 animate-pulse" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="admin@miccspos.co.zw"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="bg-white/50 border-slate-200 focus:border-primary transition-all font-medium"
            />
            <Mail className="absolute right-4 top-[38px] text-slate-300" size={16} />
          </div>

          <div className="relative">
            <Input 
              label="Password" 
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="bg-white/50 border-slate-200 focus:border-primary transition-all font-medium"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[38px] text-slate-300 hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-500 cursor-pointer font-medium hover:text-sidebar transition-colors">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary accent-primary" />
              Keep me signed in
            </label>
            <a href="#" className="text-primary font-bold hover:underline">Forgot?</a>
          </div>

          <Button 
            type="submit" 
            className="w-full py-7 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/25 bg-primary hover:bg-blue-700 transition-all active:scale-95"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Enter Dashboard'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-xs font-medium">
            Don't have an account? {' '}
            <Link to="/signup" className="text-primary font-bold hover:underline">Sign Up</Link>
          </p>
        </div>

        <div className="mt-6 pt-4 text-center">
          <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Miccs Technologies
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
