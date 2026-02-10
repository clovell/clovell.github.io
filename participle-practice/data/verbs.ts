import { Verb } from '../types';

// TEACHER INSTRUCTIONS:
// Add verbs to this list. Ensure 'conjugation' matches one of the allowed types.
// principalParts should be: [1st sg present, infinitive, perfect active, perfect passive/supine]

export const VERB_LIST: Verb[] = [
  {
    id: '1',
    principalParts: ['amō', 'amāre', 'amāvī', 'amātus'],
    conjugation: '1',
    definition: 'to love',
  },
  {
    id: '2',
    principalParts: ['moneō', 'monēre', 'monuī', 'monitus'],
    conjugation: '2',
    definition: 'to warn',
  },
  {
    id: '3',
    principalParts: ['regō', 'regere', 'rēxī', 'rēctus'],
    conjugation: '3',
    definition: 'to rule',
  },
  {
    id: '4',
    principalParts: ['capiō', 'capere', 'cēpī', 'captus'],
    conjugation: '3io',
    definition: 'to take',
  },
  {
    id: '5',
    principalParts: ['audiō', 'audīre', 'audīvī', 'audītus'],
    conjugation: '4',
    definition: 'to hear',
  },
  {
    id: '6',
    principalParts: ['portō', 'portāre', 'portāvī', 'portātus'],
    conjugation: '1',
    definition: 'to carry',
  },
  {
    id: '7',
    principalParts: ['doceō', 'docēre', 'docuī', 'doctus'],
    conjugation: '2',
    definition: 'to teach',
  },
  {
    id: '8',
    principalParts: ['dūcō', 'dūcere', 'dūxī', 'ductus'],
    conjugation: '3',
    definition: 'to lead',
  },
  {
    id: '9',
    principalParts: ['faciō', 'facere', 'fēcī', 'factus'],
    conjugation: '3io',
    definition: 'to make/do',
  },
  {
    id: '10',
    principalParts: ['veniō', 'venīre', 'vēnī', 'ventum'],
    conjugation: '4',
    definition: 'to come',
  },
];
