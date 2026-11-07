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
  const cleanName = (data.name || 'Student').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanDoe = (data.doe || 'Eval').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const docId = existingId || `${cleanName}_${cleanDoe}_${Date.now()}`;

  const docRef = doc(db, 'assessments', docId);
  await setDoc(
    docRef,
    {
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
