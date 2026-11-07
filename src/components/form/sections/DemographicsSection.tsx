import React from 'react';
import type { AssessmentData } from '../../../types/assessment';
import { WordLimitTextarea } from '../WordLimitTextarea';
import { PhotoUploader } from '../PhotoUploader';
import { WORD_LIMITS } from '../../../utils/wordLimits';
import { User, Calendar, MapPin, Activity, Stethoscope } from 'lucide-react';

interface Props {
  data: AssessmentData;
  onChange: (updates: Partial<AssessmentData>) => void;
}

export const DemographicsSection: React.FC<Props> = ({ data, onChange }) => {
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
        <div>
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

        <div>
          <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase mb-1">
            Age / Sex <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={data.ageSex}
            onChange={(e) => onChange({ ageSex: e.target.value })}
            placeholder="e.g. 4 Years 6 Months / Male"
            className="w-full px-3 py-2 rounded border border-slate-300 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 text-sm text-slate-900 bg-white"
          />
        </div>

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

        <div>
          <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase mb-1 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-slate-700" />
            Provisional / Clinical Diagnosis
          </label>
          <input
            type="text"
            value={data.diagnosis}
            onChange={(e) => onChange({ diagnosis: e.target.value })}
            placeholder="e.g. Autism Spectrum Disorder (Level 2)"
            className="w-full px-3 py-2 rounded border border-slate-300 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 text-sm text-slate-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase mb-1 flex items-center gap-1">
            <Stethoscope className="w-3.5 h-3.5 text-slate-700" />
            Referred By (Reference)
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

      {/* Chief Complaints */}
      <div className="pt-2">
        <WordLimitTextarea
          label="Chief Complaints"
          value={data.chiefComplaints}
          onChange={(text) => onChange({ chiefComplaints: text })}
          maxWords={WORD_LIMITS.chiefComplaints}
          rows={3}
          placeholder="State the primary concerns, reason for assessment, sensory/behavioral challenges reported by parents..."
        />
      </div>

      {/* Birth History */}
      <div className="bg-slate-50 border-2 border-slate-300 rounded p-4 sm:p-5 space-y-4">
        <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
          Birth History
        </h4>

        <WordLimitTextarea
          label="Prenatal"
          value={data.birthHistory.prenatal}
          onChange={(text) =>
            onChange({
              birthHistory: { ...data.birthHistory, prenatal: text },
            })
          }
          maxWords={WORD_LIMITS.prenatal}
          rows={2}
          placeholder="Maternal health, term of gestation, scans, medications..."
        />

        <WordLimitTextarea
          label="Perinatal"
          value={data.birthHistory.perinatal}
          onChange={(text) =>
            onChange({
              birthHistory: { ...data.birthHistory, perinatal: text },
            })
          }
          maxWords={WORD_LIMITS.perinatal}
          rows={2}
          placeholder="Mode of delivery (vaginal/caesarean), birth weight, cry at birth, complications..."
        />

        <WordLimitTextarea
          label="Postnatal"
          value={data.birthHistory.postnatal}
          onChange={(text) =>
            onChange({
              birthHistory: { ...data.birthHistory, postnatal: text },
            })
          }
          maxWords={WORD_LIMITS.postnatal}
          rows={2}
          placeholder="Neonatal jaundice, NICU stay, milestones, immunization..."
        />
      </div>
    </div>
  );
};
