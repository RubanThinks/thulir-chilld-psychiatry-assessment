import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import type { AssessmentData } from '../types/assessment';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firestore Database
export const db = getFirestore(app);

// Initialize Analytics safely
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((yes) => {
      if (yes) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Ignore if analytics is blocked or unsupported
    });
}

export interface CloudAssessmentSummary {
  id: string;
  studentId?: string;
  studentName: string;
  studentPhoto?: string;
  ageSex: string;
  dob?: string;
  diagnosis?: string;
  parentsGuardians?: string;
  doe: string;
  consultantName?: string;
  updatedAtText: string;
  updatedAtMillis?: number;
  data?: AssessmentData;
}

/**
 * Save assessment to Firestore
 */
export async function saveAssessmentToCloud(data: AssessmentData, existingId?: string): Promise<string> {
  const cleanId = (data.studentId || '').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanName = (data.name || 'Student').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanDoe = (data.doe || 'Eval').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const docId = existingId || (cleanId ? `${cleanId}_${cleanDoe}_${Date.now()}` : `${cleanName}_${cleanDoe}_${Date.now()}`);

  const docRef = doc(db, 'assessments', docId);
  await setDoc(
    docRef,
    {
      studentId: data.studentId || '',
      studentName: data.name || 'Unnamed Student',
      studentPhoto: data.studentPhoto || '',
      dob: data.dob || '',
      ageSex: data.ageSex || '',
      diagnosis: data.diagnosis || '',
      parentsGuardians: data.parentsGuardians || '',
      doe: data.doe || '',
      consultantName: data.consultant?.name || '',
      updatedAt: serverTimestamp(),
      data: data,
    },
    { merge: true }
  );

  // Maintain universal student profile document in 'students' collection for portal-wide integration
  if (data.studentId && data.studentId.trim()) {
    try {
      const cleanStudentKey = data.studentId.trim().toUpperCase().replace(/[^a-zA-Z0-9_-]/g, '_');
      const studentDocRef = doc(db, 'students', cleanStudentKey);
      await setDoc(
        studentDocRef,
        {
          studentId: data.studentId.trim().toUpperCase(),
          name: data.name || '',
          studentPhoto: data.studentPhoto || '',
          dob: data.dob || '',
          ageYears: data.ageYears || '',
          ageMonths: data.ageMonths || '',
          sex: data.sex || '',
          ageSex: data.ageSex || '',
          parentsGuardians: data.parentsGuardians || '',
          address: data.address || '',
          diagnosis: data.diagnosis || '',
          reference: data.reference || '',
          chiefComplaints: data.chiefComplaints || '',
          birthHistory: data.birthHistory || {},
          lastAssessmentDate: data.doe || '',
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('Could not sync universal student record to students collection:', e);
    }
  }

  return docId;
}

/**
 * List all saved assessments from Firestore
 */
export async function listCloudAssessments(): Promise<CloudAssessmentSummary[]> {
  const colRef = collection(db, 'assessments');
  let snap;
  try {
    const q = query(colRef, orderBy('updatedAt', 'desc'));
    snap = await getDocs(q);
  } catch (err) {
    // If ordering fails (e.g. index building), fallback to unordered
    snap = await getDocs(colRef);
  }

  return snap.docs.map((docSnap) => {
    const d = docSnap.data();
    let dateStr = 'Recently';
    let millis = 0;
    if (d.updatedAt?.toDate) {
      const jsDate = d.updatedAt.toDate();
      millis = jsDate.getTime();
      dateStr = jsDate.toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    }

    const assessmentPayload = (d.data || {}) as Partial<AssessmentData>;

    return {
      id: docSnap.id,
      studentId: d.studentId || assessmentPayload.studentId || '',
      studentName: d.studentName || assessmentPayload.name || 'Unnamed Student',
      studentPhoto: d.studentPhoto || assessmentPayload.studentPhoto || '',
      ageSex: d.ageSex || assessmentPayload.ageSex || '',
      dob: d.dob || assessmentPayload.dob || '',
      diagnosis: d.diagnosis || assessmentPayload.diagnosis || '',
      parentsGuardians: d.parentsGuardians || assessmentPayload.parentsGuardians || '',
      doe: d.doe || assessmentPayload.doe || '',
      consultantName: d.consultantName || assessmentPayload.consultant?.name || '',
      updatedAtText: dateStr,
      updatedAtMillis: millis,
      data: d.data as AssessmentData,
    };
  });
}

/**
 * Load assessment from Firestore by ID
 */
export async function loadAssessmentFromCloud(id: string): Promise<AssessmentData> {
  const docRef = doc(db, 'assessments', id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    throw new Error('Assessment not found in cloud.');
  }
  const cloudData = snap.data();
  return cloudData.data as AssessmentData;
}

/**
 * Delete assessment from Firestore by ID
 */
export async function deleteAssessmentFromCloud(id: string): Promise<void> {
  const docRef = doc(db, 'assessments', id);
  await deleteDoc(docRef);
}

/**
 * Universal Registered Student interface for cross-assessment student tracking
 */
export interface RegisteredStudent {
  studentId: string;
  name: string;
  studentPhoto?: string;
  dob?: string;
  ageYears?: string;
  ageMonths?: string;
  sex?: string;
  ageSex?: string;
  parentsGuardians?: string;
  address?: string;
  diagnosis?: string;
  reference?: string;
  chiefComplaints?: string;
  birthHistory?: {
    prenatal: string;
    perinatal: string;
    postnatal: string;
  };
  assessmentCount: number;
  lastDoe?: string;
}

/**
 * Parse any numeric sequential identifier from strings like 'TH-100', '101', 'TH-0102', 'THULIR-105'
 */
export function parseNumericStudentId(id: string): number | null {
  if (!id) return null;
  const match = id.match(/(?:TH-?|THULIR-?|ID-?)?0*(\d+)/i);
  if (match && match[1]) {
    const num = parseInt(match[1], 10);
    return isNaN(num) ? null : num;
  }
  return null;
}

/**
 * Calculate the next sequential unique Universal Student ID starting from 100.
 * Automatically checks existing cloud records to ensure strict uniqueness without collisions.
 */
export async function getNextSequentialStudentId(
  cachedSummaries?: CloudAssessmentSummary[]
): Promise<string> {
  const usedNumbers = new Set<number>();

  const processId = (idStr?: string) => {
    if (!idStr) return;
    const num = parseNumericStudentId(idStr);
    if (num !== null && num >= 100) {
      usedNumbers.add(num);
    }
  };

  if (cachedSummaries && cachedSummaries.length > 0) {
    cachedSummaries.forEach((s) => {
      processId(s.studentId);
      processId(s.data?.studentId);
    });
  } else {
    try {
      const snap = await getDocs(collection(db, 'assessments'));
      snap.forEach((d) => {
        const item = d.data();
        processId(item.studentId);
        processId(item.data?.studentId);
      });
    } catch (e) {
      console.warn('Could not query Firestore collection for student IDs:', e);
    }
  }

  // Find lowest available sequential number starting at 100
  let nextSeq = 100;
  while (usedNumbers.has(nextSeq)) {
    nextSeq++;
  }

  return `TH-${nextSeq}`;
}

/**
 * Extract distinct registered student profiles from cloud summaries
 */
export function extractRegisteredStudents(assessments: CloudAssessmentSummary[]): RegisteredStudent[] {
  const map = new Map<string, RegisteredStudent>();

  assessments.forEach((item) => {
    const rawId = (item.studentId || item.data?.studentId || '').trim().toUpperCase();
    const rawName = (item.studentName || item.data?.name || '').trim();
    if (!rawId && !rawName) return;

    // Index primarily by Student ID if present, otherwise normalized name
    const key = rawId ? `ID_${rawId}` : `NAME_${rawName.toLowerCase()}`;
    const d = item.data;

    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        studentId: rawId,
        name: rawName,
        studentPhoto: item.studentPhoto || d?.studentPhoto || '',
        dob: item.dob || d?.dob || '',
        ageYears: d?.ageYears || '',
        ageMonths: d?.ageMonths || '',
        sex: d?.sex || '',
        ageSex: item.ageSex || d?.ageSex || '',
        parentsGuardians: item.parentsGuardians || d?.parentsGuardians || '',
        address: d?.address || '',
        diagnosis: item.diagnosis || d?.diagnosis || '',
        reference: d?.reference || '',
        chiefComplaints: d?.chiefComplaints || '',
        birthHistory: d?.birthHistory,
        assessmentCount: 1,
        lastDoe: item.doe || d?.doe || '',
      });
    } else {
      existing.assessmentCount += 1;
      if (!existing.studentId && rawId) existing.studentId = rawId;
      if (!existing.studentPhoto && (item.studentPhoto || d?.studentPhoto)) {
        existing.studentPhoto = item.studentPhoto || d?.studentPhoto;
      }
      if (!existing.dob && (item.dob || d?.dob)) existing.dob = item.dob || d?.dob;
      if (!existing.ageSex && (item.ageSex || d?.ageSex)) existing.ageSex = item.ageSex || d?.ageSex;
      if (!existing.parentsGuardians && (item.parentsGuardians || d?.parentsGuardians)) {
        existing.parentsGuardians = item.parentsGuardians || d?.parentsGuardians;
      }
      if (!existing.address && d?.address) existing.address = d.address;
      if (!existing.diagnosis && (item.diagnosis || d?.diagnosis)) {
        existing.diagnosis = item.diagnosis || d?.diagnosis;
      }
      if (!existing.reference && d?.reference) existing.reference = d.reference;
      if (!existing.birthHistory && d?.birthHistory) existing.birthHistory = d.birthHistory;
    }
  });

  return Array.from(map.values()).sort((a, b) => {
    const numA = parseNumericStudentId(a.studentId) || 0;
    const numB = parseNumericStudentId(b.studentId) || 0;
    if (numA && numB) return numA - numB;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Search student profile from Firestore by exact Student ID
 */
export async function getStudentProfileFromCloud(studentId: string): Promise<Partial<AssessmentData> | null> {
  const cleanKey = studentId.trim().toUpperCase().replace(/[^a-zA-Z0-9_-]/g, '_');
  try {
    const studentRef = doc(db, 'students', cleanKey);
    const snap = await getDoc(studentRef);
    if (snap.exists()) {
      return snap.data() as Partial<AssessmentData>;
    }
  } catch (e) {
    // ignore
  }
  return null;
}
