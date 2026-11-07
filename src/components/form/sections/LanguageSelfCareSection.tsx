import React from 'react';
import type { AssessmentData } from '../../../types/assessment';
import { MessageSquare, HeartHandshake, Sparkles } from 'lucide-react';

interface Props {
  data: AssessmentData;
  onChange: (updates: Partial<AssessmentData>) => void;
}

export const LanguageSelfCareSection: React.FC<Props> = ({ data, onChange }) => {
  const handleSocialContChange = (key: keyof typeof data.socialEmotionalSkills, val: boolean) => {
    onChange({
      socialEmotionalSkills: {
        ...data.socialEmotionalSkills,
        [key]: val,
      },
    });
  };

  const handleExpressiveChange = (key: keyof typeof data.communicationAndLanguagesSkills.expressive, val: boolean) => {
    onChange({
      communicationAndLanguagesSkills: {
        ...data.communicationAndLanguagesSkills,
        expressive: {
          ...data.communicationAndLanguagesSkills.expressive,
          [key]: val,
        },
      },
    });
  };

  const handleReceptiveChange = (key: keyof typeof data.communicationAndLanguagesSkills.receptive, val: boolean) => {
    onChange({
      communicationAndLanguagesSkills: {
        ...data.communicationAndLanguagesSkills,
        receptive: {
          ...data.communicationAndLanguagesSkills.receptive,
          [key]: val,
        },
      },
    });
  };

  const handleSelfCareChange = (key: keyof typeof data.selfCare, val: string) => {
    onChange({
      selfCare: {
        ...data.selfCare,
        [key]: val,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b-2 border-slate-200 pb-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-teal-800" />
          Page 6: Social Integration, Communication &amp; Self Care (ADL)
        </h3>
        <p className="text-xs text-slate-700 mt-0.5">
          Peer relations, expressive and receptive language abilities, and Activities of Daily Living (ADL).
        </p>
      </div>

      {/* Social Emotional Skills Continued */}
      <div className="bg-white border-2 border-slate-300 rounded p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b-2 border-slate-200">
          <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-teal-800" />
            Social Emotional Skills (Continued)
          </h4>
          <span className="text-[11px] text-slate-700 font-bold">6 Items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { key: 'respondsInSocialSituations', label: 'Responds appropriately in social situations' },
            { key: 'separatesFromParents', label: 'Separates from parents in familiar surroundings' },
            { key: 'triesToMakePeerRelationship', label: 'Tries to make peer relationship' },
            { key: 'expressesNeedsAppropriateWords', label: 'Expresses needs through appropriate words' },
            { key: 'sharesThingsAndBelonging', label: 'Shares things and belonging' },
            { key: 'takesTurnsWaits', label: 'Takes turns and waits for his / her turn' },
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
                  onChange={(e) => handleSocialContChange(item.key as any, e.target.checked)}
                  className="w-4 h-4 text-teal-800 rounded border-slate-400 ml-2 shrink-0"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Communication and Languages Skills */}
      <div className="bg-white border-2 border-slate-300 rounded p-4 sm:p-5 space-y-5">
        <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-teal-800" />
          Communication and Languages Skills
        </h4>

        {/* Expressive */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-900 uppercase">Expressive :</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { key: 'namesCommonObject', label: 'Names common object' },
              { key: 'names2to6Pictures', label: 'Names 2-6 pictures in pictures book' },
              { key: 'usesMonoBiSyllablesSentences', label: 'Uses mono syllables, bisyllables 2 or 3 word sentences' },
              { key: 'gesturesPoints', label: 'Gestures, points' },
            ].map((item) => {
              const checked = data.communicationAndLanguagesSkills.expressive[item.key as keyof typeof data.communicationAndLanguagesSkills.expressive];
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
                    onChange={(e) => handleExpressiveChange(item.key as any, e.target.checked)}
                    className="w-4 h-4 text-teal-800 rounded border-slate-400 ml-2 shrink-0"
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Receptive */}
        <div className="space-y-2 pt-2 border-t-2 border-slate-200">
          <div className="text-xs font-bold text-slate-900 uppercase">Receptive :</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { key: 'understandsSingleOr2StepCommands', label: 'Understands single or 2 step commands' },
              { key: 'understandGestures', label: 'Understand gestures' },
              { key: 'respondsToYesNo', label: 'Responds to yes / no' },
              { key: 'respondsToWhoWhereQuestions', label: 'Responds to who, where questions' },
            ].map((item) => {
              const checked = data.communicationAndLanguagesSkills.receptive[item.key as keyof typeof data.communicationAndLanguagesSkills.receptive];
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
                    onChange={(e) => handleReceptiveChange(item.key as any, e.target.checked)}
                    className="w-4 h-4 text-teal-800 rounded border-slate-400 ml-2 shrink-0"
                  />
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Self Care (ADL) */}
      <div className="bg-slate-50 border-2 border-slate-300 rounded p-4 sm:p-5 space-y-4">
        <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-teal-800" />
          Self Care (Activities of Daily Living)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {[
            { key: 'toileting', label: 'Toileting', placeholder: 'Bladder/bowel control, awareness, independence level...' },
            { key: 'eating', label: 'Eating', placeholder: 'Finger feeding, spoon usage, chewing, food texture aversion...' },
            { key: 'grooming', label: 'Grooming', placeholder: 'Teeth brushing, hand washing, face washing tolerance...' },
            { key: 'donningDoffingDress', label: 'Donning and doffing dress', placeholder: 'Removes/wears clothes, buttons, zippers, fasteners...' },
            { key: 'bathing', label: 'Bathing', placeholder: 'Water tolerance, scrubbing, drying, parent assistance needed...' },
            { key: 'puttingOnShoesSandals', label: 'Putting on shoes / sandals', placeholder: 'Velcro sandals, shoe orientation, tying laces...' },
          ].map((item) => (
            <div key={item.key}>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                {item.label}
              </label>
              <input
                type="text"
                value={data.selfCare[item.key as keyof typeof data.selfCare]}
                onChange={(e) => handleSelfCareChange(item.key as any, e.target.value)}
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
