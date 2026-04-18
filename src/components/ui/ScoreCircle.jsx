import React, { useEffect, useState } from 'react';

const ScoreCircle = ({ score = 0, size = 'md', showLabel = true }) => {
  const [anim, setAnim] = useState(0);

  const sizeMap = { sm: 64, md: 100, lg: 140 };
  const diameter = sizeMap[size] || sizeMap.md;
  const sw = 8;
  const r = (diameter - sw) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (anim / 100) * circ;

  useEffect(() => {
    const t = setTimeout(() => setAnim(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  const colorMap = {
    success: { s: '#10b981', t: 'text-success-600 dark:text-success-400' },
    warning: { s: '#f59e0b', t: 'text-warning-600 dark:text-warning-400' },
    danger: { s: '#f43f5e', t: 'text-danger-600 dark:text-danger-400' },
  };

  const color = score >= 70 ? colorMap.success : score >= 50 ? colorMap.warning : colorMap.danger;

  return (
    <div className='relative inline-flex items-center justify-center' style={{ width: diameter, height: diameter }}>
      <svg width={diameter} height={diameter} className='-rotate-90'>
        <defs>
          <linearGradient id='scoreGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor={color.s} />
            <stop offset='100%' stopColor={color.s} stopOpacity='0.6' />
          </linearGradient>
        </defs>
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={r}
          fill='none'
          stroke='currentColor'
          strokeWidth={sw}
          className='text-gray-200 dark:text-surface-700'
        />
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={r}
          fill='none'
          stroke='url(#scoreGradient)'
          strokeWidth={sw}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap='round'
          className='transition-all duration-1000 ease-out drop-shadow-lg'
        />
      </svg>
      {showLabel && (
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <span className={`text-3xl font-bold ${color.t}`}>{Math.round(score)}</span>
          <span className='text-xs text-gray-500 dark:text-gray-400'>%</span>
        </div>
      )}
    </div>
  );
};

export default ScoreCircle;
