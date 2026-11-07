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
  ageSex: string;
  doe: string;
  updatedAtText: string;
}

/**
 * Save assessment to Firestore
 */
export async function saveAssessmentToCloud(data: AssessmentData, existingId?: string): Promise<string> {
  const cleanName = (data.name || 'Student').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const docId = existingId || `${cleanName}_${Date.now()}`;

  const docRef = doc(db, 'assessments', docId);
  await setDoc(
    docRef,
    {
      studentName: data.name || 'Unnamed Student',
      ageSex: data.ageSex || '',
      doe: data.doe || '',
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
    if (d.updatedAt?.toDate) {
      dateStr = d.updatedAt.toDate().toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    }

    return {
      id: docSnap.id,
      studentName: d.studentName || d.data?.name || 'Unnamed Student',
      ageSex: d.ageSex || d.data?.ageSex || '',
      doe: d.doe || d.data?.doe || '',
      updatedAtText: dateStr,
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
