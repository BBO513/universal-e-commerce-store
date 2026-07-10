interface PrimaryButtonProps {
  children: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function PrimaryButton({ children, disabled = false, onClick }: PrimaryButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-14 min-w-[240px] items-center justify-center rounded-full text-sm font-semibold transition ${
        disabled
          ? 'cursor-not-allowed bg-slate-700 text-slate-400 ring-1 ring-slate-700'
          : 'bg-slate-100 text-slate-950 shadow-sm shadow-slate-950/10 hover:bg-white'
      }`}
    >
      {children}
    </button>
  );
}
