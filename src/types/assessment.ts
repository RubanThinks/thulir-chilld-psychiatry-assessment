export interface GrossMotorSkillItem {
  id: string;
  name: string;
  sublabel?: string;
  rating: 'Age appropriate' | 'Inappropriate' | '';
  specify: string;
}

export interface SensoryModulationItem {
  id: string;
  name: string;
  subname?: string;
  status: 'Hyper sensitivity' | 'Hyposensitivity' | 'Both' | '';
}

export interface AssessmentData {
  // Page 1
  studentPhoto: string;
  name: string;
  ageSex: string;
  ageYears?: string;
  ageMonths?: string;
  sex?: string;
  dob: string;
  doe: string;
  parentsGuardians: string;
  address: string;
  diagnosis: string;
  reference: string;
  chiefComplaints: string;
  birthHistory: {
    prenatal: string;
    perinatal: string;
    postnatal: string;
  };

  // Page 2
  presentMedicalHistory: string;
  familyHistory: {
    familyTree: string; // text or image url
    familyTreeImage?: string;
    consanguinity: 'Yes' | 'No' | '';
    consanguinityDetails: string;
    specificIllness: 'Yes' | 'No' | '';
    specificIllnessDetails: string;
    economicStatus: 'UC' | 'UMC' | 'LMC' | 'LC' | '';
  };
  educationalHistory: {
    typeOfSchool: string;
    ageAtWhichAdmitted: string;
    complaints: string;
    performance: string;
  };
  onObservation: {
    generalAppearance: 'Well built' | 'Moderately built' | 'Thin built' | '';
    stereotypicalBehaviors: string;
    eyeContact: 'Maintain well' | "Doesn't sustain" | 'Maintains partially' | '';
  };

  // Page 3
  onExamination: {
    grossMotorSkills: GrossMotorSkillItem[];
    fineMotorSkills: {
      handDominance: 'Right' | 'Left' | 'Mixed' | '';
      inHandManipulation: string;
      rotation: string;
      shift: string;
      translation: string;
      scissorSkills: string;
      dexterityPins: string;
      pickingUpObjectsWithTweezers: string;
      threadingBeads: string;
      paperFolding: string;
    };
  };

  // Page 4
  handWritingSkills: {
    preWriting: {
      scribbling: string;
      basicFigures: string;
      coloring: string;
      pencilGrasp: 'Static tripod' | 'Dynamic tripod' | 'Digital pronate' | 'Palmer supinate' | '';
    };
    writing: {
      alphabets: string;
      numbers: string;
    };
  };
  cognitivePerceptualSkills: {
    attentionAndMemory: {
      anticipatesRhymesOrSongs: boolean;
      pointsToyHidden: boolean;
      saysNurseryRhymes: boolean;
      identifiesFromPictures: boolean;
      remembersHiddenObjects: boolean;
      recallsPastEventStory: boolean;
    };
    conceptsGeneral: {
      sortsObjectsByColourFormName: boolean;
      followsDirections: boolean;
      identifiesColorsShapes: boolean;
      understandsHardSoft: boolean;
      understandsBackwardForward: boolean;
      namesExamplesWithinCategory: boolean;
      identifiesBodyParts: boolean;
    };
  };

  // Page 5
  sizeAndNumbers: {
    understandBigSmall: boolean;
    givesSelectsTwoThree: boolean;
    understandMoreLess: boolean;
    givesOneMore: boolean;
    count10Objects: boolean;
    givesCorrectNumberOfObjects: boolean;
    tellsCorrectAge: boolean;
    answerAddition2to10: boolean;
  };
  visualPerception: {
    imitatesBlockTrainPatterns: boolean;
    copiesHorizontalBlockPatterns: boolean;
    placesRoundSquareTriangle: boolean;
    putsTogether2PiecePuzzles: boolean;
    completes4to5PiecePuzzles: boolean;
    matchesLetterNumbersOnBoard: boolean;
  };
  socialEmotionalSkills: {
    eyeContactSees: boolean;
    recognizesParentsStrangers: boolean;
    strangerFear: boolean;
    attachmentToMother: boolean;
    respondsToOthersEmotions: boolean;
    greetsFamiliarAdults: boolean;
    imitatesAdults: boolean;
    respondsScoldedPatted: boolean;
    // Page 6 continuation
    respondsInSocialSituations: boolean;
    separatesFromParents: boolean;
    triesToMakePeerRelationship: boolean;
    expressesNeedsAppropriateWords: boolean;
    sharesThingsAndBelonging: boolean;
    takesTurnsWaits: boolean;
  };

  // Page 6
  communicationAndLanguagesSkills: {
    expressive: {
      namesCommonObject: boolean;
      names2to6Pictures: boolean;
      usesMonoBiSyllablesSentences: boolean;
      gesturesPoints: boolean;
    };
    receptive: {
      understandsSingleOr2StepCommands: boolean;
      understandGestures: boolean;
      respondsToYesNo: boolean;
      respondsToWhoWhereQuestions: boolean;
    };
  };
  selfCare: {
    toileting: string;
    eating: string;
    grooming: string;
    donningDoffingDress: string;
    bathing: string;
    puttingOnShoesSandals: string;
  };

  // Page 7
  play: string;
  sensoryModulation: SensoryModulationItem[];
  autisticFeatures: {
    communication: string;
    stereotype: string;
    socialization: string;
  };
  adhdFeatures: string;

  // Page 8
  standardizationTests: {
    administrationNote: string;
    cars: string;
    vanderbiltScale: string;
    mChat: string;
    gars2: string;
    therapyPlan: string;
  };
  consultant: {
    name: string;
    qualification: string;
    designation: string;
    signatureImage: string;
    date: string;
  };
}
