import React, { useState, useMemo } from 'react';
import type { AssessmentData } from '../../../types/assessment';
import { WordLimitTextarea } from '../WordLimitTextarea';
import { PhotoUploader } from '../PhotoUploader';
import { WORD_LIMITS } from '../../../utils/wordLimits';
import {
  User,
  Calendar,
  MapPin,
  Activity,
  Stethoscope,
  Calculator,
  Edit3
} from 'lucide-react';

interface Props {
  data: AssessmentData;
  onChange: (updates: Partial<AssessmentData>) => void;
}

const YEAR_OPTIONS = Array.from({ length: 26 }, (_, i) => i.toString()); // 0 to 25
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i.toString()); // 0 to 11
const SEX_OPTIONS = ['Male', 'Female', 'Other'] as const;

export const DemographicsSection: React.FC<Props> = ({ data, onChange }) => {
  const [manualOverride, setManualOverride] = useState(false);

  // Parse existing ageSex string if structured fields are empty
  const parsedValues = useMemo(() => {
    let years = data.ageYears ?? '';
    let months = data.ageMonths ?? '';
    let sex = data.sex ?? '';

    // If structured fields aren't populated yet, parse from existing ageSex string
    if (!years && !months && !sex && data.ageSex) {
      const yearMatch = data.ageSex.match(/(\d+)\s*(?:years?|yrs?|y)/i);
      if (yearMatch) years = yearMatch[1];

      const monthMatch = data.ageSex.match(/(\d+)\s*(?:months?|mths?|m)/i);
      if (monthMatch) months = monthMatch[1];

      if (/female/i.test(data.ageSex)) sex = 'Female';
      else if (/male/i.test(data.ageSex)) sex = 'Male';
      else if (/other/i.test(data.ageSex)) sex = 'Other';
    }

    return { years, months, sex };
  }, [data.ageYears, data.ageMonths, data.sex, data.ageSex]);

  const currentYears = data.ageYears !== undefined ? data.ageYears : parsedValues.years;
  const currentMonths = data.ageMonths !== undefined ? data.ageMonths : parsedValues.months;
  const currentSex = data.sex !== undefined ? data.sex : parsedValues.sex;

  const handleUpdateAgeSex = (newYears: string, newMonths: string, newSex: string) => {
    const ageParts: string[] = [];
    if (newYears !== '' && newYears !== undefined) {
      ageParts.push(`${newYears} Year${newYears === '1' ? '' : 's'}`);
    }
    if (newMonths !== '' && newMonths !== undefined && (newMonths !== '0' || !newYears)) {
      ageParts.push(`${newMonths} Month${newMonths === '1' ? '' : 's'}`);
    }

    const ageStr = ageParts.join(' ');
    let formatted = '';
    if (ageStr && newSex) {
      formatted = `${ageStr} / ${newSex}`;
    } else if (ageStr) {
      formatted = ageStr;
    } else if (newSex) {
      formatted = newSex;
    }

    onChange({
      ageYears: newYears,
      ageMonths: newMonths,
      sex: newSex,
      ageSex: formatted,
    });
  };

  const handleCalculateFromDob = () => {
    if (!data.dob) {
      alert('Please enter a Date of Birth (DOB) first.');
      return;
    }
    const birthDate = new Date(data.dob);
    const evalDate = data.doe ? new Date(data.doe) : new Date();
    if (isNaN(birthDate.getTime()) || isNaN(evalDate.getTime())) return;

    let yrs = evalDate.getFullYear() - birthDate.getFullYear();
    let mths = evalDate.getMonth() - birthDate.getMonth();
    if (evalDate.getDate() < birthDate.getDate()) {
      mths--;
    }
    if (mths < 0) {
      yrs--;
      mths += 12;
    }
    if (yrs < 0) {
      alert('Date of Birth cannot be after Date of Evaluation.');
      return;
    }

    handleUpdateAgeSex(yrs.toString(), mths.toString(), currentSex);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b-2 border-slate-200 pb-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-teal-800" />
          Page 1: Demographics &amp; Birth History
        </h3>
        <p className="text-xs text-slate-700 mt-0.5">
          Enter student identification details, passport photo, referral diagnosis, chief complaints, and developmental birth history.
        </p>
      </div>

      {/* Photo Uploader */}
      <PhotoUploader
        photoUrl={data.studentPhoto}
        onChange={(url) => onChange({ studentPhoto: url })}
      />

      {/* Primary Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Student Full Name */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase mb-1">
            Student Full Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g. Aarav Krishnan"
            className="w-full px-3 py-2 rounded border border-slate-300 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 text-sm text-slate-900 bg-white"
          />
        </div>

        {/* =========================================================================
            FIELD 1: AGE (YEARS & MONTHS DROPDOWNS)
           ========================================================================= */}
        <div className="bg-slate-50 border border-slate-300 rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase">
              Student Age (Years &amp; Months) <span className="text-red-600">*</span>
            </label>
            {data.dob && (
              <button
                type="button"
                onClick={handleCalculateFromDob}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 border border-teal-300 px-2 py-0.5 rounded transition-none"
                title="Calculate exact age based on DOB and DOE"
              >
                <Calculator className="w-3 h-3 text-teal-700" />
                Calc from DOB
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Years Dropdown */}
            <div>
              <span className="block text-[11px] font-semibold text-slate-600 mb-0.5">Years</span>
              <select
                value={currentYears}
                onChange={(e) => handleUpdateAgeSex(e.target.value, currentMonths, currentSex)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 text-xs sm:text-sm text-slate-900 bg-white font-medium"
              >
                <option value="">Select Years</option>
                {YEAR_OPTIONS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr} {yr === '1' ? 'Year' : 'Years'}
                  </option>
                ))}
              </select>
            </div>

            {/* Months Dropdown */}
            <div>
              <span className="block text-[11px] font-semibold text-slate-600 mb-0.5">Months</span>
              <select
                value={currentMonths}
                onChange={(e) => handleUpdateAgeSex(currentYears, e.target.value, currentSex)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 text-xs sm:text-sm text-slate-900 bg-white font-medium"
              >
                <option value="">Select Months</option>
                {MONTH_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m} {m === '1' ? 'Month' : 'Months'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* =========================================================================
            FIELD 2: SEX / GENDER (DROPDOWN + RADIO BUTTONS)
           ========================================================================= */}
        <div className="bg-slate-50 border border-slate-300 rounded p-3 space-y-2">
          <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase">
            Student Sex / Gender <span className="text-red-600">*</span>
          </label>

          {/* Radio Buttons for fast 1-click selection */}
          <div className="grid grid-cols-3 gap-1.5">
            {SEX_OPTIONS.map((option) => {
              const isSelected = currentSex === option;
              return (
                <label
                  key={option}
                  className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded border text-xs font-bold cursor-pointer transition-none select-none ${
                    isSelected
                      ? 'bg-teal-800 text-white border-teal-900 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="student-sex-radio"
                    value={option}
                    checked={isSelected}
                    onChange={() => handleUpdateAgeSex(currentYears, currentMonths, option)}
                    className="sr-only"
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>

          {/* Complementary Dropdown Selector */}
          <div>
            <select
              value={currentSex}
              onChange={(e) => handleUpdateAgeSex(currentYears, currentMonths, e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 text-xs sm:text-sm text-slate-900 bg-white font-medium"
            >
              <option value="">Select Sex from Dropdown...</option>
              {SEX_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Combined Live Banner & Manual Edit Toggle */}
        <div className="md:col-span-2 bg-teal-50/70 border border-teal-200 rounded px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-950 uppercase tracking-wide">
              Document Display Banner:
            </span>
            <span className="text-xs font-bold text-teal-900 bg-white px-2 py-0.5 rounded border border-teal-300 font-mono">
              {data.ageSex || 'Not specified yet'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setManualOverride(!manualOverride)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-900 hover:underline self-start sm:self-auto"
          >
            <Edit3 className="w-3 h-3" />
            {manualOverride ? 'Hide Custom Text' : 'Edit Banner Text Manually'}
          </button>
        </div>

        {/* Optional Manual Text Override Field */}
        {manualOverride && (
          <div className="md:col-span-2 bg-white border border-slate-300 rounded p-3">
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Custom Age / Sex Text (Direct Manual Override)
            </label>
            <input
              type="text"
              value={data.ageSex}
              onChange={(e) => onChange({ ageSex: e.target.value })}
              placeholder="e.g. 4 Years 6 Months / Male"
              className="w-full px-3 py-2 rounded border border-slate-300 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 text-sm text-slate-900 bg-white"
            />
            <p className="text-[11px] text-slate-600 mt-1">
              This text string is printed directly on Page 1 of the official Thulir assessment report.
            </p>
          </div>
        )}

        {/* Date of Birth (DOB) */}
        <div>
          <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-700" />
            Date of Birth (DOB)
          </label>
          <input
            type="date"
            value={data.dob}
            onChange={(e) => onChange({ dob: e.target.value })}
            className="w-full px-3 py-2 rounded border border-slate-300 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 text-sm text-slate-900 bg-white"
          />
        </div>

        {/* Date of Evaluation (DOE) */}
        <div>
          <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-700" />
            Date of Evaluation (DOE)
          </label>
          <input
            type="date"
            value={data.doe}
            onChange={(e) => onChange({ doe: e.target.value })}
            className="w-full px-3 py-2 rounded border border-slate-300 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 text-sm text-slate-900 bg-white"
          />
        </div>

        {/* Parents / Guardians */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase mb-1">
            Parents &amp; Guardians
          </label>
          <input
            type="text"
            value={data.parentsGuardians}
            onChange={(e) => onChange({ parentsGuardians: e.target.value })}
            placeholder="e.g. Mr. R. Krishnan (Father), Mrs. Priya Krishnan (Mother)"
            className="w-full px-3 py-2 rounded border border-slate-300 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 text-sm text-slate-900 bg-white"
          />
        </div>

        {/* Residential Address */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-700" />
            Residential Address
          </label>
          <input
            type="text"
            value={data.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="e.g. No. 42, Vasanth Nagar, Ramanathapuram, Coimbatore - 641 045"
            className="w-full px-3 py-2 rounded border border-slate-300 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 text-sm text-slate-900 bg-white"
          />
        </div>

        {/* Provisional / Clinical Diagnosis */}
        <div>
          <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase mb-1 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-slate-700" />
            Provisional / Clinical Diagnosis
          </label>
          <input
            type="text"
            value={data.diagnosis}
            onChange={(e) => onChange({ diagnosis: e.target.value })}
            placeholder="e.g. Autism Spectrum Disorder (ASD Level 2)"
            className="w-full px-3 py-2 rounded border border-slate-300 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 text-sm text-slate-900 bg-white"
          />
        </div>

        {/* Reference / Referring Professional */}
        <div>
          <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase mb-1 flex items-center gap-1">
            <Stethoscope className="w-3.5 h-3.5 text-slate-700" />
            Reference (Doctor / School)
          </label>
          <input
            type="text"
            value={data.reference}
            onChange={(e) => onChange({ reference: e.target.value })}
            placeholder="e.g. Dr. M. Karthikeyan, MD (Pediatrics)"
            className="w-full px-3 py-2 rounded border border-slate-300 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 text-sm text-slate-900 bg-white"
          />
        </div>
      </div>

      {/* Chief Complaints (Word-limited clinical textarea) */}
      <div className="space-y-1">
        <WordLimitTextarea
          label="Chief Complaints & Presenting Problems"
          value={data.chiefComplaints}
          onChange={(text) => onChange({ chiefComplaints: text })}
          maxWords={WORD_LIMITS.chiefComplaints}
          placeholder="State presenting developmental, behavioral, sensory or motor concerns reported by parents or teachers..."
          rows={3}
        />
      </div>

      {/* Birth History (Prenatal, Perinatal, Postnatal) */}
      <div className="border-t border-slate-300 pt-4 space-y-4">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-teal-800" />
          Birth &amp; Developmental History
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <WordLimitTextarea
              label="a) Prenatal History"
              value={data.birthHistory.prenatal}
              onChange={(text) =>
                onChange({
                  birthHistory: { ...data.birthHistory, prenatal: text },
                })
              }
              maxWords={WORD_LIMITS.prenatal}
              placeholder="Gestation period, maternal health, medications, scans, exposure..."
              rows={4}
            />
          </div>

          <div className="space-y-1">
            <WordLimitTextarea
              label="b) Perinatal History"
              value={data.birthHistory.perinatal}
              onChange={(text) =>
                onChange({
                  birthHistory: { ...data.birthHistory, perinatal: text },
                })
              }
              maxWords={WORD_LIMITS.perinatal}
              placeholder="Delivery type (normal/LSCS), birth cry, birth weight, NICU stay..."
              rows={4}
            />
          </div>

          <div className="space-y-1">
            <WordLimitTextarea
              label="c) Postnatal History"
              value={data.birthHistory.postnatal}
              onChange={(text) =>
                onChange({
                  birthHistory: { ...data.birthHistory, postnatal: text },
                })
              }
              maxWords={WORD_LIMITS.postnatal}
              placeholder="Neonatal jaundice, seizures, fever, feeding difficulties, immunization..."
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
