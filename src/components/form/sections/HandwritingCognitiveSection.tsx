import React from 'react';
import type { AssessmentData } from '../../../types/assessment';
import { Edit3, Brain } from 'lucide-react';

interface Props {
  data: AssessmentData;
  onChange: (updates: Partial<AssessmentData>) => void;
}

export const HandwritingCognitiveSection: React.FC<Props> = ({ data, onChange }) => {
  const handlePreWritingChange = (field: keyof typeof data.handWritingSkills.preWriting, val: any) => {
    onChange({
      handWritingSkills: {
        ...data.handWritingSkills,
        preWriting: {
          ...data.handWritingSkills.preWriting,
          [field]: val,
        },
      },
    });
  };

  const handleWritingChange = (field: keyof typeof data.handWritingSkills.writing, val: string) => {
    onChange({
      handWritingSkills: {
        ...data.handWritingSkills,
        writing: {
          ...data.handWritingSkills.writing,
          [field]: val,
        },
      },
    });
  };

  const handleAttentionChange = (key: keyof typeof data.cognitivePerceptualSkills.attentionAndMemory, val: boolean) => {
    onChange({
      cognitivePerceptualSkills: {
        ...data.cognitivePerceptualSkills,
        attentionAndMemory: {
          ...data.cognitivePerceptualSkills.attentionAndMemory,
          [key]: val,
        },
      },
    });
  };

  const handleConceptsChange = (key: keyof typeof data.cognitivePerceptualSkills.conceptsGeneral, val: boolean) => {
    onChange({
      cognitivePerceptualSkills: {
        ...data.cognitivePerceptualSkills,
        conceptsGeneral: {
          ...data.cognitivePerceptualSkills.conceptsGeneral,
          [key]: val,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b-2 border-slate-200 pb-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-teal-800" />
          Page 4: Handwriting &amp; Cognitive Perceptual Skills
        </h3>
        <p className="text-xs text-slate-700 mt-0.5">
          Pencil grasp, pre-writing strokes, letter/number formation, attention, memory, and general conceptual understanding.
        </p>
      </div>

      {/* Handwriting Skills Card */}
      <div className="bg-slate-50 border-2 border-slate-300 rounded p-4 sm:p-5 space-y-4">
        <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
          <Edit3 className="w-4 h-4 text-teal-800" />
          Hand Writing Skills
        </h4>

        {/* Pre-writing */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-900 uppercase">Pre-writing</div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Scribbling</label>
              <input
                type="text"
                value={data.handWritingSkills.preWriting.scribbling}
                onChange={(e) => handlePreWritingChange('scribbling', e.target.value)}
                placeholder="Spontaneous, circular, controlled..."
                className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Basic figures</label>
              <input
                type="text"
                value={data.handWritingSkills.preWriting.basicFigures}
                onChange={(e) => handlePreWritingChange('basicFigures', e.target.value)}
                placeholder="Vertical, horizontal, cross, circle..."
                className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Coloring</label>
              <input
                type="text"
                value={data.handWritingSkills.preWriting.coloring}
                onChange={(e) => handlePreWritingChange('coloring', e.target.value)}
                placeholder="Boundary control, stroke consistency..."
                className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs text-slate-900 bg-white"
              />
            </div>
          </div>

          {/* Pencil grasp */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-900 uppercase mb-2">
              Pencil grasp :
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Static tripod', 'Dynamic tripod', 'Digital pronate', 'Palmer supinate'] as const).map((grasp) => {
                const isSelected = data.handWritingSkills.preWriting.pencilGrasp === grasp;
                return (
                  <button
                    key={grasp}
                    type="button"
                    onClick={() => handlePreWritingChange('pencilGrasp', grasp)}
                    className={`py-2 px-3 rounded text-xs font-bold text-center border transition-none ${
                      isSelected
                        ? 'border-teal-900 bg-teal-800 text-white'
                        : 'border-slate-400 bg-white hover:bg-slate-100 text-slate-900'
                    }`}
                  >
                    {grasp}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Writing */}
        <div className="space-y-3 pt-3 border-t-2 border-slate-200">
          <div className="text-xs font-bold text-slate-900 uppercase">Writing</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Alphabets</label>
              <input
                type="text"
                value={data.handWritingSkills.writing.alphabets}
                onChange={(e) => handleWritingChange('alphabets', e.target.value)}
                placeholder="Letter tracing, imitation, spontaneous writing..."
                className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Numbers</label>
              <input
                type="text"
                value={data.handWritingSkills.writing.numbers}
                onChange={(e) => handleWritingChange('numbers', e.target.value)}
                placeholder="Number recognition, single/double digit writing..."
                className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs text-slate-900 bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cognitive Perceptual Skills */}
      <div className="bg-white border-2 border-slate-300 rounded p-4 sm:p-5 space-y-5">
        <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
          <Brain className="w-4 h-4 text-teal-800" />
          Cognitive Perceptual Skills
        </h4>

        {/* Attention & Memory */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-1 border-b-2 border-slate-200">
            <span className="text-xs font-bold text-slate-900 uppercase">Attention &amp; Memory</span>
            <span className="text-[11px] text-slate-600 font-medium">Check milestone if achieved</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {[
              { key: 'anticipatesRhymesOrSongs', label: 'Anticipates parts of rhymes or songs' },
              { key: 'pointsToyHidden', label: 'Points to the hand in which toy is hidden' },
              { key: 'saysNurseryRhymes', label: 'Says or sings atleast 2 nursery rhymes or songs in a group or with an adult' },
              { key: 'identifiesFromPictures', label: 'Identifies from 4 or more pictures' },
              { key: 'remembersHiddenObjects', label: 'Remembers and names which is of 3 objects has been hidden' },
              { key: 'recallsPastEventStory', label: 'Recalls event in the past / story' },
            ].map((item) => {
              const checked = data.cognitivePerceptualSkills.attentionAndMemory[item.key as keyof typeof data.cognitivePerceptualSkills.attentionAndMemory];
              return (
                <label
                  key={item.key}
                  className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-none ${
                    checked
                      ? 'border-teal-700 bg-teal-50 text-slate-950 font-bold'
                      : 'border-slate-300 hover:bg-slate-50 text-slate-900'
                  }`}
                >
                  <span className="text-xs">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => handleAttentionChange(item.key as any, e.target.checked)}
                    className="w-4 h-4 text-teal-800 rounded border-slate-400 ml-3"
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Concepts : (General) */}
        <div className="space-y-2 pt-2 border-t-2 border-slate-200">
          <div className="flex items-center justify-between pb-1 border-b-2 border-slate-200">
            <span className="text-xs font-bold text-slate-900 uppercase">Concepts : (General)</span>
            <span className="text-[11px] text-slate-600 font-medium">Check milestone if achieved</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {[
              { key: 'sortsObjectsByColourFormName', label: 'Sorts objects by colour, form, name' },
              { key: 'followsDirections', label: 'Follows direction-in, out ; up / down' },
              { key: 'identifiesColorsShapes', label: 'Identifies atleast 3 colors & 2 shapes' },
              { key: 'understandsHardSoft', label: 'Understands hard/ soft' },
              { key: 'understandsBackwardForward', label: 'Understands backward/ forward' },
              { key: 'namesExamplesWithinCategory', label: 'Names examples within a category (Animals, objects in kitchen, clothes)' },
              { key: 'identifiesBodyParts', label: 'Identifies 3 - 6 body parts' },
            ].map((item) => {
              const checked = data.cognitivePerceptualSkills.conceptsGeneral[item.key as keyof typeof data.cognitivePerceptualSkills.conceptsGeneral];
              return (
                <label
                  key={item.key}
                  className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-none ${
                    checked
                      ? 'border-teal-700 bg-teal-50 text-slate-950 font-bold'
                      : 'border-slate-300 hover:bg-slate-50 text-slate-900'
                  }`}
                >
                  <span className="text-xs">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => handleConceptsChange(item.key as any, e.target.checked)}
                    className="w-4 h-4 text-teal-800 rounded border-slate-400 ml-3"
                  />
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
