import React from 'react';
import type { AssessmentData } from '../../../types/assessment';
import { WordLimitTextarea } from '../WordLimitTextarea';
import { SignaturePad } from '../SignaturePad';
import { WORD_LIMITS } from '../../../utils/wordLimits';
import { ClipboardCheck, Calendar, Award } from 'lucide-react';

interface Props {
  data: AssessmentData;
  onChange: (updates: Partial<AssessmentData>) => void;
}

export const StandardTestsPlanSection: React.FC<Props> = ({ data, onChange }) => {
  const handleTestChange = (key: keyof typeof data.standardizationTests, val: string) => {
    onChange({
      standardizationTests: {
        ...data.standardizationTests,
        [key]: val,
      },
    });
  };

  const handleConsultantChange = (field: keyof typeof data.consultant, val: string) => {
    onChange({
      consultant: {
        ...data.consultant,
        [field]: val,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b-2 border-slate-200 pb-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-teal-800" />
          Page 8: Standardized Tests, Therapy Plan &amp; Sign-off
        </h3>
        <p className="text-xs text-slate-700 mt-0.5">
          Standardized psychometric scales (CARS, Vanderbilt, M-CHAT, GARS-2), customized occupational therapy intervention plan, and digital signature.
        </p>
      </div>

      {/* Standardized Tests Section */}
      <div className="bg-slate-50 border-2 border-slate-300 rounded p-4 sm:p-5 space-y-4">
        <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
          <Award className="w-4 h-4 text-teal-800" />
          Standardized Clinical Tests
        </h4>

        <WordLimitTextarea
          label="Administration of Standardization Tests"
          value={data.standardizationTests.administrationNote}
          onChange={(text) => handleTestChange('administrationNote', text)}
          maxWords={WORD_LIMITS.administrationNote}
          rows={2}
          placeholder="Testing environment, rapport, child cooperation, parent involvement..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WordLimitTextarea
            label="CARS (Childhood Autism Rating Scale)"
            value={data.standardizationTests.cars}
            onChange={(text) => handleTestChange('cars', text)}
            maxWords={WORD_LIMITS.standardTestItem}
            rows={2}
            placeholder="Score, severity classification, prominent behavioral domains..."
          />

          <WordLimitTextarea
            label="VANDERBILT'S ADHD SCALE"
            value={data.standardizationTests.vanderbiltScale}
            onChange={(text) => handleTestChange('vanderbiltScale', text)}
            maxWords={WORD_LIMITS.standardTestItem}
            rows={2}
            placeholder="Parent & teacher inattention / hyperactivity scores..."
          />

          <WordLimitTextarea
            label="M-CHAT (Modified Checklist for Autism in Toddlers)"
            value={data.standardizationTests.mChat}
            onChange={(text) => handleTestChange('mChat', text)}
            maxWords={WORD_LIMITS.standardTestItem}
            rows={2}
            placeholder="Risk score (Low / Medium / High), critical failed items..."
          />

          <WordLimitTextarea
            label="GARS-2 (Gilliam Autism Rating Scale)"
            value={data.standardizationTests.gars2}
            onChange={(text) => handleTestChange('gars2', text)}
            maxWords={WORD_LIMITS.standardTestItem}
            rows={2}
            placeholder="Autism Index, probability percentiles, subscale scores..."
          />
        </div>
      </div>

      {/* Therapy Plan */}
      <div className="bg-white border-2 border-teal-800 rounded p-4 sm:p-5 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-teal-950 uppercase tracking-wide flex items-center gap-1.5">
            <ClipboardCheck className="w-4 h-4 text-teal-800" />
            Therapy Plan
          </h4>
          <span className="text-xs text-teal-900 bg-teal-100 px-2.5 py-0.5 rounded border border-teal-300 font-bold">
            Recommended Clinical Protocol
          </span>
        </div>

        <WordLimitTextarea
          label="Intervention Goals & Therapeutic Strategy"
          value={data.standardizationTests.therapyPlan}
          onChange={(text) => handleTestChange('therapyPlan', text)}
          maxWords={WORD_LIMITS.therapyPlan}
          rows={5}
          placeholder="1. Sensory Integration therapy goals...&#10;2. Fine motor and handwriting remediation...&#10;3. Activities of Daily Living (ADL) independence...&#10;4. Visual schedule & communication support..."
        />
      </div>

      {/* Consultant Signature & Metadata */}
      <div className="bg-slate-50 border-2 border-slate-300 rounded p-4 sm:p-5 space-y-4">
        <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
          Consultant &amp; Sign-off Details
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase mb-1">
              Consultant Full Name
            </label>
            <input
              type="text"
              value={data.consultant.name}
              onChange={(e) => handleConsultantChange('name', e.target.value)}
              placeholder="Dr. S. VENKATESAN, BOT"
              className="w-full px-3 py-2 rounded border border-slate-300 focus:border-teal-700 text-sm text-slate-900 bg-white font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase mb-1">
              Designation (Mandatory)
            </label>
            <input
              type="text"
              value={data.consultant.qualification || 'Peadiatric Occupational Therapist'}
              onChange={(e) => handleConsultantChange('qualification', e.target.value)}
              placeholder="Peadiatric Occupational Therapist"
              className="w-full px-3 py-2 rounded border border-slate-300 focus:border-teal-700 text-sm text-slate-900 bg-slate-100 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase mb-1">
              Role / Title
            </label>
            <input
              type="text"
              value={data.consultant.designation}
              onChange={(e) => handleConsultantChange('designation', e.target.value)}
              placeholder="Founder &amp; Peadiatric Occupational Therapist"
              className="w-full px-3 py-2 rounded border border-slate-300 focus:border-teal-700 text-sm text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-700" />
              Sign-off Date
            </label>
            <input
              type="date"
              value={data.consultant.date}
              onChange={(e) => handleConsultantChange('date', e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-300 focus:border-teal-700 text-sm text-slate-900 bg-white"
            />
          </div>
        </div>

        {/* Digital Signature Pad */}
        <SignaturePad
          signatureImage={data.consultant.signatureImage}
          onSave={(dataUrl) => handleConsultantChange('signatureImage', dataUrl)}
          consultantName={data.consultant.name}
        />
      </div>
    </div>
  );
};
