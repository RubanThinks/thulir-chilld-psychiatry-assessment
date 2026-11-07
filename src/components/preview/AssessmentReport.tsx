import React from 'react';
import type { AssessmentData } from '../../types/assessment';
import { ThulirHeader } from '../common/ThulirHeader';

interface AssessmentReportProps {
  data: AssessmentData;
  scale?: number;
}

// Reusable Checkbox Component for PDF/Report View
const ReportCheckbox: React.FC<{ checked: boolean; label?: string }> = ({ checked, label }) => (
  <span className="inline-flex items-center gap-1.5 mr-3 select-none text-[11.5px] document-font shrink-0">
    <span
      className={`inline-flex items-center justify-center w-3.5 h-3.5 border border-black bg-white font-bold text-[10px] leading-none shrink-0 ${
        checked ? 'text-black' : 'text-transparent'
      }`}
    >
      {checked ? '✓' : ''}
    </span>
    {label && <span className="text-black whitespace-nowrap">{label}</span>}
  </span>
);

export const AssessmentReport: React.FC<AssessmentReportProps> = ({ data }) => {
  return (
    <div id="pure-official-document" className="printable-report document-font text-black print:m-0 print:p-0">
      {/* ========================================================
          PAGE 1: DEMOGRAPHICS & CHIEF COMPLAINTS & BIRTH HISTORY
         ======================================================== */}
      <section className="a4-page a4-page-screen page-break bg-white text-black print:shadow-none print:border-none">
        <div className="assessment-border flex flex-col justify-between">
          <div>
            <ThulirHeader />

            {/* Demographics Section */}
            <div className="mt-1">
              <h2 className="font-bold text-[12px] mb-2 uppercase tracking-wide text-black">Demographic data</h2>

              <div className="flex gap-4 items-start">
                {/* Left: Info items */}
                <div className="flex-1 space-y-1.5 text-[11.5px]">
                  <div className="flex items-start">
                    <span className="w-36 shrink-0 font-semibold text-black">Name</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="flex-1 font-bold text-black uppercase break-words">{data.name || ''}</span>
                  </div>

                  <div className="flex items-start">
                    <span className="w-36 shrink-0 font-semibold text-black">Age / sex</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="flex-1 font-medium text-black break-words">{data.ageSex || ''}</span>
                  </div>

                  <div className="flex items-start">
                    <span className="w-36 shrink-0 font-semibold text-black">DOB</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="flex-1 text-black break-words">{data.dob || ''}</span>
                  </div>

                  <div className="flex items-start">
                    <span className="w-36 shrink-0 font-semibold text-black">DOE</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="flex-1 text-black break-words">{data.doe || ''}</span>
                  </div>

                  <div className="flex items-start">
                    <span className="w-36 shrink-0 font-semibold text-black">Parents &amp; Guardians</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="flex-1 text-black leading-snug break-words">{data.parentsGuardians || ''}</span>
                  </div>

                  <div className="flex items-start">
                    <span className="w-36 shrink-0 font-semibold text-black">Address</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="flex-1 text-black leading-snug break-words">{data.address || ''}</span>
                  </div>

                  <div className="flex items-start pt-0.5">
                    <span className="w-36 shrink-0 font-semibold text-black">Diagnosis</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="flex-1 font-bold text-black leading-snug break-words">{data.diagnosis || ''}</span>
                  </div>

                  <div className="flex items-start">
                    <span className="w-36 shrink-0 font-semibold text-black">Reference</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="flex-1 text-black leading-snug break-words">{data.reference || ''}</span>
                  </div>
                </div>

                {/* Right: Student Passport Photo Box */}
                <div className="w-28 h-36 shrink-0 border border-black flex items-center justify-center bg-white overflow-hidden">
                  {data.studentPhoto ? (
                    <img
                      src={data.studentPhoto}
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2 text-slate-400 text-[10px] uppercase font-semibold">
                      Student Photo
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Chief Complaints - Generous proportional height */}
          <div className="pt-2 text-[11.5px] flex-1 flex flex-col justify-start">
            <div className="font-bold text-[12px] text-black mb-1">Chief Complaints :</div>
            <p className="text-black leading-relaxed text-justify break-words min-h-[80px]">
              {data.chiefComplaints || ''}
            </p>
          </div>

          {/* Birth History - Formatted to fill down to bottom border */}
          <div className="pt-2 text-[11.5px] space-y-2.5">
            <div className="font-bold text-[12px] text-black">Birth history :</div>

            <div className="space-y-2">
              <div className="flex items-start">
                <span className="w-24 shrink-0 font-bold text-black">Prenatal :</span>
                <p className="flex-1 text-black leading-relaxed break-words min-h-[44px]">{data.birthHistory.prenatal || ''}</p>
              </div>

              <div className="flex items-start">
                <span className="w-24 shrink-0 font-bold text-black">Perinatal :</span>
                <p className="flex-1 text-black leading-relaxed break-words min-h-[44px]">{data.birthHistory.perinatal || ''}</p>
              </div>

              <div className="flex items-start">
                <span className="w-24 shrink-0 font-bold text-black">Postnatal :</span>
                <p className="flex-1 text-black leading-relaxed break-words min-h-[44px]">{data.birthHistory.postnatal || ''}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          PAGE 2: MEDICAL, FAMILY, EDUCATION & OBSERVATION
         ======================================================== */}
      <section className="a4-page a4-page-screen page-break bg-white text-black print:shadow-none print:border-none">
        <div className="assessment-border flex flex-col justify-between text-[11.5px]">
          {/* Present Medical History - Generous top block */}
          <div className="space-y-1">
            <div className="font-bold text-[12px] text-black">Present Medical History :</div>
            <p className="text-black leading-relaxed text-justify min-h-[140px] break-words">
              {data.presentMedicalHistory || ''}
            </p>
          </div>

          {/* Family History */}
          <div className="space-y-2.5 pt-2">
            <div className="font-bold text-[12px] text-black">Family History</div>

            <div className="flex items-start">
              <span className="w-48 shrink-0 font-semibold text-black">Family tree</span>
              <span className="w-3 shrink-0 text-center">:</span>
              <div className="flex-1">
                {data.familyHistory.familyTreeImage && (
                  <img
                    src={data.familyHistory.familyTreeImage}
                    alt="Family Tree"
                    className="max-h-24 object-contain border border-black rounded mb-1"
                  />
                )}
                <span className="text-black break-words leading-relaxed">{data.familyHistory.familyTree || ''}</span>
              </div>
            </div>

            <div className="flex items-center">
              <span className="w-48 shrink-0 font-semibold text-black">Consanguinity</span>
              <span className="w-3 shrink-0 text-center">:</span>
              <div className="flex-1 flex flex-wrap items-center gap-2">
                <ReportCheckbox checked={data.familyHistory.consanguinity === 'Yes'} label="Yes" />
                <ReportCheckbox checked={data.familyHistory.consanguinity === 'No'} label="No" />
                <span className="text-[11px] text-black">
                  (if yes specify) <span className="font-medium underline-offset-2 break-words">{data.familyHistory.consanguinityDetails || ''}</span>
                </span>
              </div>
            </div>

            <div className="flex items-start">
              <span className="w-48 shrink-0 font-semibold text-black leading-tight">Specific family history of relevant illness</span>
              <span className="w-3 shrink-0 text-center">:</span>
              <div className="flex-1 flex flex-wrap items-center gap-2">
                <ReportCheckbox checked={data.familyHistory.specificIllness === 'Yes'} label="Yes" />
                <ReportCheckbox checked={data.familyHistory.specificIllness === 'No'} label="No" />
                <span className="text-[11px] text-black">
                  (if yes specify) <span className="font-medium underline-offset-2 break-words">{data.familyHistory.specificIllnessDetails || ''}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <span className="w-48 shrink-0 font-semibold text-black">Economic status</span>
              <span className="w-3 shrink-0 text-center">:</span>
              <div className="flex-1 flex items-center gap-3">
                <ReportCheckbox checked={data.familyHistory.economicStatus === 'UC'} label="UC" />
                <ReportCheckbox checked={data.familyHistory.economicStatus === 'UMC'} label="UMC" />
                <ReportCheckbox checked={data.familyHistory.economicStatus === 'LMC'} label="LMC" />
                <ReportCheckbox checked={data.familyHistory.economicStatus === 'LC'} label="LC" />
              </div>
            </div>
          </div>

          {/* Educational History */}
          <div className="space-y-2 pt-2">
            <div className="font-bold text-[12px] text-black">Educational History</div>

            <div className="flex items-start">
              <span className="w-48 shrink-0 font-semibold text-black">Type of school</span>
              <span className="w-3 shrink-0 text-center">:</span>
              <span className="flex-1 text-black break-words">{data.educationalHistory.typeOfSchool || ''}</span>
            </div>

            <div className="flex items-start">
              <span className="w-48 shrink-0 font-semibold text-black">Age at which admitted</span>
              <span className="w-3 shrink-0 text-center">:</span>
              <span className="flex-1 text-black break-words">{data.educationalHistory.ageAtWhichAdmitted || ''}</span>
            </div>

            <div className="flex items-start">
              <span className="w-48 shrink-0 font-semibold text-black">Complaints</span>
              <span className="w-3 shrink-0 text-center">:</span>
              <span className="flex-1 text-black break-words leading-relaxed">{data.educationalHistory.complaints || ''}</span>
            </div>

            <div className="flex items-start">
              <span className="w-48 shrink-0 font-semibold text-black">Performance</span>
              <span className="w-3 shrink-0 text-center">:</span>
              <span className="flex-1 text-black break-words leading-relaxed">{data.educationalHistory.performance || ''}</span>
            </div>
          </div>

          {/* On Observation - Anchored near bottom */}
          <div className="space-y-2 pt-2 pb-1">
            <div className="font-bold text-[12px] text-black">On Observation</div>

            <div className="flex items-center">
              <span className="w-48 shrink-0 font-semibold text-black">General appearance</span>
              <span className="w-3 shrink-0 text-center">:</span>
              <div className="flex-1 flex items-center gap-3">
                <ReportCheckbox checked={data.onObservation.generalAppearance === 'Well built'} label="Well built" />
                <ReportCheckbox checked={data.onObservation.generalAppearance === 'Moderately built'} label="Moderately built" />
                <ReportCheckbox checked={data.onObservation.generalAppearance === 'Thin built'} label="Thin built" />
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-48 shrink-0 leading-tight">
                <div className="font-semibold text-black">Stereotypical behaviors</div>
                <div className="text-[10px] text-slate-700">(If any)</div>
              </div>
              <span className="w-3 shrink-0 text-center">:</span>
              <span className="flex-1 text-black leading-relaxed break-words">{data.onObservation.stereotypicalBehaviors || ''}</span>
            </div>

            <div className="flex items-center">
              <span className="w-48 shrink-0 font-semibold text-black">Eye contact</span>
              <span className="w-3 shrink-0 text-center">:</span>
              <div className="flex-1 flex items-center gap-3">
                <ReportCheckbox checked={data.onObservation.eyeContact === 'Maintain well'} label="Maintain well" />
                <ReportCheckbox checked={data.onObservation.eyeContact === "Doesn't sustain"} label="Doesn't sustain" />
                <ReportCheckbox checked={data.onObservation.eyeContact === 'Maintains partially'} label="Maintains partially" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          PAGE 3: ON EXAMINATION - GROSS MOTOR & FINE MOTOR SKILLS
         ======================================================== */}
      <section className="a4-page a4-page-screen page-break bg-white text-black print:shadow-none print:border-none">
        <div className="assessment-border flex flex-col justify-between text-[11.5px]">
          {/* Top Half: Gross Motor Skills Table */}
          <div>
            <div className="font-bold text-[12px] text-black mb-1.5">On Examination :</div>

            <table className="w-full border-collapse border border-black table-fixed text-[11px]">
              <thead>
                <tr className="border-b border-black bg-slate-50">
                  <th className="border-r border-black p-1.5 text-left font-bold w-[32%]">Gross motor skills</th>
                  <th className="border-r border-black p-1.5 text-center font-bold w-[18%]">Age appropriate</th>
                  <th className="border-r border-black p-1.5 text-center font-bold w-[18%]">Inappropriate</th>
                  <th className="p-1.5 text-left font-bold w-[32%]">Specify, if inappropriate</th>
                </tr>
              </thead>
              <tbody>
                {data.onExamination.grossMotorSkills.map((item) => (
                  <tr key={item.id} className="border-b border-black">
                    <td className="border-r border-black p-1.5 pl-2 break-words">
                      {item.name}
                      {item.sublabel && (
                        <span className="block pl-3 text-[10px] text-slate-800">{item.sublabel}</span>
                      )}
                    </td>
                    <td className="border-r border-black p-1.5 text-center font-bold text-black text-[12px]">
                      {item.rating === 'Age appropriate' ? '✓' : ''}
                    </td>
                    <td className="border-r border-black p-1.5 text-center font-bold text-black text-[12px]">
                      {item.rating === 'Inappropriate' ? '✓' : ''}
                    </td>
                    <td className="p-1.5 pl-2 text-black text-[11px] break-words">
                      {item.specify || ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Half: Fine Motor Skills */}
          <div className="space-y-2 pt-2">
            <div className="font-bold text-[12px] text-black">Fine Motor Skills :</div>

            <div className="flex items-center py-1">
              <span className="w-56 shrink-0 font-semibold text-black">Hand dominance</span>
              <span className="w-3 shrink-0 text-center">:</span>
              <div className="flex-1 flex items-center gap-4">
                <ReportCheckbox checked={data.onExamination.fineMotorSkills.handDominance === 'Right'} label="Right" />
                <ReportCheckbox checked={data.onExamination.fineMotorSkills.handDominance === 'Left'} label="Left" />
                <ReportCheckbox checked={data.onExamination.fineMotorSkills.handDominance === 'Mixed'} label="Mixed" />
              </div>
            </div>

            {[
              { label: 'In-hand manipulation', value: data.onExamination.fineMotorSkills.inHandManipulation },
              { label: 'Rotation', value: data.onExamination.fineMotorSkills.rotation },
              { label: 'Shift', value: data.onExamination.fineMotorSkills.shift },
              { label: 'Translation', value: data.onExamination.fineMotorSkills.translation },
              { label: 'Scissor skills', value: data.onExamination.fineMotorSkills.scissorSkills },
              { label: 'Dexterity pins', value: data.onExamination.fineMotorSkills.dexterityPins },
              { label: 'Picking up objects with tweezers', value: data.onExamination.fineMotorSkills.pickingUpObjectsWithTweezers },
              { label: 'Threading beads', value: data.onExamination.fineMotorSkills.threadingBeads },
              { label: 'Paper folding', value: data.onExamination.fineMotorSkills.paperFolding },
            ].map((field) => (
              <div key={field.label} className="flex items-start leading-normal py-1">
                <span className="w-56 shrink-0 font-normal text-black">{field.label}</span>
                <span className="w-3 shrink-0 text-center">:</span>
                <span className="flex-1 text-black font-medium break-words">{field.value || ''}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          PAGE 4: HANDWRITING & COGNITIVE PERCEPTUAL SKILLS
         ======================================================== */}
      <section className="a4-page a4-page-screen page-break bg-white text-black print:shadow-none print:border-none">
        <div className="assessment-border flex flex-col justify-between text-[11.5px]">
          {/* Top Block: Hand Writing Skills */}
          <div className="space-y-2">
            <div className="font-bold text-[12px] text-black">Hand Writing Skills</div>

            <div className="font-bold text-black pl-1">Pre-writing</div>
            <div className="flex items-start pl-2 py-1">
              <span className="w-40 shrink-0 font-normal text-black">Scribbling</span>
              <span className="w-3 shrink-0 text-center">:</span>
              <span className="flex-1 text-black break-words">{data.handWritingSkills.preWriting.scribbling || ''}</span>
            </div>
            <div className="flex items-start pl-2 py-1">
              <span className="w-40 shrink-0 font-normal text-black">Basic figures</span>
              <span className="w-3 shrink-0 text-center">:</span>
              <span className="flex-1 text-black break-words">{data.handWritingSkills.preWriting.basicFigures || ''}</span>
            </div>
            <div className="flex items-start pl-2 py-1">
              <span className="w-40 shrink-0 font-normal text-black">Coloring</span>
              <span className="w-3 shrink-0 text-center">:</span>
              <span className="flex-1 text-black break-words">{data.handWritingSkills.preWriting.coloring || ''}</span>
            </div>
            <div className="flex items-center pl-2 py-1">
              <span className="w-40 shrink-0 font-normal text-black">Pencil grasp</span>
              <span className="w-3 shrink-0 text-center">:</span>
              <div className="flex-1 flex flex-wrap items-center gap-3">
                <ReportCheckbox checked={data.handWritingSkills.preWriting.pencilGrasp === 'Static tripod'} label="Static tripod" />
                <ReportCheckbox checked={data.handWritingSkills.preWriting.pencilGrasp === 'Dynamic tripod'} label="Dynamic tripod" />
                <ReportCheckbox checked={data.handWritingSkills.preWriting.pencilGrasp === 'Digital pronate'} label="Digital pronate" />
                <ReportCheckbox checked={data.handWritingSkills.preWriting.pencilGrasp === 'Palmer supinate'} label="Palmer supinate" />
              </div>
            </div>

            <div className="font-bold text-black pl-1 pt-1">Writing</div>
            <div className="flex items-start pl-2 py-1">
              <span className="w-40 shrink-0 font-normal text-black">Alphabets</span>
              <span className="w-3 shrink-0 text-center">:</span>
              <span className="flex-1 text-black break-words">{data.handWritingSkills.writing.alphabets || ''}</span>
            </div>
            <div className="flex items-start pl-2 py-1">
              <span className="w-40 shrink-0 font-normal text-black">Numbers</span>
              <span className="w-3 shrink-0 text-center">:</span>
              <span className="flex-1 text-black break-words">{data.handWritingSkills.writing.numbers || ''}</span>
            </div>
          </div>

          {/* Middle Block: Attention & Memory (6 items) */}
          <div className="space-y-1.5 pt-2">
            <div className="font-bold text-[12px] text-black">Cognitive Perceptual Skills :</div>
            <div className="font-bold text-black pl-1">Attention &amp; Memory :</div>

            {[
              { key: 'anticipatesRhymesOrSongs', label: 'Anticipates parts of rhymes or songs' },
              { key: 'pointsToyHidden', label: 'Points to the hand in which toy is hidden' },
              { key: 'saysNurseryRhymes', label: 'Says or sings atleast 2 nursery rhymes or songs in a group or with an adult' },
              { key: 'identifiesFromPictures', label: 'Identifies from 4 or more pictures' },
              { key: 'remembersHiddenObjects', label: 'Remembers and names which is of 3 objects has been hidden' },
              { key: 'recallsPastEventStory', label: 'Recalls event in the past / story' },
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center pl-2 pr-1 py-1">
                <span className="text-black text-[11.5px] max-w-[85%] break-words">{item.label}</span>
                <ReportCheckbox checked={data.cognitivePerceptualSkills.attentionAndMemory[item.key as keyof typeof data.cognitivePerceptualSkills.attentionAndMemory]} />
              </div>
            ))}
          </div>

          {/* Bottom Block: Concepts (General) (7 items) */}
          <div className="space-y-1.5 pt-2 pb-1">
            <div className="font-bold text-black pl-1">Concepts : (General)</div>

            {[
              { key: 'sortsObjectsByColourFormName', label: 'Sorts objects by colour, form, name' },
              { key: 'followsDirections', label: 'Follows direction-in, out ; up / down' },
              { key: 'identifiesColorsShapes', label: 'Identifies atleast 3 colors & 2 shapes' },
              { key: 'understandsHardSoft', label: 'Understands hard/ soft' },
              { key: 'understandsBackwardForward', label: 'Understands backward/ forward' },
              { key: 'namesExamplesWithinCategory', label: 'Names examples within a category (Animals, objects in kitchen, clothes)' },
              { key: 'identifiesBodyParts', label: 'Identifies 3 - 6 body parts' },
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center pl-2 pr-1 py-1">
                <span className="text-black text-[11.5px] max-w-[85%] break-words">{item.label}</span>
                <ReportCheckbox checked={data.cognitivePerceptualSkills.conceptsGeneral[item.key as keyof typeof data.cognitivePerceptualSkills.conceptsGeneral]} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          PAGE 5: SIZE & NUMBERS, VISUAL PERCEPTION, SOCIAL EMOTIONAL
         ======================================================== */}
      <section className="a4-page a4-page-screen page-break bg-white text-black print:shadow-none print:border-none">
        <div className="assessment-border flex flex-col justify-between text-[11.5px]">
          {/* Section 1: Size and numbers (8 items) */}
          <div className="space-y-1">
            <div className="font-bold text-[12px] text-black mb-1">Size and numbers</div>

            {[
              { key: 'understandBigSmall', label: 'Understand big / small' },
              { key: 'givesSelectsTwoThree', label: 'Gives / selects two and three' },
              { key: 'understandMoreLess', label: 'Understand more / less' },
              { key: 'givesOneMore', label: 'Gives one more' },
              { key: 'count10Objects', label: 'Count 10 objects in a row' },
              { key: 'givesCorrectNumberOfObjects', label: 'Gives correct number of objects when asked' },
              { key: 'tellsCorrectAge', label: 'Tells correct age' },
              { key: 'answerAddition2to10', label: 'Answer addition question involving +2 to 10' },
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center pl-1 pr-1 py-1">
                <span className="text-black text-[11.5px] break-words">{item.label}</span>
                <ReportCheckbox checked={data.sizeAndNumbers[item.key as keyof typeof data.sizeAndNumbers]} />
              </div>
            ))}
          </div>

          {/* Section 2: Visual perception; [block design and puzzles] (6 items) */}
          <div className="space-y-1 pt-2">
            <div className="font-bold text-[12px] text-black mb-1">Visual perception; [block design and puzzles]</div>

            {[
              { key: 'imitatesBlockTrainPatterns', label: 'Imitates block train and block patterns' },
              { key: 'copiesHorizontalBlockPatterns', label: 'Copies horizontal block patterns' },
              { key: 'placesRoundSquareTriangle', label: 'Places round, square and triangle from on form board' },
              { key: 'putsTogether2PiecePuzzles', label: 'Puts together 2 piece puzzles' },
              { key: 'completes4to5PiecePuzzles', label: 'Completes 4 to 5 piece puzzles' },
              { key: 'matchesLetterNumbersOnBoard', label: 'Matches letter and numbers on board' },
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center pl-1 pr-1 py-1">
                <span className="text-black text-[11.5px] break-words">{item.label}</span>
                <ReportCheckbox checked={data.visualPerception[item.key as keyof typeof data.visualPerception]} />
              </div>
            ))}
          </div>

          {/* Section 3: Social emotional skills (8 items) */}
          <div className="space-y-1 pt-2 pb-1">
            <div className="font-bold text-[12px] text-black mb-1">Social emotional skills</div>

            {[
              { key: 'eyeContactSees', label: 'Eye contact ................... [Sees]' },
              { key: 'recognizesParentsStrangers', label: 'Recognizes parents/ strangers' },
              { key: 'strangerFear', label: 'Stranger fear / on fear' },
              { key: 'attachmentToMother', label: 'Attachment to mother' },
              { key: 'respondsToOthersEmotions', label: 'Responds to others emotions' },
              { key: 'greetsFamiliarAdults', label: 'Greets familiar adults' },
              { key: 'imitatesAdults', label: 'Imitates adults [picking up, dusting]' },
              { key: 'respondsScoldedPatted', label: 'Responds appropriately when scolded / patted' },
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center pl-1 pr-1 py-1">
                <span className="text-black text-[11.5px] break-words">{item.label}</span>
                <ReportCheckbox checked={data.socialEmotionalSkills[item.key as keyof typeof data.socialEmotionalSkills]} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          PAGE 6: SOCIAL EMOTIONAL (CONT), COMMUNICATION, SELF CARE
         ======================================================== */}
      <section className="a4-page a4-page-screen page-break bg-white text-black print:shadow-none print:border-none">
        <div className="assessment-border flex flex-col justify-between text-[11.5px]">
          {/* Top: Social emotional skills continuation (6 items) */}
          <div className="space-y-1">
            {[
              { key: 'respondsInSocialSituations', label: 'Responds appropriately in social situations' },
              { key: 'separatesFromParents', label: 'Separates from parents in familiar surroundings' },
              { key: 'triesToMakePeerRelationship', label: 'Tries to make peer relationship' },
              { key: 'expressesNeedsAppropriateWords', label: 'Expresses needs through appropriate words' },
              { key: 'sharesThingsAndBelonging', label: 'Shares things and belonging' },
              { key: 'takesTurnsWaits', label: 'Takes turns and waits for his / her turn' },
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center pl-1 pr-1 py-1">
                <span className="text-black text-[11.5px] break-words">{item.label}</span>
                <ReportCheckbox checked={data.socialEmotionalSkills[item.key as keyof typeof data.socialEmotionalSkills]} />
              </div>
            ))}
          </div>

          {/* Middle: Communication and languages skills (8 items) */}
          <div className="space-y-2 pt-2">
            <div className="font-bold text-[12px] text-black">Communication and languages skills :</div>

            <div className="font-bold text-black pl-1">Expressive :</div>
            {[
              { key: 'namesCommonObject', label: 'Names common object' },
              { key: 'names2to6Pictures', label: 'Names 2-6 pictures in pictures book' },
              { key: 'usesMonoBiSyllablesSentences', label: 'Uses mono syllables, bisyllables 2 or 3 word sentences' },
              { key: 'gesturesPoints', label: 'Gestures, points' },
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center pl-2 pr-1 py-1">
                <span className="text-black text-[11.5px] break-words">{item.label}</span>
                <ReportCheckbox checked={data.communicationAndLanguagesSkills.expressive[item.key as keyof typeof data.communicationAndLanguagesSkills.expressive]} />
              </div>
            ))}

            <div className="font-bold text-black pl-1 pt-1">Receptive</div>
            {[
              { key: 'understandsSingleOr2StepCommands', label: 'Understands single or 2 step commands' },
              { key: 'understandGestures', label: 'Understand gestures' },
              { key: 'respondsToYesNo', label: 'Responds to yes / no' },
              { key: 'respondsToWhoWhereQuestions', label: 'Responds to who, where questions' },
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center pl-2 pr-1 py-1">
                <span className="text-black text-[11.5px] break-words">{item.label}</span>
                <ReportCheckbox checked={data.communicationAndLanguagesSkills.receptive[item.key as keyof typeof data.communicationAndLanguagesSkills.receptive]} />
              </div>
            ))}
          </div>

          {/* Bottom: Self Care (6 items) */}
          <div className="space-y-2 pt-2 pb-1">
            <div className="font-bold text-[12px] text-black mb-1">Self Care</div>

            {[
              { label: 'Toileting', value: data.selfCare.toileting },
              { label: 'Eating', value: data.selfCare.eating },
              { label: 'Grooming', value: data.selfCare.grooming },
              { label: 'Donning and doffing dress', value: data.selfCare.donningDoffingDress },
              { label: 'Bathing', value: data.selfCare.bathing },
              { label: 'Putting on shoes / sandals', value: data.selfCare.puttingOnShoesSandals },
            ].map((field) => (
              <div key={field.label} className="flex items-start leading-normal py-1">
                <span className="w-56 shrink-0 font-normal text-black">{field.label}</span>
                <span className="w-3 shrink-0 text-center">:</span>
                <span className="flex-1 text-black font-medium break-words">{field.value || ''}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          PAGE 7: PLAY, SENSORY MODULATION, AUTISTIC & ADHD FEATURES
         ======================================================== */}
      <section className="a4-page a4-page-screen page-break bg-white text-black print:shadow-none print:border-none">
        <div className="assessment-border flex flex-col justify-between text-[11.5px]">
          {/* Play */}
          <div className="space-y-1">
            <div className="font-bold text-[12px] text-black">Play :</div>
            <p className="text-black leading-relaxed text-justify min-h-[50px] break-words">
              {data.play || ''}
            </p>
          </div>

          {/* Sensory Modulation Table */}
          <div className="pt-1">
            <table className="w-full border-collapse border border-black table-fixed text-[11px]">
              <thead>
                <tr className="border-b border-black bg-slate-50">
                  <th className="border-r border-black p-1.5 text-left font-bold w-[34%]">Sensory modulation</th>
                  <th className="border-r border-black p-1.5 text-center font-bold w-[22%]">Hyper sensitivity</th>
                  <th className="border-r border-black p-1.5 text-center font-bold w-[22%]">Hyposensitivity</th>
                  <th className="p-1.5 text-center font-bold w-[22%]">Both</th>
                </tr>
              </thead>
              <tbody>
                {data.sensoryModulation.map((item) => (
                  <tr key={item.id} className="border-b border-black">
                    <td className="border-r border-black p-1.5 pl-2 break-words">
                      {item.subname ? (
                        <div className="flex justify-between pr-2">
                          <span>{item.id === 'oral_peri' ? item.name : ''}</span>
                          <span className="font-semibold">{item.subname}</span>
                        </div>
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className="border-r border-black p-1.5 text-center font-bold text-black text-[12px]">
                      {item.status === 'Hyper sensitivity' ? '✓' : ''}
                    </td>
                    <td className="border-r border-black p-1.5 text-center font-bold text-black text-[12px]">
                      {item.status === 'Hyposensitivity' ? '✓' : ''}
                    </td>
                    <td className="p-1.5 text-center font-bold text-black text-[12px]">
                      {item.status === 'Both' ? '✓' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Autistic Features */}
          <div className="space-y-2 pt-1">
            <div className="font-bold text-[12px] text-black">Autistic Features :</div>

            <div className="space-y-0.5 pl-1">
              <div className="font-bold text-black">1. Communication</div>
              <p className="text-black leading-relaxed text-justify min-h-[40px] break-words pl-2">
                {data.autisticFeatures.communication || ''}
              </p>
            </div>

            <div className="space-y-0.5 pl-1">
              <div className="font-bold text-black">2. Stereotype</div>
              <p className="text-black leading-relaxed text-justify min-h-[40px] break-words pl-2">
                {data.autisticFeatures.stereotype || ''}
              </p>
            </div>

            <div className="space-y-0.5 pl-1">
              <div className="font-bold text-black">3. Socialization</div>
              <p className="text-black leading-relaxed text-justify min-h-[40px] break-words pl-2">
                {data.autisticFeatures.socialization || ''}
              </p>
            </div>
          </div>

          {/* ADHD Features */}
          <div className="space-y-1 pt-1 pb-1">
            <div className="font-bold text-[12px] text-black">ADHD Features :</div>
            <p className="text-black leading-relaxed text-justify min-h-[40px] break-words pl-1">
              {data.adhdFeatures || ''}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          PAGE 8: STANDARDIZATION TESTS, THERAPY PLAN & SIGNATURE
         ======================================================== */}
      <section className="a4-page a4-page-screen bg-white text-black print:shadow-none print:border-none">
        <div className="assessment-border flex flex-col justify-between text-[11.5px]">
          {/* Top standardized tests block */}
          <div className="space-y-3">
            <div>
              <div className="font-bold text-black mb-0.5">Administration of Standardization Tests :</div>
              <p className="text-black leading-relaxed text-justify min-h-[30px] break-words">
                {data.standardizationTests.administrationNote || ''}
              </p>
            </div>

            <div>
              <div className="font-bold text-black mb-0.5">CARS :</div>
              <p className="text-black leading-relaxed text-justify min-h-[30px] break-words">
                {data.standardizationTests.cars || ''}
              </p>
            </div>

            <div>
              <div className="font-bold text-black mb-0.5">VANDERILT'S ADHD SCALE :</div>
              <p className="text-black leading-relaxed text-justify min-h-[30px] break-words">
                {data.standardizationTests.vanderbiltScale || ''}
              </p>
            </div>

            <div>
              <div className="font-bold text-black mb-0.5">M-CHAT :</div>
              <p className="text-black leading-relaxed text-justify min-h-[30px] break-words">
                {data.standardizationTests.mChat || ''}
              </p>
            </div>

            <div>
              <div className="font-bold text-black mb-0.5">GARS-2 :</div>
              <p className="text-black leading-relaxed text-justify min-h-[30px] break-words">
                {data.standardizationTests.gars2 || ''}
              </p>
            </div>

            {/* Comprehensive Therapy Plan */}
            <div>
              <div className="font-bold text-black mb-0.5">THERAPY PLAN :</div>
              <p className="text-black leading-relaxed whitespace-pre-line text-justify min-h-[140px] break-words">
                {data.standardizationTests.therapyPlan || ''}
              </p>
            </div>
          </div>

          {/* Bottom Right: Consultant Name & Signature Block */}
          <div className="mt-4 flex flex-col items-end text-right pb-1">
            <div className="w-72 flex flex-col items-center">
              {data.consultant.signatureImage ? (
                <img
                  src={data.consultant.signatureImage}
                  alt="Signature"
                  className="h-14 max-w-[200px] object-contain mb-1"
                />
              ) : (
                <div className="h-14" />
              )}
              <div className="font-bold text-[13px] text-black">
                {data.consultant.name || 'Dr. S. VENKATESAN, BOT'}
              </div>
              <div className="text-[11.5px] text-black font-bold">
                Peadiatric Occupational Therapist
              </div>
              <div className="text-[10.5px] text-black font-semibold">
                Founder &amp; Clinical Director
              </div>
              {data.consultant.date && (
                <div className="text-[10.5px] text-black mt-0.5">Date: {data.consultant.date}</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
