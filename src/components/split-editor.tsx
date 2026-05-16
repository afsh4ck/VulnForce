"use client";
import React, { useState, useRef, useEffect } from 'react';
import { MarkdownPreview } from './markdown-preview';

export default function SplitEditor({ value, onChange }: { value: string; onChange: (s: string) => void }) {
  const [leftWidth, setLeftWidth] = useState<number>(50);
  const dragging = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const total = window.innerWidth;
      const pct = Math.min(90, Math.max(10, (e.clientX / total) * 100));
      setLeftWidth(pct);
    };
    const onUp = () => (dragging.current = false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <div className="w-full border rounded-md overflow-hidden">
      <div style={{ display: 'flex', alignItems: 'stretch', height: '320px' }}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="p-3 resize-none outline-none w-full"
          style={{ width: `${leftWidth}%`, borderRight: '1px solid rgba(0,0,0,0.06)' }}
        />
        <div
          style={{ width: '8px', cursor: 'col-resize', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}
          onMouseDown={() => (dragging.current = true)}
        >
          <div style={{ width: '2px', height: '60%', background: 'rgba(0,0,0,0.1)' }} />
        </div>
        <div style={{ width: `${100 - leftWidth}%`, padding: '12px', overflow: 'auto' }}>
          <MarkdownPreview content={value || ''} getImage={() => undefined} />
        </div>
      </div>
    </div>
  );
}
