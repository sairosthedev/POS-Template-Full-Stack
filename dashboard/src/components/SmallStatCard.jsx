import React from 'react';
import { Card } from './ui/Card';

const SmallStatCard = ({ icon, label, value }) => {
  return (
    <Card className="flex flex-row items-center gap-4 transition-all hover:border-primary/30">
      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-primary shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className="text-xl font-black text-text-main leading-none">{value}</p>
      </div>
    </Card>
  );
};

export default SmallStatCard;
