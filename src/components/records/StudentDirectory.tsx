import React, { useState, useMemo } from 'react';
import type { AssessmentData } from '../../types/assessment';
import {
  type CloudAssessmentSummary,
  deleteAssessmentFromCloud,
} from '../../services/firebase';
import {
  Search,
  Users,
  FileText,
  FileDown,
  Edit3,
  Trash2,
  PlusCircle,
  RefreshCw,
  Clock,
  Activity,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  Filter
} from 'lucide-react';

interface Props {
  assessments: CloudAssessmentSummary[];
  isLoading: boolean;
  onRefresh: () => void;
  onSelectAssessment: (assessment: AssessmentData, docId: string, view: 'editor' | 'preview') => void;
  onNewAssessmentForStudent: (studentDemo: Partial<AssessmentData>) => void;
  onStartBlankAssessment: () => void;
  onDownloadPdfForData: (data: AssessmentData) => void;
  activeDocId: string | null;
}

export const StudentDirectory: React.FC<Props> = ({
  assessments,
  isLoading,
  onRefresh,
  onSelectAssessment,
  onNewAssessmentForStudent,
  onStartBlankAssessment,
  onDownloadPdfForData,
  activeDocId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'multiple' | 'recent'>('all');
  const [sortOption, setSortOption] = useState<'date_desc' | 'name_asc' | 'eval_count'>('date_desc');
  const [expandedStudents, setExpandedStudents] = useState<Record<string, boolean>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Group assessments by student name (case-insensitive key)
  const studentGroups = useMemo(() => {
    const groups: Record<
      string,
      {
        studentKey: string;
        studentName: string;
        studentPhoto: string;
        dob: string;
        ageSex: string;
        diagnosis: string;
        parentsGuardians: string;
        address: string;
        assessments: CloudAssessmentSummary[];
      }
    > = {};

    assessments.forEach((item) => {
      const rawName = (item.studentName || 'Unnamed Student').trim();
      const normKey = rawName.toLowerCase();

      if (!groups[normKey]) {
        groups[normKey] = {
          studentKey: normKey,
          studentName: rawName,
          studentPhoto: item.studentPhoto || '',
          dob: item.dob || '',
          ageSex: item.ageSex || '',
          diagnosis: item.diagnosis || '',
          parentsGuardians: item.parentsGuardians || '',
          address: item.data?.address || '',
          assessments: [],
        };
      }

      // Update photo or details if earlier record had it missing
      if (!groups[normKey].studentPhoto && item.studentPhoto) {
        groups[normKey].studentPhoto = item.studentPhoto;
      }
      if (!groups[normKey].dob && item.dob) {
        groups[normKey].dob = item.dob;
      }
      if (!groups[normKey].diagnosis && item.diagnosis) {
        groups[normKey].diagnosis = item.diagnosis;
      }

      groups[normKey].assessments.push(item);
    });

    // Sort assessments inside each student by date of evaluation descending
    Object.values(groups).forEach((g) => {
      g.assessments.sort((a, b) => {
        const dateA = a.doe || '';
        const dateB = b.doe || '';
        if (dateA && dateB) return dateB.localeCompare(dateA);
        return (b.updatedAtMillis || 0) - (a.updatedAtMillis || 0);
      });
    });

    return Object.values(groups);
  }, [assessments]);

  // Filter students based on search query and filter chips
  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    let list = studentGroups.filter((st) => {
      // Search matching across Name, Diagnosis, Parents, DOE, or ID
      const matchesSearch =
        !query ||
        st.studentName.toLowerCase().includes(query) ||
        st.diagnosis.toLowerCase().includes(query) ||
        st.parentsGuardians.toLowerCase().includes(query) ||
        st.assessments.some(
          (a) =>
            (a.doe && a.doe.toLowerCase().includes(query)) ||
            (a.consultantName && a.consultantName.toLowerCase().includes(query))
        );

      if (!matchesSearch) return false;

      // Filter modes
      if (filterMode === 'multiple') {
        return st.assessments.length > 1;
      }
      if (filterMode === 'recent') {
        return st.assessments.some((a) => (a.updatedAtMillis || 0) >= thirtyDaysAgo);
      }

      return true;
    });

    // Sorting
    list.sort((a, b) => {
      if (sortOption === 'name_asc') {
        return a.studentName.localeCompare(b.studentName);
      }
      if (sortOption === 'eval_count') {
        return b.assessments.length - a.assessments.length;
      }
      // Default: date_desc (most recent evaluation first)
      const dateA = a.assessments[0]?.doe || '';
      const dateB = b.assessments[0]?.doe || '';
      return dateB.localeCompare(dateA);
    });

    return list;
  }, [studentGroups, searchQuery, filterMode, sortOption]);

  const toggleStudentExpand = (key: string) => {
    setExpandedStudents((prev) => ({
      ...prev,
      [key]: prev[key] === undefined ? false : !prev[key],
    }));
  };

  const isStudentExpanded = (key: string) => {
    // Default to true (expanded) so the therapist immediately sees evaluations
    return expandedStudents[key] !== false;
  };

  const handleDeleteAssessment = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this specific assessment record from Firebase Cloud? This cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteAssessmentFromCloud(id);
      onRefresh();
    } catch (err: any) {
      alert(`Delete failed: ${err.message || 'Firebase error'}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Total metrics
  const totalStudents = studentGroups.length;
  const totalAssessments = assessments.length;
  const multiAssessmentCount = studentGroups.filter((g) => g.assessments.length > 1).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* ========================================================
          TOP SUMMARY BANNER & METRICS
         ======================================================== */}
      <div className="bg-white border-2 border-slate-300 rounded-lg p-5 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-teal-800 text-white rounded-md">
                <Users className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Student Records &amp; Clinical Archive
                </h2>
                <p className="text-xs font-semibold text-teal-800">
                  Thulir Special School &amp; Therapy Centre &bull; Patient History Database
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-none"
              title="Refresh records from Firebase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-700' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Sync Cloud'}</span>
            </button>

            <button
              onClick={onStartBlankAssessment}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-teal-800 hover:bg-teal-900 border border-teal-900 rounded transition-none shadow-sm"
              title="Start a new blank evaluation"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ New Assessment</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-base shrink-0">
              {totalStudents}
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Enrolled Students</div>
              <div className="text-slate-600 font-medium">Distinct patient profiles</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base shrink-0">
              {totalAssessments}
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Assessments Completed</div>
              <div className="text-slate-600 font-medium">Official 8-page evaluations</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-base shrink-0">
              {multiAssessmentCount}
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Follow-up Cases</div>
              <div className="text-slate-600 font-medium">Multiple assessments on record</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          SEARCH & FILTER TOOLBAR
         ======================================================== */}
      <div className="bg-white border-2 border-slate-300 rounded-lg p-4 mb-6 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, diagnosis, parent/guardian, or date (e.g. 'Aarav', 'ASD', '2026-11')..."
              className="w-full pl-9 pr-8 py-2.5 rounded border border-slate-300 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 text-sm text-slate-900 placeholder:text-slate-400 bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <span className="text-xs font-bold text-slate-700 shrink-0">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded focus:border-teal-700"
            >
              <option value="date_desc">Latest Assessment Date</option>
              <option value="name_asc">Student Name (A-Z)</option>
              <option value="eval_count">Most Evaluations First</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          <span className="text-slate-600 font-bold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-teal-800" /> Filter:
          </span>

          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-full font-bold transition-none ${
              filterMode === 'all'
                ? 'bg-teal-800 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Students ({studentGroups.length})
          </button>

          <button
            onClick={() => setFilterMode('multiple')}
            className={`px-3 py-1 rounded-full font-bold transition-none ${
              filterMode === 'multiple'
                ? 'bg-teal-800 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Multiple Assessments ({multiAssessmentCount})
          </button>

          <button
            onClick={() => setFilterMode('recent')}
            className={`px-3 py-1 rounded-full font-bold transition-none ${
              filterMode === 'recent'
                ? 'bg-teal-800 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Recent (Last 30 Days)
          </button>

          {searchQuery && (
            <span className="text-slate-600 font-semibold ml-auto text-xs">
              Found {filteredStudents.length} student{filteredStudents.length === 1 ? '' : 's'}
            </span>
          )}
        </div>
      </div>

      {/* ========================================================
          STUDENT CARDS LIST
         ======================================================== */}
      {isLoading && studentGroups.length === 0 ? (
        <div className="bg-white border border-slate-300 rounded-lg p-12 text-center text-slate-600">
          <RefreshCw className="w-8 h-8 text-teal-700 animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-900">Loading assessments from Firebase Cloud...</p>
          <p className="text-xs text-slate-500 mt-1">Fetching student records and past evaluations.</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white border border-slate-300 rounded-lg p-12 text-center">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Student Records Found</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 mb-4">
            {searchQuery
              ? `No students matching "${searchQuery}". Try searching another name, diagnosis, or evaluation date.`
              : 'No assessments have been saved to Firebase Firestore yet. When you complete an assessment, click "Cloud Records > Save Current to Cloud" to begin building your clinical archive.'}
          </p>
          <button
            onClick={onStartBlankAssessment}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded"
          >
            <PlusCircle className="w-4 h-4" />
            Create First Student Assessment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStudents.map((student) => {
            const isExpanded = isStudentExpanded(student.studentKey);
            const latestEval = student.assessments[0];
            const evalCount = student.assessments.length;

            return (
              <div
                key={student.studentKey}
                className="bg-white border-2 border-slate-300 rounded-lg overflow-hidden shadow-xs hover:border-slate-400 transition-colors"
              >
                {/* Student Card Main Header */}
                <div
                  onClick={() => toggleStudentExpand(student.studentKey)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer bg-slate-50/70 hover:bg-slate-100/70 border-b border-slate-200 select-none"
                >
                  {/* Left: Avatar & Demographics */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Student Photo or Initials Avatar */}
                    <div className="w-14 h-16 rounded border-2 border-slate-300 bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                      {student.studentPhoto ? (
                        <img
                          src={student.studentPhoto}
                          alt={student.studentName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-teal-700 to-teal-900 text-white font-bold text-base flex items-center justify-center">
                          {student.studentName
                            .split(' ')
                            .map((p) => p[0])
                            .filter(Boolean)
                            .slice(0, 2)
                            .join('')
                            .toUpperCase() || 'ST'}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 leading-tight">
                          {student.studentName}
                        </h3>
                        {student.ageSex && (
                          <span className="text-xs font-bold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded">
                            {student.ageSex}
                          </span>
                        )}
                        {student.dob && (
                          <span className="text-xs text-slate-600 font-medium">
                            DOB: {student.dob}
                          </span>
                        )}
                      </div>

                      {/* Diagnosis */}
                      {student.diagnosis ? (
                        <div className="text-xs text-teal-950 font-semibold mt-1 flex items-center gap-1.5 line-clamp-1">
                          <Activity className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                          <span>{student.diagnosis}</span>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 italic mt-0.5">
                          Diagnosis pending
                        </div>
                      )}

                      {/* Parents */}
                      {student.parentsGuardians && (
                        <div className="text-xs text-slate-600 font-medium mt-0.5 line-clamp-1">
                          Parents: {student.parentsGuardians}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Count Badge & New Follow-up Button */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right hidden sm:block">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-100 text-teal-900 rounded-full font-bold text-xs border border-teal-200">
                        <FileText className="w-3.5 h-3.5 text-teal-800" />
                        <span>
                          {evalCount} Evaluation{evalCount === 1 ? '' : 's'}
                        </span>
                      </div>
                      {latestEval?.doe && (
                        <div className="text-[11px] text-slate-600 font-medium mt-1">
                          Latest: {latestEval.doe}
                        </div>
                      )}
                    </div>

                    {/* "+ New Assessment for this Student" button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNewAssessmentForStudent({
                          name: student.studentName,
                          studentPhoto: student.studentPhoto,
                          dob: student.dob,
                          ageSex: student.ageSex,
                          parentsGuardians: student.parentsGuardians,
                          address: student.address,
                          diagnosis: student.diagnosis,
                          doe: new Date().toISOString().split('T')[0],
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-bold transition-none shadow-xs"
                      title="Create a follow-up assessment keeping this student's demographics"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>+ New Follow-up</span>
                    </button>

                    {/* Expand/Collapse Toggle */}
                    <button
                      type="button"
                      className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded"
                      aria-label="Toggle assessment history"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-700" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-700" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Assessments History List for this student */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-white space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-teal-800" />
                        Historical Assessment Timeline ({evalCount} record{evalCount === 1 ? '' : 's'})
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        Sorted newest first &bull; Click any record to inspect or download PDF
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {student.assessments.map((evalItem, idx) => {
                        const isLatest = idx === 0;
                        const isActive = activeDocId === evalItem.id;
                        const assessmentData = evalItem.data;

                        return (
                          <div
                            key={evalItem.id}
                            className={`py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 rounded p-2.5 transition-colors ${
                              isActive
                                ? 'bg-teal-50 border border-teal-300'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            {/* Left: Assessment Details */}
                            <div className="flex items-start gap-3">
                              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                #{evalCount - idx}
                              </div>

                              <div className="space-y-0.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-bold text-slate-900 text-sm">
                                    Evaluation Date: {evalItem.doe || 'Undated'}
                                  </span>

                                  {isLatest && (
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded uppercase tracking-wide">
                                      Latest
                                    </span>
                                  )}

                                  {isActive && (
                                    <span className="px-2 py-0.5 bg-teal-800 text-white font-bold text-[10px] rounded flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" /> Currently Active
                                    </span>
                                  )}

                                  <span className="text-xs text-slate-500 font-medium">
                                    Saved: {evalItem.updatedAtText}
                                  </span>
                                </div>

                                <div className="text-xs text-slate-700 font-medium flex flex-wrap items-center gap-3 pt-0.5">
                                  {evalItem.ageSex && (
                                    <span>Age: <strong>{evalItem.ageSex}</strong></span>
                                  )}
                                  {evalItem.consultantName && (
                                    <span>Consultant: <strong>{evalItem.consultantName}</strong></span>
                                  )}
                                  {evalItem.id && (
                                    <span className="text-[11px] text-slate-400 font-mono">
                                      ID: {evalItem.id.slice(0, 18)}...
                                    </span>
                                  )}
                                </div>

                                {assessmentData?.chiefComplaints && (
                                  <div className="text-xs text-slate-600 line-clamp-1 italic pt-0.5">
                                    &ldquo;{assessmentData.chiefComplaints}&rdquo;
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                              {/* Open & Edit in Form */}
                              <button
                                onClick={() => {
                                  if (assessmentData) {
                                    onSelectAssessment(assessmentData, evalItem.id, 'editor');
                                  }
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-bold transition-none shadow-xs"
                                title="Open this assessment in the form editor"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit Form</span>
                              </button>

                              {/* View Official 8-Page PDF */}
                              <button
                                onClick={() => {
                                  if (assessmentData) {
                                    onSelectAssessment(assessmentData, evalItem.id, 'preview');
                                  }
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-bold transition-none"
                                title="Open pure official 8-page document view"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View PDF</span>
                              </button>

                              {/* Direct Download PDF */}
                              <button
                                onClick={() => {
                                  if (assessmentData) {
                                    onDownloadPdfForData(assessmentData);
                                  }
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded text-xs font-bold transition-none"
                                title="Download 8-page PDF directly to device"
                              >
                                <FileDown className="w-3.5 h-3.5 text-emerald-800" />
                                <span className="hidden sm:inline">Download</span>
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={(e) => handleDeleteAssessment(evalItem.id, e)}
                                disabled={deletingId === evalItem.id}
                                className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-none"
                                title="Delete this assessment record from Firebase"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};