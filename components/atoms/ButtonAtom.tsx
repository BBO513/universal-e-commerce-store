interface ButtonAtomProps {
  children: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'subtle';
}

const variants: Record<NonNullable<ButtonAtomProps['variant']>, string> = {
  primary: 'bg-slate-100 text-slate-950 hover:bg-white shadow-sm shadow-slate-950/10',
  secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 ring-1 ring-slate-700',
  subtle: 'bg-slate-950/80 text-slate-300 hover:bg-slate-900 ring-1 ring-slate-700/60',
};

export default function ButtonAtom({ children, onClick, disabled = false, variant = 'subtle' }: ButtonAtomProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${variants[variant]} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      {children}
    </button>
  );
}
