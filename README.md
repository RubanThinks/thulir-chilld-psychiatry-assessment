# Thulir Special School & Therapy Centre - Child Psychiatry & Occupational Therapy Assessment Portal

A modern, responsive digital assessment software built specifically for **Thulir Special School & Therapy Centre** (64/S, Aruna Nagar, Near Ponmani Kalyana Mandapam, Nallampalayam, Ganapathy Post, Coimbatore - 641 006), faithfully digitizing the complete 8-page **Child Psychiatry Assessment - Occupational Therapy** protocol.

---

## 🌟 Key Features

### 1. Dual Workflow: Interactive Editor & Exact 1:1 Official PDF Report
- **Interactive Form (Mobile & Desktop)**: An 8-step clinical wizard matching each section of the assessment, with completion metrics, step navigation, and instant local auto-save.
- **Report View (PDF)**: Exact 1:1 replica of the official Thulir assessment document, preserving the authentic Thulir header, Tamil logo, clinic contact & address banner, page borders, tables, checkboxes, student photo box, and consultant sign-off.
- **Split-Screen Mode**: On desktop/tablets, therapists can view form inputs on the left while watching the 8-page printable report update live in real-time on the right.

### 2. Tailored Clinical Inputs & Word Limits
- **Adaptive Space Allocations**: Calibrated word limits on all observational and psychiatric fields (with real-time word counters and soft indicators) to prevent overflow in the printable document without drawing artificial underline marks.
- **Milestone Checklists**: Single-click toggles for Cognitive Perceptual, Size & Numbers, Visual Perception, Social-Emotional, and Language milestones.
- **Clinical Tables**:
  - **Gross Motor Skills**: 11 milestones with "Age appropriate" / "Inappropriate" and prompt-deficit specification.
  - **Sensory Modulation**: Matrix tracking Hyper-sensitivity, Hypo-sensitivity, and Mixed patterns across Tactile, Vestibular, Proprioceptive, Auditory, Visual, and Oral domains.

### 3. Rich Media & Digital Signatures
- **Student Passport Photo**: Upload from device, paste cloud/URL link, or preview standard 3:4 passport framing on Page 1.
- **Family Tree / Pedigree**: Upload custom pedigree diagram or describe in text.
- **Touch / Stylus Signature Pad**: Allows occupational therapists to sign digitally directly on touchscreen/mobile devices, clear/redraw, or upload a digital signature stamp.

### 4. Prepared for Firebase & Cloudinary Integrations
- All models, types, and state trees (`AssessmentData`) are normalized and JSON-serializable.
- Ready to plug into Firebase Firestore (`setDoc`, `onSnapshot`) and Cloudinary image upload presets once backend credentials are provided.
- Built-in JSON Export & Import allowing offline backup, transfer, and template loading.
- Instant "Load Sample Case" (Aarav Krishnan, 4.5 yrs, ASD Level 2) for immediate end-to-end testing.

---

## 📄 8-Page Assessment Structure Mapped

| Page | Document Section | Interactive Features |
|------|------------------|----------------------|
| **Page 1** | Demographic Data, Chief Complaints, Birth History | Student photo upload, DOB/DOE pickers, Prenatal/Perinatal/Postnatal history |
| **Page 2** | Medical, Family, Education & Observation | Pedigree upload, Consanguinity & Illness tags, Economic status, Eye contact |
| **Page 3** | On Examination: Gross & Fine Motor Skills | 11-row motor milestone table, In-hand manipulation, Hand dominance |
| **Page 4** | Handwriting & Cognitive Perceptual Skills | Pencil grasp styles, Pre-writing, Attention & Memory checklist, General Concepts |
| **Page 5** | Size & Numbers, Visual Perception, Social Emotional | Numerical concepts, Block & puzzle tasks, Social responsivity items |
| **Page 6** | Social (Cont.), Communication & Self Care (ADL) | Expressive & Receptive language, Toileting, Dressing, Grooming, Feeding |
| **Page 7** | Play, Sensory Modulation & Autistic/ADHD Features | Sensory matrix (Hypo/Hyper), Communication/Stereotype/Socialization domains |
| **Page 8** | Standardization Tests, Therapy Plan & Sign-off | CARS, Vanderbilt, M-CHAT, GARS-2, Comprehensive Therapy Plan, Digital Signature |

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
The application will run at `http://localhost:5173`.
