'use client';

export default function Badge({ children, variant = 'default', size = 'sm' }) {
  const variants = {
    default: 'bg-white/[0.06] text-text-secondary border-white/[0.08]',
    blue: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
    emerald: 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20',
    amber: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
    rose: 'bg-accent-rose/10 text-accent-rose border-accent-rose/20',
    purple: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
    cyan: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
  };

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <span className={`inline-flex items-center rounded-md border font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}
