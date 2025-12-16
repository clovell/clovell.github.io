import { Verb, Conjugation } from './types';

export const VERBS: Verb[] = [
  // 1st Conjugation
  { 
    id: '1-1', 
    principalParts: ['amō', 'amāre', 'amāvī', 'amātus'], 
    conjugation: Conjugation.First, 
    definition: 'to love',
    etymology: 'From Proto-Italic *amā-, likely originating from a nursery word akin to "mama" or "amita" (aunt).'
  },
  { 
    id: '1-2', 
    principalParts: ['laudō', 'laudāre', 'laudāvī', 'laudātus'], 
    conjugation: Conjugation.First, 
    definition: 'to praise',
    etymology: 'Derived from the noun "laus" (praise), ultimately from PIE *leu- (to sing, song).'
  },
  { 
    id: '1-3', 
    principalParts: ['vocō', 'vocāre', 'vocāvī', 'vocātus'], 
    conjugation: Conjugation.First, 
    definition: 'to call',
    etymology: 'From "vōx" (voice), stemming from PIE *wekw- (to speak).'
  },
  { 
    id: '1-4', 
    principalParts: ['cōgitō', 'cōgitāre', 'cōgitāvī', 'cōgitātus'], 
    conjugation: Conjugation.First, 
    definition: 'to think',
    etymology: 'A contraction of "co-" (together) + "agitō" (to shake/drive), literally meaning "to turn over in the mind".'
  },
  { 
    id: '1-5', 
    principalParts: ['dō', 'dare', 'dedī', 'datus'], 
    conjugation: Conjugation.First, 
    definition: 'to give',
    etymology: 'From PIE *deh₃- (to give). Cognate with Greek "didōmi" and Sanskrit "dádāti".'
  },
  { 
    id: '1-6', 
    principalParts: ['stō', 'stāre', 'stetī', 'status'], 
    conjugation: Conjugation.First, 
    definition: 'to stand',
    etymology: 'From PIE *steh₂- (to stand). Directly cognate with the English word "stand".'
  },
  { 
    id: '1-7', 
    principalParts: ['iūdicō', 'iūdicāre', 'iūdicāvī', 'iūdicātus'], 
    conjugation: Conjugation.First, 
    definition: 'to judge',
    etymology: 'A compound of "iūs" (law) + "dīcō" (to speak/declare).'
  },
  { 
    id: '1-8', 
    principalParts: ['parō', 'parāre', 'parāvī', 'parātus'], 
    conjugation: Conjugation.First, 
    definition: 'to prepare',
    etymology: 'From PIE *per- (to produce, bring forth). Related to "parent".'
  },
  { 
    id: '1-9', 
    principalParts: ['spectō', 'spectāre', 'spectāvī', 'spectātus'], 
    conjugation: Conjugation.First, 
    definition: 'to watch',
    etymology: 'A frequentative form of "speciō" (to look at), emphasizing repeated action.'
  },
  { 
    id: '1-10', 
    principalParts: ['spērō', 'spērāre', 'spērāvī', 'spērātus'], 
    conjugation: Conjugation.First, 
    definition: 'to hope',
    etymology: 'Derived from the noun "spēs" (hope).'
  },

  // 2nd Conjugation
  { 
    id: '2-1', 
    principalParts: ['moneō', 'monēre', 'monuī', 'monitus'], 
    conjugation: Conjugation.Second, 
    definition: 'to warn, advise',
    etymology: 'Causative form from PIE *men- (to think), literally "to make someone think or remember".'
  },
  { 
    id: '2-2', 
    principalParts: ['habeō', 'habēre', 'habuī', 'habitus'], 
    conjugation: Conjugation.Second, 
    definition: 'to have, hold',
    etymology: 'From PIE *ghab- (to give or receive).'
  },
  { 
    id: '2-3', 
    principalParts: ['dēbeō', 'dēbēre', 'dēbuī', 'dēbitus'], 
    conjugation: Conjugation.Second, 
    definition: 'to owe, ought',
    etymology: 'Contraction of "dē-" (from/away) + "habeō" (to have), originally "to keep something away from someone".'
  },
  { 
    id: '2-4', 
    principalParts: ['videō', 'vidēre', 'vīdī', 'vīsus'], 
    conjugation: Conjugation.Second, 
    definition: 'to see',
    etymology: 'From PIE *weid- (to see, know). Cognate with English "wit" and "wise".'
  },
  { 
    id: '2-5', 
    principalParts: ['teneō', 'tenēre', 'tenuī', 'tentus'], 
    conjugation: Conjugation.Second, 
    definition: 'to hold',
    etymology: 'From PIE *ten- (to stretch). The sense shifted from "stretching" to "holding tight".'
  },
  { 
    id: '2-6', 
    principalParts: ['moveō', 'movēre', 'mōvī', 'mōtus'], 
    conjugation: Conjugation.Second, 
    definition: 'to move',
    etymology: 'From PIE *mew- (to push away). Source of English "motion" and "mobile".'
  },
  { 
    id: '2-7', 
    principalParts: ['doceō', 'docēre', 'docuī', 'doctus'], 
    conjugation: Conjugation.Second, 
    definition: 'to teach',
    etymology: 'Causative from PIE *dek- (to take, accept). Related to "doctor" and "docile".'
  },
  { 
    id: '2-8', 
    principalParts: ['maneō', 'manēre', 'mānsī', 'mānsus'], 
    conjugation: Conjugation.Second, 
    definition: 'to remain',
    etymology: 'From PIE *men- (to stay, stand still). Cognate with Greek "menō".'
  },
  { 
    id: '2-9', 
    principalParts: ['iubeō', 'iubēre', 'iussī', 'iussus'], 
    conjugation: Conjugation.Second, 
    definition: 'to order',
    etymology: 'Likely from Proto-Italic *youb-eō, related to "iūs" (law/right).'
  },
  { 
    id: '2-10', 
    principalParts: ['sedeō', 'sedēre', 'sēdī', 'sessus'], 
    conjugation: Conjugation.Second, 
    definition: 'to sit',
    etymology: 'From PIE *sed- (to sit). Cognate with English "sit" and "sedentary".'
  },

  // 3rd Conjugation
  { 
    id: '3-1', 
    principalParts: ['regō', 'regere', 'rēxī', 'rēctus'], 
    conjugation: Conjugation.Third, 
    definition: 'to rule, guide',
    etymology: 'From PIE *h₃reǵ- (to straighten). Cognate with "right", "rich", and "royal".'
  },
  { 
    id: '3-2', 
    principalParts: ['dūcō', 'dūcere', 'dūxī', 'ductus'], 
    conjugation: Conjugation.Third, 
    definition: 'to lead',
    etymology: 'From PIE *dewk- (to pull, draw). Cognate with English "tow" and "duke".'
  },
  { 
    id: '3-3', 
    principalParts: ['dīcō', 'dīcere', 'dīxī', 'dictus'], 
    conjugation: Conjugation.Third, 
    definition: 'to say',
    etymology: 'From PIE *deyk- (to show, point out). Cognate with "teach" and "token".'
  },
  { 
    id: '3-4', 
    principalParts: ['mittō', 'mittere', 'mīsī', 'missus'], 
    conjugation: Conjugation.Third, 
    definition: 'to send',
    etymology: 'Etymology uncertain, possibly from PIE *meyt- (to exchange, remove).'
  },
  { 
    id: '3-5', 
    principalParts: ['pōnō', 'pōnere', 'posuī', 'positus'], 
    conjugation: Conjugation.Third, 
    definition: 'to put, place',
    etymology: 'Contraction of "po-" (off/away) + "sinō" (to leave/lay).'
  },
  { 
    id: '3-6', 
    principalParts: ['scrībō', 'scrībere', 'scrīpsī', 'scrīptus'], 
    conjugation: Conjugation.Third, 
    definition: 'to write',
    etymology: 'From PIE *skreybh- (to scratch, incise). Originally referred to scratching marks on stone/wood.'
  },
  { 
    id: '3-7', 
    principalParts: ['agō', 'agere', 'ēgī', 'āctus'], 
    conjugation: Conjugation.Third, 
    definition: 'to do, drive',
    etymology: 'From PIE *h₂eǵ- (to drive). Cognate with English "acre" (a place where cattle are driven).'
  },
  { 
    id: '3-8', 
    principalParts: ['legō', 'legere', 'lēgī', 'lēctus'], 
    conjugation: Conjugation.Third, 
    definition: 'to read, choose',
    etymology: 'From PIE *leǵ- (to gather, collect). Reading was conceived as "collecting" words.'
  },
  { 
    id: '3-9', 
    principalParts: ['petō', 'petere', 'petīvī', 'petītus'], 
    conjugation: Conjugation.Third, 
    definition: 'to seek',
    etymology: 'From PIE *peth₂- (to fly). The meaning shifted from "flying at" to "attacking" to "seeking".'
  },
  { 
    id: '3-10', 
    principalParts: ['vincō', 'vincere', 'vīcī', 'victus'], 
    conjugation: Conjugation.Third, 
    definition: 'to conquer',
    etymology: 'From PIE *weyk- (to overcome). Cognate with "victim".'
  },

  // 3rd Conjugation -io
  { 
    id: '3io-1', 
    principalParts: ['capiō', 'capere', 'cēpī', 'captus'], 
    conjugation: Conjugation.ThirdIO, 
    definition: 'to take, seize',
    etymology: 'From PIE *kap- (to grasp). Cognate with English "heave" and "heavy".'
  },
  { 
    id: '3io-2', 
    principalParts: ['faciō', 'facere', 'fēcī', 'factus'], 
    conjugation: Conjugation.ThirdIO, 
    definition: 'to make, do',
    etymology: 'From PIE *dʰeh₁- (to put, place). Cognate with English "do".'
  },
  { 
    id: '3io-3', 
    principalParts: ['iaciō', 'iacere', 'iēcī', 'iactus'], 
    conjugation: Conjugation.ThirdIO, 
    definition: 'to throw',
    etymology: 'From PIE *yeh₁- (to throw). Source of "eject", "project", etc.'
  },
  { 
    id: '3io-4', 
    principalParts: ['fugiō', 'fugere', 'fūgī', 'fugitūrus'], 
    conjugation: Conjugation.ThirdIO, 
    definition: 'to flee',
    etymology: 'From PIE *bʰewg- (to flee). Cognate with Greek "pheugō".'
  },
  { 
    id: '3io-5', 
    principalParts: ['rapiō', 'rapere', 'rapuī', 'raptus'], 
    conjugation: Conjugation.ThirdIO, 
    definition: 'to seize, snatch',
    etymology: 'From PIE *h₁rep- (to snatch). Source of "rapid" and "raptor".'
  },
  { 
    id: '3io-6', 
    principalParts: ['cupiō', 'cupere', 'cupīvī', 'cupītus'], 
    conjugation: Conjugation.ThirdIO, 
    definition: 'to desire',
    etymology: 'From PIE *kup- (to tremble, desire). Source of "cupidity".'
  },
  { 
    id: '3io-7', 
    principalParts: ['aspiciō', 'aspicere', 'aspexī', 'aspectus'], 
    conjugation: Conjugation.ThirdIO, 
    definition: 'to look at',
    etymology: 'Compound of "ad-" (at/to) + "speciō" (to look).'
  },
  { 
    id: '3io-8', 
    principalParts: ['incipiō', 'incipere', 'incēpī', 'inceptus'], 
    conjugation: Conjugation.ThirdIO, 
    definition: 'to begin',
    etymology: 'Compound of "in-" (in/on) + "capiō" (to take). Literally "to take in hand" or "take on".'
  },

  // 4th Conjugation
  { 
    id: '4-1', 
    principalParts: ['audiō', 'audīre', 'audīvī', 'audītus'], 
    conjugation: Conjugation.Fourth, 
    definition: 'to hear',
    etymology: 'From PIE *h₂ew- (to perceive). Cognate with Greek "aisthanomai" (esthetic).'
  },
  { 
    id: '4-2', 
    principalParts: ['veniō', 'venīre', 'vēnī', 'ventus'], 
    conjugation: Conjugation.Fourth, 
    definition: 'to come',
    etymology: 'From PIE *gʷem- (to step). Cognate with English "come".'
  },
  { 
    id: '4-3', 
    principalParts: ['sentiō', 'sentīre', 'sēnsī', 'sēnsus'], 
    conjugation: Conjugation.Fourth, 
    definition: 'to feel',
    etymology: 'From PIE *sent- (to go, find out). Source of "sense" and "sentinel".'
  },
  { 
    id: '4-4', 
    principalParts: ['sciō', 'scīre', 'scīvī', 'scītus'], 
    conjugation: Conjugation.Fourth, 
    definition: 'to know',
    etymology: 'From PIE *skey- (to split, distinguish). Related to "science" (cutting/separating facts).'
  },
  { 
    id: '4-5', 
    principalParts: ['inveniō', 'invenīre', 'invēnī', 'inventus'], 
    conjugation: Conjugation.Fourth, 
    definition: 'to find',
    etymology: 'Compound of "in-" (upon) + "veniō" (to come), literally "to come upon".'
  },
  { 
    id: '4-6', 
    principalParts: ['dormiō', 'dormīre', 'dormīvī', 'dormītus'], 
    conjugation: Conjugation.Fourth, 
    definition: 'to sleep',
    etymology: 'From PIE *drem- (to sleep). Source of "dormitory".'
  },
  { 
    id: '4-7', 
    principalParts: ['aperiō', 'aperīre', 'aperuī', 'apertus'], 
    conjugation: Conjugation.Fourth, 
    definition: 'to open',
    etymology: 'Likely from "ab-" (off) + a root *wer- (to cover), literally "to uncover".'
  },
];

export const CONJUGATIONS_LIST = [
  Conjugation.First,
  Conjugation.Second,
  Conjugation.Third,
  Conjugation.ThirdIO,
  Conjugation.Fourth,
];