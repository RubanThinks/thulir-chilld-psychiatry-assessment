export const WORD_LIMITS = {
  chiefComplaints: 90,
  prenatal: 50,
  perinatal: 50,
  postnatal: 50,
  presentMedicalHistory: 160,
  familyTree: 40,
  schoolComplaints: 45,
  schoolPerformance: 45,
  stereotypicalBehaviors: 30,
  grossMotorSpecify: 15,
  fineMotorItem: 20,
  preWritingItem: 20,
  writingItem: 20,
  selfCareItem: 30,
  play: 70,
  autisticFeatureItem: 55,
  adhdFeatures: 60,
  administrationNote: 45,
  standardTestItem: 50,
  therapyPlan: 140,
} as const;

export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function enforceWordLimit(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ');
}
