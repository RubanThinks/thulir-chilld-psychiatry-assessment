import React from 'react';
import type { AssessmentData, GrossMotorSkillItem } from '../../../types/assessment';
import { Activity, Hand, Check, AlertCircle } from 'lucide-react';

interface Props {
  data: AssessmentData;
  onChange: (updates: Partial<AssessmentData>) => void;
}

export const MotorSkillsSection: React.FC<Props> = ({ data, onChange }) => {
  const handleGrossMotorChange = (id: string, updates: Partial<GrossMotorSkillItem>) => {
    const updated = data.onExamination.grossMotorSkills.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    onChange({
      onExamination: {
        ...data.onExamination,
        grossMotorSkills: updated,
      },
    });
  };

  const handleFineMotorChange = (field: keyof typeof data.onExamination.fineMotorSkills, value: any) => {
    onChange({
      onExamination: {
        ...data.onExamination,
        fineMotorSkills: {
          ...data.onExamination.fineMotorSkills,
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b-2 border-slate-200 pb-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-800" />
          Page 3: On Examination (Gross &amp; Fine Motor Skills)
        </h3>
        <p className="text-xs text-slate-700 mt-0.5">
          Evaluate 11 gross motor milestones and 10 occupational fine motor grasp &amp; manipulation competencies.
        </p>
      </div>

      {/* Gross Motor Skills Section */}
      <div className="bg-white border-2 border-slate-300 rounded overflow-hidden">
        <div className="bg-slate-100 px-4 py-3 border-b-2 border-slate-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
              Gross Motor Skills Evaluation
            </h4>
            <p className="text-xs text-slate-700">
              Rate each motor milestone. When marked "Inappropriate", describe the clinical deficit.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                const updated = data.onExamination.grossMotorSkills.map((item) => ({
                  ...item,
                  rating: 'Age appropriate' as const,
                  specify: '',
                }));
                onChange({
                  onExamination: { ...data.onExamination, grossMotorSkills: updated },
                });
              }}
              className="text-teal-900 hover:text-white bg-white hover:bg-teal-800 px-2.5 py-1 rounded border border-slate-400 transition-none font-bold"
            >
              Mark All Appropriate
            </button>
          </div>
        </div>

        <div className="divide-y border-slate-300">
          {data.onExamination.grossMotorSkills.map((item) => (
            <div
              key={item.id}
              className={`p-3 sm:p-4 ${
                item.rating === 'Inappropriate' ? 'bg-amber-50' : 'bg-white'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="md:w-1/3">
                  <div className="font-bold text-sm text-slate-900">{item.name}</div>
                  {item.sublabel && (
                    <div className="text-xs text-slate-700 font-medium">{item.sublabel}</div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleGrossMotorChange(item.id, {
                        rating: item.rating === 'Age appropriate' ? '' : 'Age appropriate',
                        specify: item.rating === 'Age appropriate' ? item.specify : '',
                      })
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold border transition-none ${
                      item.rating === 'Age appropriate'
                        ? 'bg-emerald-800 text-white border-emerald-900'
                        : 'bg-white text-slate-900 border-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    Age appropriate
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleGrossMotorChange(item.id, {
                        rating: item.rating === 'Inappropriate' ? '' : 'Inappropriate',
                      })
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold border transition-none ${
                      item.rating === 'Inappropriate'
                        ? 'bg-amber-700 text-white border-amber-800'
                        : 'bg-white text-slate-900 border-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Inappropriate
                  </button>
                </div>

                <div className="flex-1 md:max-w-xs">
                  <input
                    type="text"
                    value={item.specify}
                    onChange={(e) => handleGrossMotorChange(item.id, { specify: e.target.value })}
                    placeholder={
                      item.rating === 'Inappropriate'
                        ? 'Specify deficit / prompt needed...'
                        : 'Observations (optional)...'
                    }
                    className={`w-full text-xs px-3 py-1.5 rounded border focus:outline-none text-slate-900 ${
                      item.rating === 'Inappropriate'
                        ? 'border-amber-400 bg-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fine Motor Skills Section */}
      <div className="bg-slate-50 border-2 border-slate-300 rounded p-4 sm:p-5 space-y-4">
        <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
          <Hand className="w-4 h-4 text-teal-800" />
          Fine Motor Skills
        </h4>

        {/* Hand Dominance */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-3 text-xs font-bold text-slate-900 uppercase">
            Hand Dominance :
          </div>
          <div className="sm:col-span-9 flex items-center gap-4">
            {(['Right', 'Left', 'Mixed'] as const).map((opt) => (
              <label key={opt} className="inline-flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-900">
                <input
                  type="radio"
                  name="handDominance"
                  checked={data.onExamination.fineMotorSkills.handDominance === opt}
                  onChange={() => handleFineMotorChange('handDominance', opt)}
                  className="w-4 h-4 text-teal-800 border-slate-400"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* 9 Specific Fine Motor Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {[
            { key: 'inHandManipulation', label: 'In-hand manipulation', placeholder: 'e.g. Finger-to-palm, palm-to-finger translation...' },
            { key: 'rotation', label: 'Rotation', placeholder: 'e.g. Simple vs complex rotation with small objects...' },
            { key: 'shift', label: 'Shift', placeholder: 'e.g. Moving fingers along pencil shaft...' },
            { key: 'translation', label: 'Translation', placeholder: 'e.g. Picking coins from palm to fingertips...' },
            { key: 'scissorSkills', label: 'Scissor skills', placeholder: 'e.g. Snips paper, cuts straight line, cuts circle...' },
            { key: 'dexterityPins', label: 'Dexterity pins', placeholder: 'e.g. Pincer grasp on pegboard, 2-point vs 3-point...' },
            { key: 'pickingUpObjectsWithTweezers', label: 'Picking up objects with tweezers', placeholder: 'e.g. Jumbo tweezers grasp, wrist stability...' },
            { key: 'threadingBeads', label: 'Threading beads', placeholder: 'e.g. Large wooden beads, lace handling, bilateral use...' },
            { key: 'paperFolding', label: 'Paper folding', placeholder: 'e.g. Creasing paper in half, diagonal folding...' },
          ].map((item) => (
            <div key={item.key}>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                {item.label}
              </label>
              <input
                type="text"
                value={data.onExamination.fineMotorSkills[item.key as keyof typeof data.onExamination.fineMotorSkills] as string}
                onChange={(e) => handleFineMotorChange(item.key as any, e.target.value)}
                placeholder={item.placeholder}
                className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs text-slate-900 bg-white"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
