import React from 'react';
import type { AssessmentData } from '../../../types/assessment';
import { WordLimitTextarea } from '../WordLimitTextarea';
import { WORD_LIMITS } from '../../../utils/wordLimits';
import { Activity, Radio, Gamepad2, AlertTriangle } from 'lucide-react';

interface Props {
  data: AssessmentData;
  onChange: (updates: Partial<AssessmentData>) => void;
}

export const SensoryAutismSection: React.FC<Props> = ({ data, onChange }) => {
  const handleSensoryChange = (id: string, status: 'Hyper sensitivity' | 'Hyposensitivity' | 'Both' | '') => {
    const updated = data.sensoryModulation.map((item) =>
      item.id === id ? { ...item, status } : item
    );
    onChange({ sensoryModulation: updated });
  };

  const handleAutisticFeatureChange = (key: keyof typeof data.autisticFeatures, val: string) => {
    onChange({
      autisticFeatures: {
        ...data.autisticFeatures,
        [key]: val,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b-2 border-slate-200 pb-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-800" />
          Page 7: Play, Sensory Modulation, Autistic &amp; ADHD Features
        </h3>
        <p className="text-xs text-slate-700 mt-0.5">
          Play patterns, sensory modulation profile (Tactile, Vestibular, Proprioception, etc.), and diagnostic symptom markers.
        </p>
      </div>

      {/* Play */}
      <div className="bg-white border-2 border-slate-300 rounded p-4 sm:p-5">
        <div className="flex items-center gap-1.5 mb-2">
          <Gamepad2 className="w-4 h-4 text-teal-800" />
          <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide">Play Profile</h4>
        </div>
        <WordLimitTextarea
          label="Play"
          value={data.play}
          onChange={(text) => onChange({ play: text })}
          maxWords={WORD_LIMITS.play}
          rows={3}
          placeholder="Solitary, parallel, constructive, pretend/symbolic play preferences, toy exploration style..."
        />
      </div>

      {/* Sensory Modulation Table */}
      <div className="bg-white border-2 border-slate-300 rounded overflow-hidden">
        <div className="bg-slate-100 px-4 py-3 border-b-2 border-slate-300">
          <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-teal-800" />
            Sensory Modulation Profile
          </h4>
          <p className="text-xs text-slate-700 mt-0.5">
            Identify sensory response patterns across sensory systems.
          </p>
        </div>

        <div className="divide-y border-slate-300">
          {data.sensoryModulation.map((item) => (
            <div key={item.id} className="p-3 sm:p-4 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="sm:w-1/3">
                  <span className="font-bold text-sm text-slate-900">
                    {item.name}
                  </span>
                  {item.subname && (
                    <span className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-900 text-xs rounded font-bold">
                      {item.subname}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {(['Hyper sensitivity', 'Hyposensitivity', 'Both'] as const).map((opt) => {
                    const isSelected = item.status === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          handleSensoryChange(item.id, isSelected ? '' : opt)
                        }
                        className={`px-3 py-1.5 rounded text-xs font-bold border transition-none ${
                          isSelected
                            ? opt === 'Hyper sensitivity'
                              ? 'bg-amber-700 text-white border-amber-800'
                              : opt === 'Hyposensitivity'
                              ? 'bg-blue-800 text-white border-blue-900'
                              : 'bg-purple-800 text-white border-purple-900'
                            : 'bg-white text-slate-900 border-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Autistic Features */}
      <div className="bg-slate-50 border-2 border-slate-300 rounded p-4 sm:p-5 space-y-4">
        <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-teal-800" />
          Autistic Features
        </h4>

        <WordLimitTextarea
          label="1. Communication"
          value={data.autisticFeatures.communication}
          onChange={(text) => handleAutisticFeatureChange('communication', text)}
          maxWords={WORD_LIMITS.autisticFeatureItem}
          rows={2}
          placeholder="Non-verbal/verbal communication, gestures, echolalia, conversational turn-taking..."
        />

        <WordLimitTextarea
          label="2. Stereotype"
          value={data.autisticFeatures.stereotype}
          onChange={(text) => handleAutisticFeatureChange('stereotype', text)}
          maxWords={WORD_LIMITS.autisticFeatureItem}
          rows={2}
          placeholder="Repetitive movements, hand flapping, spinning, adherence to strict routines..."
        />

        <WordLimitTextarea
          label="3. Socialization"
          value={data.autisticFeatures.socialization}
          onChange={(text) => handleAutisticFeatureChange('socialization', text)}
          maxWords={WORD_LIMITS.autisticFeatureItem}
          rows={2}
          placeholder="Joint attention, peer interaction, response to name, social smile..."
        />
      </div>

      {/* ADHD Features */}
      <div className="bg-slate-50 border-2 border-slate-300 rounded p-4 sm:p-5 space-y-3">
        <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
          ADHD Features
        </h4>
        <WordLimitTextarea
          label="ADHD Features (Attention, Hyperactivity, Impulsivity)"
          value={data.adhdFeatures}
          onChange={(text) => onChange({ adhdFeatures: text })}
          maxWords={WORD_LIMITS.adhdFeatures}
          rows={3}
          placeholder="Inattention duration, motor restlessness, impulsivity during structured tasks..."
        />
      </div>
    </div>
  );
};
