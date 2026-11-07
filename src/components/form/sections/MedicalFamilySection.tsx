import React, { useRef, useState } from 'react';
import type { AssessmentData } from '../../../types/assessment';
import { WordLimitTextarea } from '../WordLimitTextarea';
import { WORD_LIMITS } from '../../../utils/wordLimits';
import { FileText, Users, GraduationCap, Eye, Upload, Trash2, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '../../../services/cloudinary';

interface Props {
  data: AssessmentData;
  onChange: (updates: Partial<AssessmentData>) => void;
}

export const MedicalFamilySection: React.FC<Props> = ({ data, onChange }) => {
  const familyTreeFileRef = useRef<HTMLInputElement>(null);
  const [isUploadingTree, setIsUploadingTree] = useState(false);

  const handleFamilyTreeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingTree(true);
    try {
      const cloudUrl = await uploadToCloudinary(file, { folder: 'thulir_family_trees' });
      onChange({
        familyHistory: {
          ...data.familyHistory,
          familyTreeImage: cloudUrl,
        },
      });
    } catch (err) {
      console.warn('Cloudinary upload fallback to local reader:', err);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onChange({
            familyHistory: {
              ...data.familyHistory,
              familyTreeImage: ev.target.result as string,
            },
          });
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingTree(false);
      if (familyTreeFileRef.current) {
        familyTreeFileRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b-2 border-slate-200 pb-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-800" />
          Page 2: Medical, Family, Educational &amp; Observation
        </h3>
        <p className="text-xs text-slate-700 mt-0.5">
          Present medical history, consanguinity, family tree, school performance, and preliminary clinical observations.
        </p>
      </div>

      {/* Present Medical History */}
      <WordLimitTextarea
        label="Present Medical History"
        value={data.presentMedicalHistory}
        onChange={(text) => onChange({ presentMedicalHistory: text })}
        maxWords={WORD_LIMITS.presentMedicalHistory}
        rows={4}
        placeholder="Past investigations (BERA, EEG, MRI), medical diagnoses, medication history, allergies, hospitalizations..."
      />

      {/* Family History Card */}
      <div className="bg-slate-50 border-2 border-slate-300 rounded p-4 sm:p-5 space-y-4">
        <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
          <Users className="w-4 h-4 text-teal-800" />
          Family History
        </h4>

        {/* Family Tree notes & image upload */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 tracking-wide uppercase">
              Family Tree / Pedigree
            </label>
            <input
              type="file"
              ref={familyTreeFileRef}
              onChange={handleFamilyTreeUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => familyTreeFileRef.current?.click()}
              disabled={isUploadingTree}
              className="inline-flex items-center gap-1 text-xs text-teal-900 font-bold bg-white hover:bg-slate-100 disabled:opacity-60 px-2.5 py-1 rounded border border-slate-400 transition-none"
            >
              {isUploadingTree ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Uploading to Cloud...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-slate-700" />
                  Upload Family Tree Diagram
                </>
              )}
            </button>
          </div>

          {data.familyHistory.familyTreeImage && (
            <div className="flex items-center gap-3 p-2 bg-white rounded border border-slate-300">
              <img
                src={data.familyHistory.familyTreeImage}
                alt="Family tree"
                className="h-16 w-24 object-contain rounded border border-slate-300"
              />
              <div className="flex-1 text-xs text-slate-800 font-medium">
                Uploaded family tree diagram will appear on Page 2 report.
              </div>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    familyHistory: { ...data.familyHistory, familyTreeImage: '' },
                  })
                }
                className="p-1.5 text-red-700 hover:bg-red-50 rounded border border-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          <input
            type="text"
            value={data.familyHistory.familyTree}
            onChange={(e) =>
              onChange({
                familyHistory: { ...data.familyHistory, familyTree: e.target.value },
              })
            }
            placeholder="e.g. Nuclear family, single child, non-consanguineous marriage..."
            className="w-full px-3 py-2 rounded border border-slate-300 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 text-sm text-slate-900 bg-white"
          />
        </div>

        {/* Consanguinity */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-2">
          <div className="sm:col-span-3 text-xs font-bold text-slate-900 uppercase">
            Consanguinity :
          </div>
          <div className="sm:col-span-3 flex items-center gap-4">
            {(['Yes', 'No'] as const).map((opt) => (
              <label key={opt} className="inline-flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-900">
                <input
                  type="radio"
                  name="consanguinity"
                  checked={data.familyHistory.consanguinity === opt}
                  onChange={() =>
                    onChange({
                      familyHistory: { ...data.familyHistory, consanguinity: opt },
                    })
                  }
                  className="w-4 h-4 text-teal-800 border-slate-400"
                />
                {opt}
              </label>
            ))}
          </div>
          <div className="sm:col-span-6">
            <input
              type="text"
              value={data.familyHistory.consanguinityDetails}
              onChange={(e) =>
                onChange({
                  familyHistory: { ...data.familyHistory, consanguinityDetails: e.target.value },
                })
              }
              placeholder="If yes, specify degree (e.g. 2nd degree, maternal uncle)..."
              disabled={data.familyHistory.consanguinity !== 'Yes'}
              className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 disabled:bg-slate-200 disabled:text-slate-500 bg-white"
            />
          </div>
        </div>

        {/* Specific family history of relevant illness */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-2">
          <div className="sm:col-span-4 text-xs font-bold text-slate-900 uppercase">
            History of Relevant Illness :
          </div>
          <div className="sm:col-span-3 flex items-center gap-4">
            {(['Yes', 'No'] as const).map((opt) => (
              <label key={opt} className="inline-flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-900">
                <input
                  type="radio"
                  name="specificIllness"
                  checked={data.familyHistory.specificIllness === opt}
                  onChange={() =>
                    onChange({
                      familyHistory: { ...data.familyHistory, specificIllness: opt },
                    })
                  }
                  className="w-4 h-4 text-teal-800 border-slate-400"
                />
                {opt}
              </label>
            ))}
          </div>
          <div className="sm:col-span-5">
            <input
              type="text"
              value={data.familyHistory.specificIllnessDetails}
              onChange={(e) =>
                onChange({
                  familyHistory: { ...data.familyHistory, specificIllnessDetails: e.target.value },
                })
              }
              placeholder="If yes, specify (e.g. speech delay, psychiatric, seizures)..."
              disabled={data.familyHistory.specificIllness !== 'Yes'}
              className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 disabled:bg-slate-200 disabled:text-slate-500 bg-white"
            />
          </div>
        </div>

        {/* Economic Status */}
        <div className="pt-2">
          <div className="text-xs font-bold text-slate-900 uppercase mb-2">
            Economic Status :
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'UC', label: 'UC (Upper Class)' },
              { id: 'UMC', label: 'UMC (Upper Middle Class)' },
              { id: 'LMC', label: 'LMC (Lower Middle Class)' },
              { id: 'LC', label: 'LC (Lower Class)' },
            ].map((item) => {
              const isSelected = data.familyHistory.economicStatus === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    onChange({
                      familyHistory: {
                        ...data.familyHistory,
                        economicStatus: item.id as any,
                      },
                    })
                  }
                  className={`py-2 px-3 rounded text-xs font-bold text-center border transition-none ${
                    isSelected
                      ? 'border-teal-900 bg-teal-800 text-white'
                      : 'border-slate-400 bg-white hover:bg-slate-100 text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Educational History */}
      <div className="bg-slate-50 border-2 border-slate-300 rounded p-4 sm:p-5 space-y-4">
        <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-teal-800" />
          Educational History
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase mb-1">
              Type of School
            </label>
            <input
              type="text"
              value={data.educationalHistory.typeOfSchool}
              onChange={(e) =>
                onChange({
                  educationalHistory: { ...data.educationalHistory, typeOfSchool: e.target.value },
                })
              }
              placeholder="e.g. Regular Pre-KG / Special School / Home-based"
              className="w-full px-3 py-2 rounded border border-slate-300 focus:border-teal-700 text-sm text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase mb-1">
              Age at Which Admitted
            </label>
            <input
              type="text"
              value={data.educationalHistory.ageAtWhichAdmitted}
              onChange={(e) =>
                onChange({
                  educationalHistory: { ...data.educationalHistory, ageAtWhichAdmitted: e.target.value },
                })
              }
              placeholder="e.g. 3 Years 6 Months"
              className="w-full px-3 py-2 rounded border border-slate-300 focus:border-teal-700 text-sm text-slate-900 bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <WordLimitTextarea
              label="School Complaints"
              value={data.educationalHistory.complaints}
              onChange={(text) =>
                onChange({
                  educationalHistory: { ...data.educationalHistory, complaints: text },
                })
              }
              maxWords={WORD_LIMITS.schoolComplaints}
              rows={2}
              placeholder="Teacher reports, sitting tolerance, following commands, peer interaction..."
            />
          </div>

          <div className="md:col-span-2">
            <WordLimitTextarea
              label="School Performance"
              value={data.educationalHistory.performance}
              onChange={(text) =>
                onChange({
                  educationalHistory: { ...data.educationalHistory, performance: text },
                })
              }
              maxWords={WORD_LIMITS.schoolPerformance}
              rows={2}
              placeholder="Tabletop task completion, cognitive skills, artistic / athletic performance..."
            />
          </div>
        </div>
      </div>

      {/* On Observation */}
      <div className="bg-slate-50 border-2 border-slate-300 rounded p-4 sm:p-5 space-y-4">
        <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-teal-800" />
          On Clinical Observation
        </h4>

        {/* General Appearance */}
        <div>
          <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase mb-2">
            General Appearance :
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Well built', 'Moderately built', 'Thin built'] as const).map((build) => {
              const isSelected = data.onObservation.generalAppearance === build;
              return (
                <button
                  key={build}
                  type="button"
                  onClick={() =>
                    onChange({
                      onObservation: { ...data.onObservation, generalAppearance: build },
                    })
                  }
                  className={`py-2 px-3 rounded text-xs font-bold text-center border transition-none ${
                    isSelected
                      ? 'border-teal-900 bg-teal-800 text-white'
                      : 'border-slate-400 bg-white hover:bg-slate-100 text-slate-900'
                  }`}
                >
                  {build}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stereotypical behaviors */}
        <div>
          <WordLimitTextarea
            label="Stereotypical Behaviors (If Any)"
            value={data.onObservation.stereotypicalBehaviors}
            onChange={(text) =>
              onChange({
                onObservation: { ...data.onObservation, stereotypicalBehaviors: text },
              })
            }
            maxWords={WORD_LIMITS.stereotypicalBehaviors}
            rows={2}
            placeholder="Hand flapping, rocking, spinning objects, toe-walking, vocalizations..."
          />
        </div>

        {/* Eye contact */}
        <div>
          <label className="block text-xs font-bold text-slate-900 tracking-wide uppercase mb-2">
            Eye Contact :
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(['Maintain well', "Doesn't sustain", 'Maintains partially'] as const).map((item) => {
              const isSelected = data.onObservation.eyeContact === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    onChange({
                      onObservation: { ...data.onObservation, eyeContact: item },
                    })
                  }
                  className={`py-2 px-3 rounded text-xs font-bold text-center border transition-none ${
                    isSelected
                      ? 'border-teal-900 bg-teal-800 text-white'
                      : 'border-slate-400 bg-white hover:bg-slate-100 text-slate-900'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
