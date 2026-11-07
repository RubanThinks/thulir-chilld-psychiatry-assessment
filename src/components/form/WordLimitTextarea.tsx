import React from 'react';
import { countWords } from '../../utils/wordLimits';

interface WordLimitTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxWords: number;
  placeholder?: string;
  rows?: number;
  helperText?: string;
  required?: boolean;
}

export const WordLimitTextarea: React.FC<WordLimitTextareaProps> = ({
  label,
  value,
  onChange,
  maxWords,
  placeholder,
  rows = 3,
  helperText,
  required = false,
}) => {
  const currentWords = countWords(value);
  const isOverLimit = currentWords > maxWords;
  const isNearLimit = currentWords >= maxWords * 0.85 && !isOverLimit;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-900 tracking-wide uppercase">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        <span
          className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
            isOverLimit
              ? 'bg-red-100 text-red-900 border-red-400 font-bold'
              : isNearLimit
              ? 'bg-amber-100 text-amber-900 border-amber-400'
              : 'bg-slate-100 text-slate-800 border-slate-300'
          }`}
        >
          {currentWords} / {maxWords} words
        </span>
      </div>

      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || `Enter observations or notes (up to ${maxWords} words)...`}
        className={`w-full rounded-md border text-sm p-3 transition-none focus:outline-none focus:ring-2 resize-y bg-white text-slate-900 font-normal ${
          isOverLimit
            ? 'border-red-500 focus:ring-red-400 focus:border-red-600 bg-red-50'
            : 'border-slate-300 hover:border-slate-400 focus:border-teal-700 focus:ring-teal-700'
        }`}
      />

      <div className="flex justify-between items-center text-[12px]">
        {helperText && <p className="text-slate-700">{helperText}</p>}
        {isOverLimit && (
          <p className="text-red-700 font-bold ml-auto">
            Exceeds recommended printable box capacity by {currentWords - maxWords} words.
          </p>
        )}
      </div>
    </div>
  );
};
