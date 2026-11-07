import React from 'react';
import type { AssessmentData } from '../../../types/assessment';
import { Hash, Puzzle, Smile } from 'lucide-react';

interface Props {
  data: AssessmentData;
  onChange: (updates: Partial<AssessmentData>) => void;
}

export const NumbersSocialSection: React.FC<Props> = ({ data, onChange }) => {
  const handleSizeNumberChange = (key: keyof typeof data.sizeAndNumbers, val: boolean) => {
    onChange({
      sizeAndNumbers: {
        ...data.sizeAndNumbers,
        [key]: val,
      },
    });
  };

  const handleVisualPerceptionChange = (key: keyof typeof data.visualPerception, val: boolean) => {
    onChange({
      visualPerception: {
        ...data.visualPerception,
        [key]: val,
      },
    });
  };

  const handleSocialChange = (key: keyof typeof data.socialEmotionalSkills, val: boolean) => {
    onChange({
      socialEmotionalSkills: {
        ...data.socialEmotionalSkills,
        [key]: val,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b-2 border-slate-200 pb-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Puzzle className="w-5 h-5 text-teal-800" />
          Page 5: Size &amp; Numbers, Visual Perception &amp; Social Emotional
        </h3>
        <p className="text-xs text-slate-700 mt-0.5">
          Numerical concepts, visual-spatial puzzle construction, and social-emotional responsivity milestones.
        </p>
      </div>

      {/* Size and Numbers */}
      <div className="bg-white border-2 border-slate-300 rounded p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b-2 border-slate-200">
          <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-teal-800" />
            Size and Numbers
          </h4>
          <span className="text-[11px] text-slate-700 font-bold">8 Items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { key: 'understandBigSmall', label: 'Understand big / small' },
            { key: 'givesSelectsTwoThree', label: 'Gives / selects two and three' },
            { key: 'understandMoreLess', label: 'Understand more / less' },
            { key: 'givesOneMore', label: 'Gives one more' },
            { key: 'count10Objects', label: 'Count 10 objects in a row' },
            { key: 'givesCorrectNumberOfObjects', label: 'Gives correct number of objects when asked' },
            { key: 'tellsCorrectAge', label: 'Tells correct age' },
            { key: 'answerAddition2to10', label: 'Answer addition question involving +2 to 10' },
          ].map((item) => {
            const checked = data.sizeAndNumbers[item.key as keyof typeof data.sizeAndNumbers];
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
                  onChange={(e) => handleSizeNumberChange(item.key as any, e.target.checked)}
                  className="w-4 h-4 text-teal-800 rounded border-slate-400 ml-2 shrink-0"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Visual Perception: block design & puzzles */}
      <div className="bg-white border-2 border-slate-300 rounded p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b-2 border-slate-200">
          <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <Puzzle className="w-4 h-4 text-teal-800" />
            Visual Perception; [Block Design &amp; Puzzles]
          </h4>
          <span className="text-[11px] text-slate-700 font-bold">6 Items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { key: 'imitatesBlockTrainPatterns', label: 'Imitates block train and block patterns' },
            { key: 'copiesHorizontalBlockPatterns', label: 'Copies horizontal block patterns' },
            { key: 'placesRoundSquareTriangle', label: 'Places round, square and triangle from on form board' },
            { key: 'putsTogether2PiecePuzzles', label: 'Puts together 2 piece puzzles' },
            { key: 'completes4to5PiecePuzzles', label: 'Completes 4 to 5 piece puzzles' },
            { key: 'matchesLetterNumbersOnBoard', label: 'Matches letter and numbers on board' },
          ].map((item) => {
            const checked = data.visualPerception[item.key as keyof typeof data.visualPerception];
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
                  onChange={(e) => handleVisualPerceptionChange(item.key as any, e.target.checked)}
                  className="w-4 h-4 text-teal-800 rounded border-slate-400 ml-2 shrink-0"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Social Emotional Skills (Part 1 - Page 5) */}
      <div className="bg-white border-2 border-slate-300 rounded p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b-2 border-slate-200">
          <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <Smile className="w-4 h-4 text-teal-800" />
            Social Emotional Skills (Page 5)
          </h4>
          <span className="text-[11px] text-slate-700 font-bold">8 Items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { key: 'eyeContactSees', label: 'Eye contact [Sees]' },
            { key: 'recognizesParentsStrangers', label: 'Recognizes parents/ strangers' },
            { key: 'strangerFear', label: 'Stranger fear / on fear' },
            { key: 'attachmentToMother', label: 'Attachment to mother' },
            { key: 'respondsToOthersEmotions', label: 'Responds to others emotions' },
            { key: 'greetsFamiliarAdults', label: 'Greets familiar adults' },
            { key: 'imitatesAdults', label: 'Imitates adults [picking up, dusting]' },
            { key: 'respondsScoldedPatted', label: 'Responds appropriately when scolded / patted' },
          ].map((item) => {
            const checked = data.socialEmotionalSkills[item.key as keyof typeof data.socialEmotionalSkills];
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
                  onChange={(e) => handleSocialChange(item.key as any, e.target.checked)}
                  className="w-4 h-4 text-teal-800 rounded border-slate-400 ml-2 shrink-0"
                />
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
