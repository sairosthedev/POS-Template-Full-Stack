import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Loader2, User, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

const API = ''; // baseURL is set globally in services/axios.config.js

const Signup = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/auth/register`, formData);
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      onLogin(res.data.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <Card className="w-full max-w-md p-10 shadow-2xl relative z-10 border-white/40 bg-white/80 backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-3xl mb-4 shadow-xl shadow-primary/30">
            M
          </div>
          <h1 className="text-2xl font-black text-sidebar tracking-tight">Create Account</h1>
          <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">Join Miccs POS Enterprise</p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl text-xs font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-danger shrink-0 animate-pulse" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Input 
              label="Full Name" 
              name="name"
              type="text" 
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-white/50 border-slate-200 focus:border-primary transition-all"
            />
            <User className="absolute right-4 top-[38px] text-slate-300" size={16} />
          </div>

          <div className="relative">
            <Input 
              label="Email Address" 
              name="email"
              type="email" 
              placeholder="admin@miccspos.co.zw"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-white/50 border-slate-200 focus:border-primary transition-all"
            />
            <Mail className="absolute right-4 top-[38px] text-slate-300" size={16} />
          </div>

          <div className="relative">
            <Input 
              label="Password" 
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-white/50 border-slate-200 focus:border-primary transition-all"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[38px] text-slate-300 hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Account Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full h-11 px-4 bg-white/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium appearance-none"
            >
              <option value="Admin">System Administrator</option>
              <option value="Manager">Store Manager</option>
              <option value="Cashier">Cashier / Staff</option>
            </select>
          </div>

          <Button 
            type="submit" 
            className="w-full py-7 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/25 bg-primary hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 group"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                Register Account <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-xs font-medium">
            Already have an account? {' '}
            <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
