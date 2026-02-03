import { AdjectiveEntry } from './types';

export const ADJECTIVE_DATA: AdjectiveEntry[] = [
  {
    positive: 'bonus',
    comparative: 'melior',
    comparativeFull: 'melior, -ius',
    superlative: 'optimus',
    superlativeFull: 'optimus, -a, -um',
    definition: 'good',
    definitionComparative: 'better',
    definitionSuperlative: 'best',
  },
  {
    positive: 'malus',
    comparative: 'peior',
    comparativeFull: 'peior, -ius',
    superlative: 'pessimus',
    superlativeFull: 'pessimus, -a, -um',
    definition: 'bad',
    definitionComparative: 'worse',
    definitionSuperlative: 'worst',
  },
  {
    positive: 'magnus',
    comparative: 'maior',
    comparativeFull: 'maior, -ius',
    superlative: 'maximus',
    superlativeFull: 'maximus, -a, -um',
    definition: 'great, large, big',
    definitionComparative: 'greater, larger, bigger',
    definitionSuperlative: 'greatest, largest, biggest',
  },
  {
    positive: 'parvus',
    comparative: 'minor',
    comparativeFull: 'minor, -us',
    superlative: 'minimus',
    superlativeFull: 'minimus, -a, -um',
    definition: 'small',
    definitionComparative: 'smaller, less',
    definitionSuperlative: 'smallest, least',
  },
  {
    positive: 'multus',
    comparative: 'plus',
    // Plus is a neuter noun in singular, so no -a, -um equivalent usually cited in this specific way.
    // However, keeping consistent data structure. We will expect just 'plus' or allow 'plus, pluris' if we wanted strictly dictionary.
    // Given the prompt asks for "all genders like... optimus, -a, -um", for 'plus' usually just 'plus' is accepted in basic drills.
    comparativeFull: 'plus', 
    superlative: 'plurimus',
    superlativeFull: 'plurimus, -a, -um',
    definition: 'much, many',
    definitionComparative: 'more',
    definitionSuperlative: 'most, very many',
  },
];