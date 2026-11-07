import React, { useState, useEffect } from 'react';
import {
  Cloud,
  Download,
  Trash2,
  X,
  Loader2,
  PlusCircle,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  listCloudAssessments,
  loadAssessmentFromCloud,
  deleteAssessmentFromCloud,
  saveAssessmentToCloud,
  type CloudAssessmentSummary,
} from '../../services/firebase';
import type { AssessmentData } from '../../types/assessment';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentData: AssessmentData;
  onLoadAssessment: (data: AssessmentData, cloudDocId: string) => void;
  activeDocId: string | null;
  onDocIdChange: (id: string | null) => void;
  onSaved?: () => void;
}

export const CloudAssessmentsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentData,
  onLoadAssessment,
  activeDocId,
  onDocIdChange,
  onSaved,
}) => {
  const [assessments, setAssessments] = useState<CloudAssessmentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchAssessments = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const records = await listCloudAssessments();
      setAssessments(records);
    } catch (err: any) {
      console.error('Failed to list assessments from Firestore:', err);
      setStatusMessage({
        type: 'error',
        text: 'Could not connect to Firebase Firestore. Please check your network connection or Firebase rules.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAssessments();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCurrent = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const savedId = await saveAssessmentToCloud(currentData, activeDocId || undefined);
      onDocIdChange(savedId);
      setStatusMessage({
        type: 'success',
        text: `Successfully saved "${currentData.name || 'Assessment'}" to Firebase!`,
      });
      await fetchAssessments();
      if (onSaved) onSaved();
    } catch (err: any) {
      console.error('Error saving to Firestore:', err);
      setStatusMessage({
        type: 'error',
        text: `Save failed: ${err.message || 'Firebase error'}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = async (id: string) => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const loaded = await loadAssessmentFromCloud(id);
      onLoadAssessment(loaded, id);
      onDocIdChange(id);
      setStatusMessage({
        type: 'success',
        text: `Loaded assessment "${loaded.name || 'Student'}"!`,
      });
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      console.error('Error loading assessment:', err);
      setStatusMessage({
        type: 'error',
        text: `Failed to load: ${err.message}`,
      });
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the saved assessment for "${name}" from the cloud?`)) {
      return;
    }
    try {
      await deleteAssessmentFromCloud(id);
      if (activeDocId === id) {
        onDocIdChange(null);
      }
      setAssessments((prev) => prev.filter((a) => a.id !== id));
      setStatusMessage({
        type: 'success',
        text: 'Assessment removed from Firebase cloud.',
      });
      if (onSaved) onSaved();
    } catch (err: any) {
      alert(`Could not delete: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border-2 border-slate-300 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-teal-300" />
            <h3 className="font-bold text-base">Firebase Cloud Assessments</h3>
          </div>
          <button
            onClick={onClose}
            className="text-teal-200 hover:text-white p-1 rounded hover:bg-teal-800 transition-none"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-700">
              Active Assessment: <strong className="text-slate-900">{currentData.name || 'Unnamed Student'}</strong>
              {activeDocId && <span className="ml-1 text-[11px] text-teal-700 font-mono">({activeDocId})</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveCurrent}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-800 hover:bg-teal-900 disabled:bg-teal-600 text-white text-xs font-bold rounded border border-teal-950 transition-none"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
              {activeDocId ? 'Update in Cloud' : 'Save Current to Cloud'}
            </button>
            <button
              onClick={fetchAssessments}
              disabled={isLoading}
              className="p-1.5 text-slate-700 hover:bg-slate-200 border border-slate-300 rounded text-xs"
              title="Refresh list"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Status notice */}
        {statusMessage && (
          <div
            className={`px-4 py-2 text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-b border-emerald-200'
                : 'bg-red-50 text-red-900 border-b border-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {isLoading && assessments.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-teal-800 mb-2" />
              <p className="text-sm font-semibold">Connecting to Firebase Firestore...</p>
            </div>
          ) : assessments.length === 0 ? (
            <div className="py-10 text-center text-slate-500">
              <Cloud className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No cloud assessments saved yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Click &quot;Save Current to Cloud&quot; above to store this student&apos;s evaluation.
              </p>
            </div>
          ) : (
            assessments.map((item) => {
              const isActive = activeDocId === item.id;
              return (
                <div
                  key={item.id}
                  className={`p-3 rounded border flex items-center justify-between gap-3 ${
                    isActive ? 'bg-teal-50 border-teal-500' : 'bg-white border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{item.studentName}</h4>
                      {isActive && (
                        <span className="text-[10px] font-bold bg-teal-800 text-white px-1.5 py-0.2 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                      {item.ageSex && <span>Age/Sex: <strong>{item.ageSex}</strong></span>}
                      {item.doe && <span>DOE: <strong>{item.doe}</strong></span>}
                      <span className="text-slate-600">Updated: {item.updatedAtText}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleLoad(item.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded text-xs font-bold transition-none"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Load
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.studentName)}
                      className="p-1.5 text-red-700 hover:bg-red-50 rounded border border-red-200 transition-none"
                      title="Delete from Firebase"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-100 border-t border-slate-300 flex items-center justify-between text-xs text-slate-600">
          <span>Project: <strong className="font-mono text-slate-800">thulir-assessment-1</strong></span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white hover:bg-slate-200 border border-slate-300 rounded font-semibold text-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
