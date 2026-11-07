import type { AssessmentData } from '../types/assessment';

export const initialGrossMotorSkills = [
  { id: 'walking', name: 'Walking', rating: '' as const, specify: '' },
  { id: 'running', name: 'Running', rating: '' as const, specify: '' },
  { id: 'jumping_floor', name: 'Jumping', sublabel: 'Floor level', rating: '' as const, specify: '' },
  { id: 'jumping_height', name: 'Jumping', sublabel: 'From height', rating: '' as const, specify: '' },
  { id: 'hopping', name: 'Hopping', rating: '' as const, specify: '' },
  { id: 'obstacle_crossing', name: 'Obstacle crossing', rating: '' as const, specify: '' },
  { id: 'unilateral_standing', name: 'Unilateral standing', rating: '' as const, specify: '' },
  { id: 'stair_climbing', name: 'Stair climbing', rating: '' as const, specify: '' },
  { id: 'climbing_play_equipment', name: 'Climbing play equipment', rating: '' as const, specify: '' },
  { id: 'balance_beam_walking', name: 'Balance beam walking', rating: '' as const, specify: '' },
  { id: 'tandem_walking', name: 'Tandem walking', rating: '' as const, specify: '' },
];

export const initialSensoryModulation = [
  { id: 'tactile', name: 'Tactile', status: '' as const },
  { id: 'vestibular', name: 'Vestibular', status: '' as const },
  { id: 'proprioceptive', name: 'Proprioceptive', status: '' as const },
  { id: 'auditory', name: 'Auditory', status: '' as const },
  { id: 'visual', name: 'Visual', status: '' as const },
  { id: 'oral_peri', name: 'Oral', subname: 'Peri', status: '' as const },
  { id: 'oral_intra', name: 'Oral', subname: 'Intra', status: '' as const },
];

export const emptyAssessment: AssessmentData = {
  // Page 1
  studentPhoto: '',
  name: '',
  ageSex: '',
  ageYears: '',
  ageMonths: '',
  sex: '',
  dob: '',
  doe: new Date().toISOString().split('T')[0],
  parentsGuardians: '',
  address: '',
  diagnosis: '',
  reference: '',
  chiefComplaints: '',
  birthHistory: {
    prenatal: '',
    perinatal: '',
    postnatal: '',
  },

  // Page 2
  presentMedicalHistory: '',
  familyHistory: {
    familyTree: '',
    familyTreeImage: '',
    consanguinity: '',
    consanguinityDetails: '',
    specificIllness: '',
    specificIllnessDetails: '',
    economicStatus: '',
  },
  educationalHistory: {
    typeOfSchool: '',
    ageAtWhichAdmitted: '',
    complaints: '',
    performance: '',
  },
  onObservation: {
    generalAppearance: '',
    stereotypicalBehaviors: '',
    eyeContact: '',
  },

  // Page 3
  onExamination: {
    grossMotorSkills: initialGrossMotorSkills,
    fineMotorSkills: {
      handDominance: '',
      inHandManipulation: '',
      rotation: '',
      shift: '',
      translation: '',
      scissorSkills: '',
      dexterityPins: '',
      pickingUpObjectsWithTweezers: '',
      threadingBeads: '',
      paperFolding: '',
    },
  },

  // Page 4
  handWritingSkills: {
    preWriting: {
      scribbling: '',
      basicFigures: '',
      coloring: '',
      pencilGrasp: '',
    },
    writing: {
      alphabets: '',
      numbers: '',
    },
  },
  cognitivePerceptualSkills: {
    attentionAndMemory: {
      anticipatesRhymesOrSongs: false,
      pointsToyHidden: false,
      saysNurseryRhymes: false,
      identifiesFromPictures: false,
      remembersHiddenObjects: false,
      recallsPastEventStory: false,
    },
    conceptsGeneral: {
      sortsObjectsByColourFormName: false,
      followsDirections: false,
      identifiesColorsShapes: false,
      understandsHardSoft: false,
      understandsBackwardForward: false,
      namesExamplesWithinCategory: false,
      identifiesBodyParts: false,
    },
  },

  // Page 5
  sizeAndNumbers: {
    understandBigSmall: false,
    givesSelectsTwoThree: false,
    understandMoreLess: false,
    givesOneMore: false,
    count10Objects: false,
    givesCorrectNumberOfObjects: false,
    tellsCorrectAge: false,
    answerAddition2to10: false,
  },
  visualPerception: {
    imitatesBlockTrainPatterns: false,
    copiesHorizontalBlockPatterns: false,
    placesRoundSquareTriangle: false,
    putsTogether2PiecePuzzles: false,
    completes4to5PiecePuzzles: false,
    matchesLetterNumbersOnBoard: false,
  },
  socialEmotionalSkills: {
    eyeContactSees: false,
    recognizesParentsStrangers: false,
    strangerFear: false,
    attachmentToMother: false,
    respondsToOthersEmotions: false,
    greetsFamiliarAdults: false,
    imitatesAdults: false,
    respondsScoldedPatted: false,
    respondsInSocialSituations: false,
    separatesFromParents: false,
    triesToMakePeerRelationship: false,
    expressesNeedsAppropriateWords: false,
    sharesThingsAndBelonging: false,
    takesTurnsWaits: false,
  },

  // Page 6
  communicationAndLanguagesSkills: {
    expressive: {
      namesCommonObject: false,
      names2to6Pictures: false,
      usesMonoBiSyllablesSentences: false,
      gesturesPoints: false,
    },
    receptive: {
      understandsSingleOr2StepCommands: false,
      understandGestures: false,
      respondsToYesNo: false,
      respondsToWhoWhereQuestions: false,
    },
  },
  selfCare: {
    toileting: '',
    eating: '',
    grooming: '',
    donningDoffingDress: '',
    bathing: '',
    puttingOnShoesSandals: '',
  },

  // Page 7
  play: '',
  sensoryModulation: initialSensoryModulation,
  autisticFeatures: {
    communication: '',
    stereotype: '',
    socialization: '',
  },
  adhdFeatures: '',

  // Page 8
  standardizationTests: {
    administrationNote: '',
    cars: '',
    vanderbiltScale: '',
    mChat: '',
    gars2: '',
    therapyPlan: '',
  },
  consultant: {
    name: 'Dr. S. VENKATESAN, BOT',
    qualification: 'Peadiatric Occupational Therapist',
    designation: 'Founder & Peadiatric Occupational Therapist',
    signatureImage: '',
    date: new Date().toISOString().split('T')[0],
  },
};

export const sampleDemoAssessment: AssessmentData = {
  // Page 1
  studentPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=240&auto=format&fit=crop&q=80',
  name: 'Aarav Krishnan',
  ageSex: '4 Years 6 Months / Male',
  ageYears: '4',
  ageMonths: '6',
  sex: 'Male',
  dob: '2022-04-18',
  doe: '2026-11-04',
  parentsGuardians: 'Mr. R. Krishnan (Father), Mrs. Priya Krishnan (Mother)',
  address: 'No. 42, Vasanth Nagar, Ramanathapuram, Coimbatore - 641 045',
  diagnosis: 'Autism Spectrum Disorder (Level 2) with Sensory Processing Dysfunction',
  reference: 'Dr. M. Karthikeyan, MD (Pediatrics), Rainbow Children Hospital',
  chiefComplaints: 'Parent reports delayed speech, inadequate eye contact, frequent hand flapping during excitement, excessive sensory craving for spinning objects, toe walking, and difficulty participating in playgroup activities with peers.',
  birthHistory: {
    prenatal: 'Full term pregnancy. Mother had mild morning sickness in first trimester. Regular antenatal checkups with normal fetal ultrasound scans. No gestational diabetes or hypertension.',
    perinatal: 'Delivered via lower segment caesarean section (LSCS) due to non-progression of labour at 39 weeks. Birth weight: 3.1 kg. Cried immediately after birth, APGAR score 9/10 at 5 mins.',
    postnatal: 'Physiological neonatal jaundice noted on Day 3, resolved spontaneously with phototherapy for 24 hours. No seizures or systemic infections. Timely immunization completed up to date.',
  },

  // Page 2
  presentMedicalHistory: 'Child was initially brought for speech delay evaluation at 2.5 years. Hearing test (BERA) was performed and confirmed normal bilaterally. Neurological exam ruled out focal neurological deficits. No prior history of head trauma, febrile convulsions, or chronic childhood medical illnesses.',
  familyHistory: {
    familyTree: 'Pedigree reveals nuclear family with single male child. Non-consanguineous marriage. Paternal uncle has mild speech stuttering.',
    consanguinity: 'No',
    consanguinityDetails: '',
    specificIllness: 'No',
    specificIllnessDetails: '',
    economicStatus: 'UMC',
  },
  educationalHistory: {
    typeOfSchool: 'Mainstream Pre-KG (Kindergarten)',
    ageAtWhichAdmitted: '3 Years 6 Months',
    complaints: 'Difficulty sitting in circle time, wanders around classroom, does not follow verbal instructions of teacher, resists group tabletop tasks.',
    performance: 'Excels in assembling puzzles and block sorting; struggles with peer verbal interaction and coloring inside lines.',
  },
  onObservation: {
    generalAppearance: 'Well built',
    stereotypicalBehaviors: 'Frequent hand flapping when excited; bilateral toe walking during transition between therapy rooms; visual inspection of spinning wheels.',
    eyeContact: 'Maintains partially',
  },

  // Page 3
  onExamination: {
    grossMotorSkills: [
      { id: 'walking', name: 'Walking', rating: 'Inappropriate', specify: 'Intermittent bilateral toe walking noted' },
      { id: 'running', name: 'Running', rating: 'Age appropriate', specify: '' },
      { id: 'jumping_floor', name: 'Jumping', sublabel: 'Floor level', rating: 'Age appropriate', specify: 'Can jump with both feet together' },
      { id: 'jumping_height', name: 'Jumping', sublabel: 'From height', rating: 'Inappropriate', specify: 'Hesitant to jump from 6 inch step without hand support' },
      { id: 'hopping', name: 'Hopping', rating: 'Inappropriate', specify: 'Unable to hop on single leg independently' },
      { id: 'obstacle_crossing', name: 'Obstacle crossing', rating: 'Age appropriate', specify: 'Steps over low hurdles smoothly' },
      { id: 'unilateral_standing', name: 'Unilateral standing', rating: 'Inappropriate', specify: 'Maintains balance for less than 2 seconds' },
      { id: 'stair_climbing', name: 'Stair climbing', rating: 'Age appropriate', specify: 'Ascends and descends alternating feet with railing support' },
      { id: 'climbing_play_equipment', name: 'Climbing play equipment', rating: 'Age appropriate', specify: 'Enjoys climbing rope ladder and small slide' },
      { id: 'balance_beam_walking', name: 'Balance beam walking', rating: 'Inappropriate', specify: 'Steps off beam after 2-3 steps; requires therapist guidance' },
      { id: 'tandem_walking', name: 'Tandem walking', rating: 'Inappropriate', specify: 'Not yet achieved; difficulty with heel-to-toe line matching' },
    ],
    fineMotorSkills: {
      handDominance: 'Right',
      inHandManipulation: 'Emerging; drops small beads when trying to adjust within the palm',
      rotation: 'Simple rotation achieved with cylindrical pegs; complex rotation needs physical prompt',
      shift: 'Demonstrates finger-to-palm shift; palm-to-finger shift is clumsy',
      translation: 'Able to pick 2 coins and move to palm sequentially',
      scissorSkills: 'Can snip paper strips; cannot yet cut along straight continuous lines',
      dexterityPins: 'Able to place cylindrical pins in pegboard; pincer grasp slightly weak',
      pickingUpObjectsWithTweezers: 'Requires moderate hand-over-hand assistance for jumbo tweezers',
      threadingBeads: 'Threads 4 large wooden beads onto rigid plastic lace independently',
      paperFolding: 'Creases single fold in half with verbal modeling',
    },
  },

  // Page 4
  handWritingSkills: {
    preWriting: {
      scribbling: 'Active spontaneous scribbling across full paper landscape',
      basicFigures: 'Imitates vertical and horizontal strokes; circular strokes are emerging',
      coloring: 'Colors within 50% border accuracy on large simple shapes',
      pencilGrasp: 'Dynamic tripod',
    },
    writing: {
      alphabets: 'Traces uppercase A, B, C, L, T with finger guidance on sandpaper cards',
      numbers: 'Traces numbers 1, 2, 3 with tactile reinforcement',
    },
  },
  cognitivePerceptualSkills: {
    attentionAndMemory: {
      anticipatesRhymesOrSongs: true,
      pointsToyHidden: true,
      saysNurseryRhymes: false,
      identifiesFromPictures: true,
      remembersHiddenObjects: true,
      recallsPastEventStory: false,
    },
    conceptsGeneral: {
      sortsObjectsByColourFormName: true,
      followsDirections: true,
      identifiesColorsShapes: true,
      understandsHardSoft: false,
      understandsBackwardForward: false,
      namesExamplesWithinCategory: false,
      identifiesBodyParts: true,
    },
  },

  // Page 5
  sizeAndNumbers: {
    understandBigSmall: true,
    givesSelectsTwoThree: true,
    understandMoreLess: true,
    givesOneMore: false,
    count10Objects: true,
    givesCorrectNumberOfObjects: false,
    tellsCorrectAge: false,
    answerAddition2to10: false,
  },
  visualPerception: {
    imitatesBlockTrainPatterns: true,
    copiesHorizontalBlockPatterns: true,
    placesRoundSquareTriangle: true,
    putsTogether2PiecePuzzles: true,
    completes4to5PiecePuzzles: true,
    matchesLetterNumbersOnBoard: true,
  },
  socialEmotionalSkills: {
    eyeContactSees: true,
    recognizesParentsStrangers: true,
    strangerFear: false,
    attachmentToMother: true,
    respondsToOthersEmotions: false,
    greetsFamiliarAdults: false,
    imitatesAdults: true,
    respondsScoldedPatted: true,
    respondsInSocialSituations: false,
    separatesFromParents: true,
    triesToMakePeerRelationship: false,
    expressesNeedsAppropriateWords: false,
    sharesThingsAndBelonging: false,
    takesTurnsWaits: false,
  },

  // Page 6
  communicationAndLanguagesSkills: {
    expressive: {
      namesCommonObject: true,
      names2to6Pictures: true,
      usesMonoBiSyllablesSentences: false,
      gesturesPoints: true,
    },
    receptive: {
      understandsSingleOr2StepCommands: true,
      understandGestures: true,
      respondsToYesNo: false,
      respondsToWhoWhereQuestions: false,
    },
  },
  selfCare: {
    toileting: 'Partially toilet trained for daytime bladder; requires reminder and routine schedule. Wears pull-ups at night.',
    eating: 'Finger feeds chapati, idli, snacks independently. Uses spoon with slight spillage for rice dishes.',
    grooming: 'Tolerates teeth brushing with mild oral resistance; washes hands with water independently.',
    donningDoffingDress: 'Removes socks, shoes, and elastic shorts independently; needs assistance to align t-shirt neck and buttons.',
    bathing: 'Enjoys warm water bath and water play; needs total parent supervision for soaping and drying.',
    puttingOnShoesSandals: 'Puts on velcro sandals; occasionally reverses left and right shoe.',
  },

  // Page 7
  play: 'Predominantly exploratory and repetitive constructive play. Loves aligning vehicle wheels, spinning tops, and building tall wooden block towers. Minimal symbolic or imaginative role-play without adult prompting.',
  sensoryModulation: [
    { id: 'tactile', name: 'Tactile', status: 'Hyper sensitivity' },
    { id: 'vestibular', name: 'Vestibular', status: 'Hyposensitivity' },
    { id: 'proprioceptive', name: 'Proprioceptive', status: 'Hyposensitivity' },
    { id: 'auditory', name: 'Auditory', status: 'Hyper sensitivity' },
    { id: 'visual', name: 'Visual', status: 'Hyposensitivity' },
    { id: 'oral_peri', name: 'Oral', subname: 'Peri', status: 'Hyper sensitivity' },
    { id: 'oral_intra', name: 'Oral', subname: 'Intra', status: 'Hyper sensitivity' },
  ],
  autisticFeatures: {
    communication: 'Uses single words ("water", "cookie", "ball") with pointing and leading parent by hand. Occasional echolalic repetition of cartoon phrases. Absent conversational reciprocity.',
    stereotype: 'Rhythmic bilateral hand flapping upon sensory overload or intense delight. Spins coin toys and peers closely at rotating ceiling fan blades.',
    socialization: 'Prefers solitary play alongside peers (parallel play). Does not spontaneously initiate cooperative games or share toys without physical facilitation.',
  },
  adhdFeatures: 'Moderate motor restlessness during seated sedentary tasks. Attention span is approximately 4-6 minutes for non-preferred activities, but extends to 25 minutes for preferred visual puzzles and block play.',

  // Page 8
  standardizationTests: {
    administrationNote: 'Standardized assessment tools administered in a structured sensory-calibrated therapy room with parent present for reassurance.',
    cars: 'Childhood Autism Rating Scale (CARS-2): Raw Score = 34.5 (Mild-to-Moderate Autism spectrum range). Marked differences noted in relating to people, adaptation to change, and sensory responsiveness.',
    vanderbiltScale: "Vanderbilt ADHD Parent/Teacher Rating Scale: Sub-threshold hyperactivity indicators primarily attributed to sensory-seeking arousal regulation rather than primary ADHD.",
    mChat: 'Modified Checklist for Autism in Toddlers (M-CHAT-R/F): High Risk (Score 8/20 on initial screen failed items including pointing, response to name, and pretend play).',
    gars2: 'Gilliam Autism Rating Scale (GARS-2): Autism Index = 92 (Average probability of Autism Spectrum Disorder).',
    therapyPlan: '1. Sensory Integration Therapy (SI) 3 sessions/week focusing on vestibular calming, proprioceptive joint compression, and sensory diet implementation.\n2. Occupational Therapy focusing on bilateral coordination, dynamic tripod grasp strengthening, and scissor skills.\n3. Activities of Daily Living (ADL) training for independent dressing, shoe fastening, and mealtime independence.\n4. Visual schedule and PECS (Picture Exchange Communication System) integration for expressive communication.\n5. Home program counseling for sensory regulation and parent coaching.',
  },
  consultant: {
    name: 'Dr. S. VENKATESAN, BOT',
    qualification: 'Peadiatric Occupational Therapist',
    designation: 'Founder & Peadiatric Occupational Therapist',
    signatureImage: '',
    date: '2026-11-04',
  },
};
