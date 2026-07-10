import { ReactNode } from 'react';
import FeedbackWidget from '../FeedbackWidget';

interface GuidePanelProps {
  title: string;
  body: string;
  status: string;
  isReady: boolean;
  readyTimestamp: number | null;
  userActionCount: number;
  storefrontSnapshot: unknown;
  children?: ReactNode;
}

export default function GuidePanel({
  title,
  body,
  status,
  isReady,
  readyTimestamp,
  userActionCount,
  storefrontSnapshot,
  children,
}: GuidePanelProps) {
  return (
    <aside className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl shadow-slate-950/25 backdrop-blur-md transition-all duration-500 ease-in-out">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-300">{status}</p>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">{body}</p>
      {children}
      <FeedbackWidget
        isReady={isReady}
        readyTimestamp={readyTimestamp}
        userActionCount={userActionCount}
        storefrontSnapshot={storefrontSnapshot}
      />
    </aside>
  );
}
