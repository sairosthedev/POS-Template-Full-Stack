import React from 'react';
import { Card } from './ui/Card';
import { TrendingUp, DollarSign, PackageOpen, CreditCard, ArrowUpRight } from 'lucide-react';

const BigStatCard = ({ title, value, type, trend }) => {
  const configs = {
    gross: {
      color: 'primary',
      icon: <TrendingUp size={20} />,
      bg: 'bg-blue-50',
      text: 'text-primary'
    },
    net: {
      color: 'success',
      icon: <DollarSign size={20} />,
      bg: 'bg-emerald-50',
      text: 'text-success'
    },
    products: {
      color: 'info',
      icon: <PackageOpen size={20} />,
      bg: 'bg-sky-50',
      text: 'text-info'
    },
    cost: {
      color: 'danger',
      icon: <CreditCard size={20} />,
      bg: 'bg-red-50',
      text: 'text-danger'
    }
  };

  const config = configs[type] || configs.gross;

  return (
    <Card className="stat-card-glow group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 ${config.bg} ${config.text} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
          {config.icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-success text-xs font-bold bg-success/10 px-2 py-1 rounded-lg">
            <ArrowUpRight size={14} />
            <span>{trend}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-2xl font-black text-text-main tracking-tight">{value}</p>
      </div>
      
      {/* Subtle decorative background element */}
      <div className={`absolute -right-4 -bottom-4 w-20 h-20 ${config.bg} rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
    </Card>
  );
};

export default BigStatCard;
