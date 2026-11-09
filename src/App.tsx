import { useState, useEffect, useMemo } from 'react';
import type { AssessmentData } from './types/assessment';
import { emptyAssessment } from './data/initialData';
import { AssessmentReport } from './components/preview/AssessmentReport';
import { DemographicsSection } from './components/form/sections/DemographicsSection';
import { MedicalFamilySection } from './components/form/sections/MedicalFamilySection';
import { MotorSkillsSection } from './components/form/sections/MotorSkillsSection';
import { HandwritingCognitiveSection } from './components/form/sections/HandwritingCognitiveSection';
import { NumbersSocialSection } from './components/form/sections/NumbersSocialSection';
import { LanguageSelfCareSection } from './components/form/sections/LanguageSelfCareSection';
import { SensoryAutismSection } from './components/form/sections/SensoryAutismSection';
import { StandardTestsPlanSection } from './components/form/sections/StandardTestsPlanSection';
import { StudentDirectory } from './components/records/StudentDirectory';
import {
  listCloudAssessments,
  saveAssessmentToCloud,
  deleteAssessmentFromCloud,
  getNextSequentialStudentId,
  extractRegisteredStudents,
  validateStudentBeforeSave,
  type CloudAssessmentSummary,
  type RegisteredStudent,
} from './services/firebase';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Printer,
  FileDown,
  Eye,
  Edit,
  Columns,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Menu,
  X,
  Loader2,
  Users,
  Save,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

const SECTIONS = [
  { id: 1, name: 'Demographics & Birth', page: 'Page 1', short: 'Demographics' },
  { id: 2, name: 'Medical & Family History', page: 'Page 2', short: 'Medical/Family' },
  { id: 3, name: 'Motor Skills (Gross/Fine)', page: 'Page 3', short: 'Motor Skills' },
  { id: 4, name: 'Handwriting & Cognitive', page: 'Page 4', short: 'Handwriting' },
  { id: 5, name: 'Numbers & Social Skills', page: 'Page 5', short: 'Numbers/Social' },
  { id: 6, name: 'Language & Self Care (ADL)', page: 'Page 6', short: 'Language/ADL' },
  { id: 7, name: 'Sensory & Autism Features', page: 'Page 7', short: 'Sensory/Autism' },
  { id: 8, name: 'Standard Tests & Plan', page: 'Page 8', short: 'Tests & Plan' },
];

export function App() {
  const [data, setData] = useState<AssessmentData>(() => {
    try {
      const saved = localStorage.getItem('thulir_assessment_current');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          // Clear any legacy demo unsplash photo
          if (parsed.studentPhoto && parsed.studentPhoto.includes('unsplash.com')) {
            parsed.studentPhoto = '';
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading from localStorage', e);
    }
    return emptyAssessment;
  });

  const [activeStep, setActiveStep] = useState(1);
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'split' | 'directory'>('editor');
  const [zoomScale, setZoomScale] = useState(1);
  const [splitZoom, setSplitZoom] = useState(0.66);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [activeDocId, setActiveDocId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('thulir_active_doc_id') || null;
    } catch (e) {
      return null;
    }
  });
  const [cloudAssessments, setCloudAssessments] = useState<CloudAssessmentSummary[]>([]);
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(false);
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [nextSequentialId, setNextSequentialId] = useState<string>('TH-100');
  const [cloudSaveStatus, setCloudSaveStatus] = useState<{ isSynced: boolean; time: string }>({
    isSynced: false,
    time: '',
  });

  const updateActiveDocId = (id: string | null) => {
    setActiveDocId(id);
    try {
      if (id) {
        localStorage.setItem('thulir_active_doc_id', id);
      } else {
        localStorage.removeItem('thulir_active_doc_id');
      }
    } catch (e) {
      // ignore
    }
  };

  // Extract unique registered student directory for universal ID mapping & demographic auto-fill
  const registeredStudents: RegisteredStudent[] = useMemo(() => {
    return extractRegisteredStudents(cloudAssessments);
  }, [cloudAssessments]);

  // Reset form to a clean new blank evaluation
  const resetToCleanForm = async (list?: CloudAssessmentSummary[]) => {
    const records = list || cloudAssessments;
    const nextId = await getNextSequentialStudentId(records);
    setData({ ...emptyAssessment, studentId: nextId });
    updateActiveDocId(null);
    setActiveStep(1);
    setCloudSaveStatus({ isSynced: false, time: '' });
    try {
      localStorage.removeItem('thulir_assessment_current');
      localStorage.removeItem('thulir_active_doc_id');
    } catch (e) {
      // ignore
    }
  };

  // Load Cloud Assessments List from Firebase Firestore & Reconcile with Local Cache
  const loadCloudList = async () => {
    setIsLoadingAssessments(true);
    try {
      const list = await listCloudAssessments();
      setCloudAssessments(list);

      // Reconcile current assessment with live database:
      // If the assessment was deleted from cloud (or database is empty), purge local draft
      const storedActiveId = localStorage.getItem('thulir_active_doc_id') || activeDocId;

      // 1. If database has NO assessments, clear any lingering deleted testing assessment
      if (list.length === 0) {
        if (data.name || (data.studentId && data.studentId !== 'TH-100') || storedActiveId) {
          await resetToCleanForm(list);
        }
        return;
      }

      // 2. If active form was editing a specific cloud document that was deleted from database
      if (storedActiveId) {
        const stillInDb = list.some((item) => item.id === storedActiveId);
        if (!stillInDb) {
          await resetToCleanForm(list);
          return;
        }
      }

      // 3. If form contains an assessment that was deleted from the cloud database
      if (data.name) {
        const nextId = await getNextSequentialStudentId(list);
        const matchesCloudRecord = list.some(
          (item) =>
            (item.studentId && data.studentId && item.studentId.toUpperCase() === data.studentId.toUpperCase()) ||
            (item.studentName && item.studentName.trim().toLowerCase() === data.name.trim().toLowerCase())
        );

        // If it was not found in cloud and is NOT an in-progress draft on the next sequential ID
        if (!matchesCloudRecord && data.studentId !== nextId) {
          await resetToCleanForm(list);
          return;
        }
      }
    } catch (err) {
      console.error('Error fetching cloud assessments:', err);
    } finally {
      setIsLoadingAssessments(false);
    }
  };

  // Handler when an assessment is deleted from Student Directory or Modal
  const handleAssessmentDeleted = async (deletedDocId: string) => {
    const storedActiveId = localStorage.getItem('thulir_active_doc_id') || activeDocId;
    const isCurrentActive = storedActiveId === deletedDocId;

    const freshList = await listCloudAssessments();
    setCloudAssessments(freshList);

    const matchesCurrent =
      isCurrentActive ||
      !freshList.some(
        (item) =>
          (item.studentId && data.studentId && item.studentId.toUpperCase() === data.studentId.toUpperCase()) ||
          (item.studentName && data.name && item.studentName.trim().toLowerCase() === data.name.trim().toLowerCase())
      );

    if (isCurrentActive || (data.name && matchesCurrent)) {
      await resetToCleanForm(freshList);
    }
  };

  useEffect(() => {
    loadCloudList();
  }, []);

  // Compute next sequential unique Universal Student ID (starting from TH-100)
  useEffect(() => {
    getNextSequentialStudentId(cloudAssessments).then((seqId) => {
      setNextSequentialId(seqId);
      // Auto-assign to current assessment if studentId is not set and starting a fresh assessment
      if (!data.studentId && !activeDocId) {
        setData((prev) => (prev.studentId ? prev : { ...prev, studentId: seqId }));
      }
    });
  }, [cloudAssessments, activeDocId]);

  // Direct 1-Click Save to Firebase Firestore Cloud with Pre-Save Verification
  const handleSaveToCloud = async () => {
    if (!data.name || !data.name.trim()) {
      alert('Please enter the Student Name in Page 1: Demographics before saving to Cloud.');
      setActiveStep(1);
      return;
    }

    let payload = { ...data };

    // Run pre-save verification (checks ID uniqueness, name match, and demographic modification)
    const validation = validateStudentBeforeSave(payload, registeredStudents, nextSequentialId);

    if (!validation.isValid && validation.status === 'existing_name_mismatch') {
      const confirmAssignNext = confirm(
        `${validation.message}\n\nClick "OK" to assign next unique ID "${validation.suggestedUniqueId || nextSequentialId}" and save.\n\nClick "Cancel" to return and review student details.`
      );
      if (!confirmAssignNext) {
        setActiveStep(1);
        return;
      }
      payload.studentId = validation.suggestedUniqueId || nextSequentialId;
      setData((prev) => ({ ...prev, studentId: payload.studentId }));
    } else if (!payload.studentId && validation.suggestedUniqueId) {
      payload.studentId = validation.suggestedUniqueId;
      setData((prev) => ({ ...prev, studentId: payload.studentId }));
    }

    setIsSavingCloud(true);
    try {
      const savedDocId = await saveAssessmentToCloud(payload, activeDocId || undefined);
      
      // Fetch fresh cloud assessments list and reset form to a fresh blank assessment ready for the next entry
      const freshAssessments = await listCloudAssessments();
      setCloudAssessments(freshAssessments);
      const nextNewId = await getNextSequentialStudentId(freshAssessments);
      await resetToCleanForm(freshAssessments);

      if (validation.status === 'existing_demographics_updated') {
        alert(
          `Assessment for "${payload.name}" successfully saved to Cloud!\nDocument ID: ${savedDocId}\n\nMaster profile updated: Demographic changes (DOB, diagnosis, parents/guardians, or address) have been synchronized across the portal.\n\nA fresh blank assessment has been opened with next ID (${nextNewId}).`
        );
      } else if (validation.status === 'new_unique') {
        alert(
          `Assessment for new student "${payload.name}" (ID: ${payload.studentId}) successfully registered & saved to Cloud!\nDocument ID: ${savedDocId}\n\nA fresh blank assessment has been opened with next ID (${nextNewId}).`
        );
      } else {
        alert(
          `Assessment for "${payload.name || 'Student'}" successfully saved to Cloud!\nDocument ID: ${savedDocId}\n\nA fresh blank assessment has been opened with next ID (${nextNewId}).`
        );
      }
    } catch (err: any) {
      console.error('Save to cloud failed:', err);
      alert(`Could not save to Cloud: ${err.message || 'Firebase error'}`);
    } finally {
      setIsSavingCloud(false);
    }
  };

  // Auto-save to localStorage (Safe offline draft cache)
  useEffect(() => {
    try {
      localStorage.setItem('thulir_assessment_current', JSON.stringify(data));
      const now = new Date();
      setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }, [data]);

  const updateData = (updates: Partial<AssessmentData>) => {
    setData((prev) => ({ ...prev, ...updates }));
    setCloudSaveStatus((prev) => ({ ...prev, isSynced: false }));
  };

  // Direct High-Resolution PDF Download: exactly 8 pages matching the official protocol 1:1
  const handleDownloadDirectPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const studentNameClean = (data.name || 'Student').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `Thulir_Assessment_${studentNameClean}_${data.doe || 'Report'}.pdf`;

      // Query all 8 pages in the official document container
      const container = document.getElementById('pure-official-document');
      if (!container) {
        throw new Error('Report document not found in DOM.');
      }

      const pages = container.querySelectorAll<HTMLElement>('.a4-page');
      if (pages.length === 0) {
        throw new Error('No assessment pages found to export.');
      }

      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true,
      });

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollX: 0,
          scrollY: 0,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }
        // Exactly 210mm x 297mm (full A4 sheet coverage)
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      }

      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Could not download PDF automatically. You can use the Print button to Save as PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetForm = async () => {
    if (confirm('Start a new blank child assessment? Any unsaved changes in current form will be cleared.')) {
      await resetToCleanForm();
    }
  };

  const handleDeleteActiveAssessment = async () => {
    if (!activeDocId) return;
    const studentName = data.name || 'this student';
    if (
      !confirm(
        `Are you sure you want to permanently delete the assessment for "${studentName}" (Cloud ID: ${activeDocId}) from Firebase Cloud?\n\nThis cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteAssessmentFromCloud(activeDocId);
      const freshList = await listCloudAssessments();
      setCloudAssessments(freshList);
      await resetToCleanForm(freshList);
      alert(`Assessment for "${studentName}" has been permanently deleted from Firebase Cloud.`);
    } catch (err: any) {
      alert(`Failed to delete assessment: ${err.message || 'Firebase error'}`);
    }
  };

  const calculateCompletion = () => {
    let score = 0;
    if (data.name) score += 15;
    if (data.studentPhoto) score += 10;
    if (data.chiefComplaints) score += 15;
    if (data.presentMedicalHistory) score += 10;
    if (data.onExamination.fineMotorSkills.handDominance) score += 10;
    if (data.play) score += 10;
    if (data.standardizationTests.therapyPlan) score += 20;
    if (data.consultant.signatureImage) score += 10;
    return Math.min(score, 100);
  };

  const completionPct = calculateCompletion();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* ========================================================
          TOP NAVIGATION BAR (NO GLASSMORPHISM, SOLID BUTTONS)
         ======================================================== */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-300 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 py-2 flex items-center justify-between gap-4">
          {/* Logo & Clinic Title */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Thulir Special School Logo"
              className="h-12 w-auto object-contain shrink-0"
            />
            <div className="border-l-2 border-slate-300 pl-3">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                THULIR SPECIAL SCHOOL &amp; THERAPY CENTRE
              </h1>
              <p className="text-xs font-semibold text-teal-800">
                Child Psychiatry Assessment &bull; Occupational Therapy &bull; Ganapathy, Coimbatore - 641 006
              </p>
            </div>
          </div>

          {/* Center: View Switcher (Desktop) */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded border border-slate-300">
            <button
              onClick={() => setViewMode('editor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-none ${
                viewMode === 'editor'
                  ? 'bg-teal-700 text-white'
                  : 'text-slate-800 hover:bg-slate-200'
              }`}
            >
              <Edit className="w-3.5 h-3.5" />
              Assessment Form
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-none ${
                viewMode === 'preview'
                  ? 'bg-teal-700 text-white'
                  : 'text-slate-800 hover:bg-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Report View (PDF)
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-none ${
                viewMode === 'split'
                  ? 'bg-teal-700 text-white'
                  : 'text-slate-800 hover:bg-slate-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              Split Screen
            </button>
            <button
              onClick={() => {
                setViewMode('directory');
                loadCloudList();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-none ${
                viewMode === 'directory'
                  ? 'bg-teal-700 text-white'
                  : 'text-slate-800 hover:bg-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Student Records</span>
              {cloudAssessments.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  viewMode === 'directory' ? 'bg-teal-900 text-white' : 'bg-slate-200 text-slate-800'
                }`}>
                  {cloudAssessments.length}
                </span>
              )}
            </button>
          </div>

          {/* Action Buttons: Save to Cloud, Direct PDF Download & Print */}
          <div className="flex items-center gap-2">
            {/* Direct Save to Cloud Button */}
            <button
              onClick={handleSaveToCloud}
              disabled={isSavingCloud}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-800 hover:bg-teal-900 disabled:bg-teal-600 text-white rounded text-xs sm:text-sm font-bold border border-teal-900 transition-none shadow-sm"
              title="Save current assessment directly to Firebase Cloud"
            >
              {isSavingCloud ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-emerald-300" />
                  <span>{activeDocId ? 'Update in Cloud' : 'Save to Cloud'}</span>
                </>
              )}
            </button>

            {/* Direct PDF File Download Button */}
            <button
              onClick={handleDownloadDirectPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:bg-emerald-600 text-white rounded text-xs sm:text-sm font-bold border border-emerald-900 transition-none shadow-sm"
              title="Download clean official PDF directly to device"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {/* Print to Paper / Browser Print */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs sm:text-sm font-bold border border-slate-900 transition-none"
              title="Print document to printer"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            {/* Mobile View Toggle */}
            <div className="flex lg:hidden items-center bg-slate-100 p-1 rounded border border-slate-300">
              <button
                onClick={() => setViewMode('editor')}
                className={`p-1.5 rounded font-bold ${viewMode === 'editor' ? 'bg-teal-700 text-white' : 'text-slate-800'}`}
                title="Editor"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`p-1.5 rounded font-bold ${viewMode === 'preview' ? 'bg-teal-700 text-white' : 'text-slate-800'}`}
                title="PDF Preview"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setViewMode('directory');
                  loadCloudList();
                }}
                className={`p-1.5 rounded font-bold ${viewMode === 'directory' ? 'bg-teal-700 text-white' : 'text-slate-800'}`}
                title="Student Records Directory"
              >
                <Users className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-800 hover:bg-slate-200 border border-slate-300 rounded lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Quick Tools */}
            <div className="hidden lg:flex items-center gap-2 border-l-2 border-slate-300 pl-3">
              <button
                onClick={handleResetForm}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-teal-900 hover:bg-slate-200 border border-slate-300 rounded transition-none"
                title="Start a new blank child assessment"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New Assessment</span>
              </button>

              {activeDocId && (
                <button
                  onClick={handleDeleteActiveAssessment}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-red-700 hover:text-white hover:bg-red-700 bg-red-50 border border-red-300 rounded transition-none shadow-xs"
                  title="Permanently delete this opened assessment from Firebase Cloud"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Record</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-slate-300 bg-white px-4 py-3 space-y-2">
            <div className="flex flex-col gap-2 pb-2 border-b border-slate-200">
              <button
                onClick={() => {
                  handleSaveToCloud();
                  setMobileMenuOpen(false);
                }}
                disabled={isSavingCloud}
                className="px-3 py-2 text-xs font-bold text-white bg-teal-800 border border-teal-900 rounded w-full inline-flex items-center justify-center gap-1.5 shadow-sm"
              >
                {isSavingCloud ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-emerald-300" />}
                <span>{activeDocId ? 'Update in Cloud' : 'Save Assessment to Cloud'}</span>
              </button>

              <button
                onClick={() => {
                  setViewMode('directory');
                  loadCloudList();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs font-bold text-slate-900 bg-slate-100 border border-slate-300 rounded w-full inline-flex items-center justify-center gap-1.5"
              >
                <Users className="w-4 h-4 text-teal-800" />
                <span>Student Records Directory ({cloudAssessments.length})</span>
              </button>
              <button
                onClick={() => {
                  handleDownloadDirectPdf();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 rounded w-full inline-flex items-center justify-center gap-1.5"
              >
                <FileDown className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={() => {
                  handlePrint();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs font-bold text-teal-900 bg-teal-100 border border-teal-300 rounded w-full inline-flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print Document
              </button>
              <button
                onClick={() => {
                  handleResetForm();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 rounded w-full inline-flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                New Blank Assessment
              </button>
              {activeDocId && (
                <button
                  onClick={() => {
                    handleDeleteActiveAssessment();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 text-xs font-bold text-red-800 bg-red-100 border border-red-300 rounded w-full inline-flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Active Cloud Record
                </button>
              )}
            </div>
            <div className="text-xs text-slate-700 flex items-center justify-between font-medium pt-1">
              <span>Auto-saved to device draft</span>
              <span className="font-bold text-slate-900">{lastSavedTime}</span>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================
          SUB-HEADER: STATUS & COMPLETION BAR (HIGH VISIBILITY)
         ======================================================== */}
      <div className="bg-slate-200 border-b border-slate-300 px-4 sm:px-6 py-2 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Active Child Summary */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="font-bold text-slate-800">Active Student:</span>
            {data.studentId && (
              <span className="font-mono bg-teal-100 text-teal-950 border border-teal-300 px-1.5 py-0.5 rounded font-bold">
                ID: {data.studentId}
              </span>
            )}
            <span className="font-bold text-teal-900 bg-white px-2 py-0.5 rounded border border-slate-300">
              {data.name || 'Untitled Assessment'}
            </span>
            {data.ageSex && (
              <span className="text-slate-800 font-medium">({data.ageSex})</span>
            )}
            <span className="text-slate-400">&bull;</span>
            <span className="text-slate-700 font-medium">Eval Date: {data.doe || 'Pending'}</span>
          </div>

          {/* Cloud Sync & Auto-save Status */}
          <div className="flex items-center gap-3 flex-wrap">
            {cloudSaveStatus.isSynced ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Synced to Cloud ({cloudSaveStatus.time})</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2">
                <span className="text-xs font-medium text-amber-950 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Draft cached locally ({lastSavedTime})</span>
                </span>
                <button
                  type="button"
                  onClick={handleSaveToCloud}
                  disabled={isSavingCloud}
                  className="text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 px-2.5 py-1 rounded transition-none shadow-xs flex items-center gap-1"
                  title="Click to save and persist this assessment permanently to Firebase Cloud"
                >
                  {isSavingCloud ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Save className="w-3 h-3 text-emerald-300" />
                  )}
                  <span>Save to Cloud</span>
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className="w-24 sm:w-32 bg-slate-300 rounded h-2.5 overflow-hidden border border-slate-400">
                <div
                  className="bg-teal-700 h-full transition-all"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-900">{completionPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MAIN INTERACTIVE UI (STRICTLY HIDDEN ON PRINT)
         ======================================================== */}
      <main className="interactive-ui-root no-print flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* VIEW 1: FORM EDITOR */}
        {(viewMode === 'editor' || viewMode === 'split') && (
          <div className={`grid grid-cols-1 ${viewMode === 'split' ? 'lg:grid-cols-12 gap-8' : ''}`}>
            <div className={viewMode === 'split' ? 'lg:col-span-6' : 'max-w-4xl mx-auto w-full'}>
              {/* Stepper Tabs */}
              <div className="bg-white rounded border-2 border-slate-300 p-2 mb-6 overflow-x-auto">
                <div className="flex items-center gap-1 min-w-max">
                  {SECTIONS.map((sec) => {
                    const isActive = activeStep === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => setActiveStep(sec.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-bold border transition-none ${
                          isActive
                            ? 'bg-teal-700 text-white border-teal-800'
                            : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                            isActive ? 'bg-white text-teal-900' : 'bg-slate-200 text-slate-900'
                          }`}
                        >
                          {sec.id}
                        </span>
                        <span>{sec.short}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Content Card */}
              <div className="bg-white rounded border-2 border-slate-300 p-5 sm:p-8">
                {activeStep === 1 && (
                  <DemographicsSection
                    data={data}
                    onChange={updateData}
                    registeredStudents={registeredStudents}
                    nextSequentialId={nextSequentialId}
                  />
                )}
                {activeStep === 2 && <MedicalFamilySection data={data} onChange={updateData} />}
                {activeStep === 3 && <MotorSkillsSection data={data} onChange={updateData} />}
                {activeStep === 4 && <HandwritingCognitiveSection data={data} onChange={updateData} />}
                {activeStep === 5 && <NumbersSocialSection data={data} onChange={updateData} />}
                {activeStep === 6 && <LanguageSelfCareSection data={data} onChange={updateData} />}
                {activeStep === 7 && <SensoryAutismSection data={data} onChange={updateData} />}
                {activeStep === 8 && <StandardTestsPlanSection data={data} onChange={updateData} />}

                {/* Step Navigation Bar */}
                <div className="flex items-center justify-between gap-2 pt-6 mt-8 border-t-2 border-slate-200">
                  {/* Previous Section Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveStep((prev) => Math.max(prev - 1, 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={activeStep === 1}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded border-2 border-slate-400 text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-none shadow-2xs shrink-0"
                    title="Go to previous section"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {/* Section Indicator Badge (Compact & Centered) */}
                  <div className="shrink-0 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 whitespace-nowrap shadow-2xs">
                    <span className="text-teal-800">Section {activeStep} of 8</span>
                  </div>

                  {/* Right Actions: Save to Cloud & Next Section */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleSaveToCloud}
                      disabled={isSavingCloud}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-teal-800 hover:bg-teal-900 disabled:bg-teal-600 text-white text-xs sm:text-sm font-bold border border-teal-900 transition-none shadow-xs whitespace-nowrap"
                      title="Save current progress to Cloud database"
                    >
                      {isSavingCloud ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 text-emerald-300" />
                      )}
                      <span>{activeDocId ? 'Update Cloud' : 'Save to Cloud'}</span>
                    </button>

                    {activeStep < 8 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveStep((prev) => Math.min(prev + 1, 8));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold border border-teal-900 transition-none shadow-xs whitespace-nowrap"
                        title="Go to next section"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setViewMode('preview');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold border border-emerald-900 transition-none shadow-xs whitespace-nowrap"
                        title="Review complete 8-page PDF document"
                      >
                        <span>Review PDF</span>
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Split Screen Live Report Preview */}
            {viewMode === 'split' && (
              <div className="hidden lg:block lg:col-span-6 sticky top-20 h-[calc(100vh-6rem)] split-screen-preview-container overflow-y-auto overflow-x-hidden pr-1">
                <div className="bg-slate-900 text-white rounded p-3 mb-4 flex items-center justify-between border border-slate-700">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Eye className="w-4 h-4 text-teal-400" />
                    <span className="hidden xl:inline">Live 8-Page Preview</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Manual Zoom Controls */}
                    <div className="flex items-center gap-1 bg-slate-800 rounded p-1 border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setSplitZoom((prev) => Math.max(prev - 0.05, 0.45))}
                        className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
                        title="Zoom out"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] font-mono font-bold px-1 text-slate-200">
                        {Math.round(splitZoom * 100)}%
                      </span>
                      <button
                        type="button"
                        onClick={() => setSplitZoom((prev) => Math.min(prev + 0.05, 1.2))}
                        className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
                        title="Zoom in"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSplitZoom(0.66)}
                        className="px-1.5 py-0.5 text-[10px] font-bold hover:bg-slate-700 rounded text-teal-300"
                        title="Fit full page width without scrolling"
                      >
                        Fit
                      </button>
                    </div>

                    <button
                      onClick={handleDownloadDirectPdf}
                      disabled={isGeneratingPdf}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded border border-emerald-800 transition-none"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      PDF
                    </button>
                    <button
                      onClick={handlePrint}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded border border-teal-800 transition-none"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print
                    </button>
                  </div>
                </div>
                <div
                  className="screen-preview-container overflow-x-hidden origin-top"
                  style={{
                    zoom: splitZoom,
                  }}
                >
                  <AssessmentReport data={data} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: FULL REPORT & PDF PREVIEW */}
        {viewMode === 'preview' && (
          <div className="max-w-5xl mx-auto w-full">
            {/* Preview Toolbar */}
            <div className="bg-white rounded border-2 border-slate-300 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode('editor')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-400 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition-none"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Editor
                </button>
                <div className="text-xs text-slate-900 font-bold hidden sm:block">
                  Exact 8-Page Official Document (Times New Roman &amp; Official Logo)
                </div>
              </div>

              {/* Zoom, PDF Download & Print */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-100 rounded p-1 border border-slate-300">
                  <button
                    onClick={() => setZoomScale((prev) => Math.max(prev - 0.1, 0.5))}
                    className="p-1 hover:bg-slate-200 rounded text-slate-800 font-bold"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold px-1 text-slate-900">
                    {Math.round(zoomScale * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomScale((prev) => Math.min(prev + 0.1, 1.3))}
                    className="p-1 hover:bg-slate-200 rounded text-slate-800 font-bold"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomScale(1)}
                    className="p-1 hover:bg-slate-200 rounded text-slate-800 font-bold"
                    title="Reset Zoom (100%)"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleDownloadDirectPdf}
                  disabled={isGeneratingPdf}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:bg-emerald-600 text-white rounded text-xs sm:text-sm font-bold border border-emerald-900 transition-none shadow-sm"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded text-xs sm:text-sm font-bold border border-teal-900 transition-none"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Scaled Preview Sheet Wrapper */}
            <div
              className="screen-preview-container overflow-x-auto pb-12 origin-top flex flex-col items-center"
              style={{ transform: `scale(${zoomScale})` }}
            >
              <AssessmentReport data={data} />
            </div>
          </div>
        )}

        {/* VIEW 3: STUDENT RECORDS & ASSESSMENT DIRECTORY */}
        {viewMode === 'directory' && (
          <StudentDirectory
            assessments={cloudAssessments}
            isLoading={isLoadingAssessments}
            onRefresh={loadCloudList}
            onAssessmentDeleted={handleAssessmentDeleted}
            onSelectAssessment={(selData, docId, targetView) => {
              setData(selData);
              updateActiveDocId(docId);
              setCloudSaveStatus({ isSynced: true, time: 'Cloud Record' });
              setActiveStep(1);
              setViewMode(targetView);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNewAssessmentForStudent={(studentDemo) => {
              const followUpData: AssessmentData = {
                ...emptyAssessment,
                studentId: studentDemo.studentId || '',
                name: studentDemo.name || '',
                studentPhoto: studentDemo.studentPhoto || '',
                dob: studentDemo.dob || '',
                ageSex: studentDemo.ageSex || '',
                parentsGuardians: studentDemo.parentsGuardians || '',
                address: studentDemo.address || '',
                diagnosis: studentDemo.diagnosis || '',
                doe: new Date().toISOString().split('T')[0],
              };
              setData(followUpData);
              updateActiveDocId(null); // Fresh document in cloud, so it won't overwrite past assessments!
              setCloudSaveStatus({ isSynced: false, time: '' });
              setActiveStep(1);
              setViewMode('editor');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onStartBlankAssessment={async () => {
              await resetToCleanForm(cloudAssessments);
              setViewMode('editor');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDownloadPdfForData={(targetData) => {
              setData(targetData);
              setTimeout(() => {
                handleDownloadDirectPdf();
              }, 120);
            }}
            activeDocId={activeDocId}
          />
        )}
      </main>

      {/* ========================================================
          ISOLATED PRINT DOCUMENT CONTAINER (ALWAYS IN DOM)
          Ensures that whenever window.print() or PDF export runs,
          ONLY the authentic 8-page document prints, with 0% UI leaking!
         ======================================================== */}
      {viewMode !== 'preview' && (
        <div className="fixed top-0 left-0 opacity-0 pointer-events-none -z-50 print:opacity-100 print:z-auto print:static">
          <AssessmentReport data={data} />
        </div>
      )}
    </div>
  );
}

export default App;
