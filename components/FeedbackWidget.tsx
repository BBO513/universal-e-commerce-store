'use client';

import { useEffect, useState } from 'react';
import ButtonAtom from './atoms/ButtonAtom';

interface FeedbackWidgetProps {
  isReady: boolean;
  readyTimestamp: number | null;
  userActionCount: number;
  storefrontSnapshot: unknown;
}

export default function FeedbackWidget({
  isReady,
  readyTimestamp,
  userActionCount,
  storefrontSnapshot,
}: FeedbackWidgetProps) {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<'prompt' | 'suggestion'>('prompt');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isReady) {
      setVisible(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 8000);

    return () => window.clearTimeout(timer);
  }, [isReady]);

  const createContextPayload = () => {
    const elapsed = readyTimestamp ? Date.now() - readyTimestamp : 0;
    return {
      timestamp: elapsed,
      userActionCount,
      storefrontSnapshot: JSON.parse(JSON.stringify(storefrontSnapshot)),
    };
  };

  const sendFeedback = (response: 'yes' | 'no') => {
    const payload = createContextPayload();
    console.log('FeedbackWidget: userFeedback', { response, ...payload });
    if (response === 'no') {
      setMode('suggestion');
    } else {
      setSubmitted(true);
    }
  };

  const handleSubmit = () => {
    const payload = createContextPayload();
    console.log('FeedbackWidget: adjustment submitted', { feedback, ...payload });
    setSubmitted(true);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="mt-6 rounded-[1.5rem] border border-slate-700/80 bg-slate-950/90 px-4 py-4 text-sm text-slate-300 shadow-lg shadow-slate-950/20">
      {submitted ? (
        <p className="text-sm text-slate-200">Thanks for your feedback — we’ll use this to improve the experience.</p>
      ) : mode === 'prompt' ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-200">Was this configuration accurate?</p>
          <div className="flex flex-wrap gap-3">
            <ButtonAtom variant="secondary" onClick={() => sendFeedback('yes')}>
              Yes
            </ButtonAtom>
            <ButtonAtom variant="subtle" onClick={() => sendFeedback('no')}>
              No
            </ButtonAtom>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-slate-200">What should we adjust?</p>
          <input
            type="text"
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="Enter a short note"
            className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/95 px-3 py-2 text-sm text-slate-100 outline-none ring-1 ring-slate-700/50 focus:border-cyan-400 focus:ring-cyan-400/20"
          />
          <div className="flex justify-end">
            <ButtonAtom variant="primary" onClick={handleSubmit} disabled={!feedback.trim()}>
              Submit
            </ButtonAtom>
          </div>
        </div>
      )}
    </div>
  );
}
