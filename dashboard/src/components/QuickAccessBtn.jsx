import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';

const QuickAccessBtn = ({ title, to, variant = 'primary' }) => {
  const navigate = useNavigate();

  return (
    <Button 
      variant={variant}
      onClick={() => to ? navigate(to) : null}
      className={`rounded-xl font-bold text-xs h-9 px-4 transition-all hover:-translate-y-0.5 ${
        variant === 'primary' ? 'bg-primary shadow-sm hover:shadow-primary/20' : 'bg-white border-border-subtle text-slate-500 hover:text-primary hover:border-primary/50'
      }`}
    >
      {title}
    </Button>
  );
};

export default QuickAccessBtn;
