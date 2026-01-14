// This file acts as the database. You can add more verbs here.
window.VERB_DATA = [
  // --- 1st Conjugation ---
  {
    id: 'amare',
    principalParts: 'amō, amāre, amāvī, amātus',
    infinitive: 'amāre',
    definition: 'to love',
    conjugation: '1st',
    futureActive: {
      s1: 'amābō',
      s2: 'amābis',
      s3: 'amābit',
      p1: 'amābimus',
      p2: 'amābitis',
      p3: 'amābunt'
    }
  },
  {
    id: 'laudare',
    principalParts: 'laudō, laudāre, laudāvī, laudātus',
    infinitive: 'laudāre',
    definition: 'to praise',
    conjugation: '1st',
    futureActive: {
      s1: 'laudābō',
      s2: 'laudābis',
      s3: 'laudābit',
      p1: 'laudābimus',
      p2: 'laudābitis',
      p3: 'laudābunt'
    }
  },
  {
    id: 'portare',
    principalParts: 'portō, portāre, portāvī, portātus',
    infinitive: 'portāre',
    definition: 'to carry',
    conjugation: '1st',
    futureActive: {
      s1: 'portābō',
      s2: 'portābis',
      s3: 'portābit',
      p1: 'portābimus',
      p2: 'portābitis',
      p3: 'portābunt'
    }
  },
  {
    id: 'vocare',
    principalParts: 'vocō, vocāre, vocāvī, vocātus',
    infinitive: 'vocāre',
    definition: 'to call',
    conjugation: '1st',
    futureActive: {
      s1: 'vocābō',
      s2: 'vocābis',
      s3: 'vocābit',
      p1: 'vocābimus',
      p2: 'vocābitis',
      p3: 'vocābunt'
    }
  },
  {
    id: 'dare',
    principalParts: 'dō, dare, dedī, datus',
    infinitive: 'dare',
    definition: 'to give',
    conjugation: '1st',
    futureActive: {
      s1: 'dabō',
      s2: 'dabis',
      s3: 'dabit',
      p1: 'dabimus',
      p2: 'dabitis',
      p3: 'dabunt'
    }
  },
  {
    id: 'stare',
    principalParts: 'stō, stāre, stetī, statūrus',
    infinitive: 'stāre',
    definition: 'to stand',
    conjugation: '1st',
    futureActive: {
      s1: 'stābō',
      s2: 'stābis',
      s3: 'stābit',
      p1: 'stābimus',
      p2: 'stābitis',
      p3: 'stābunt'
    }
  },
  {
    id: 'ambulare',
    principalParts: 'ambulō, ambulāre, ambulāvī, ambulātus',
    infinitive: 'ambulāre',
    definition: 'to walk',
    conjugation: '1st',
    futureActive: {
      s1: 'ambulābō',
      s2: 'ambulābis',
      s3: 'ambulābit',
      p1: 'ambulābimus',
      p2: 'ambulābitis',
      p3: 'ambulābunt'
    }
  },

  // --- 2nd Conjugation ---
  {
    id: 'monere',
    principalParts: 'moneō, monēre, monuī, monitus',
    infinitive: 'monēre',
    definition: 'to warn, advise',
    conjugation: '2nd',
    futureActive: {
      s1: 'monēbō',
      s2: 'monēbis',
      s3: 'monēbit',
      p1: 'monēbimus',
      p2: 'monēbitis',
      p3: 'monēbunt'
    }
  },
  {
    id: 'habere',
    principalParts: 'habeō, habēre, habuī, habitus',
    infinitive: 'habēre',
    definition: 'to have, hold',
    conjugation: '2nd',
    futureActive: {
      s1: 'habēbō',
      s2: 'habēbis',
      s3: 'habēbit',
      p1: 'habēbimus',
      p2: 'habēbitis',
      p3: 'habēbunt'
    }
  },
  {
    id: 'videre',
    principalParts: 'videō, vidēre, vīdī, vīsus',
    infinitive: 'vidēre',
    definition: 'to see',
    conjugation: '2nd',
    futureActive: {
      s1: 'vidēbō',
      s2: 'vidēbis',
      s3: 'vidēbit',
      p1: 'vidēbimus',
      p2: 'vidēbitis',
      p3: 'vidēbunt'
    }
  },
  {
    id: 'terrere',
    principalParts: 'terreō, terrēre, terruī, territus',
    infinitive: 'terrēre',
    definition: 'to frighten',
    conjugation: '2nd',
    futureActive: {
      s1: 'terrēbō',
      s2: 'terrēbis',
      s3: 'terrēbit',
      p1: 'terrēbimus',
      p2: 'terrēbitis',
      p3: 'terrēbunt'
    }
  },
  {
    id: 'movere',
    principalParts: 'moveō, movēre, mōvī, mōtus',
    infinitive: 'movēre',
    definition: 'to move',
    conjugation: '2nd',
    futureActive: {
      s1: 'movēbō',
      s2: 'movēbis',
      s3: 'movēbit',
      p1: 'movēbimus',
      p2: 'movēbitis',
      p3: 'movēbunt'
    }
  },
  {
    id: 'sedere',
    principalParts: 'sedeō, sedēre, sēdī, sessus',
    infinitive: 'sedēre',
    definition: 'to sit',
    conjugation: '2nd',
    futureActive: {
      s1: 'sedēbō',
      s2: 'sedēbis',
      s3: 'sedēbit',
      p1: 'sedēbimus',
      p2: 'sedēbitis',
      p3: 'sedēbunt'
    }
  },

  // --- 3rd Conjugation ---
  {
    id: 'regere',
    principalParts: 'regō, regere, rēxī, rēctus',
    infinitive: 'regere',
    definition: 'to rule, guide',
    conjugation: '3rd',
    futureActive: {
      s1: 'regam',
      s2: 'regēs',
      s3: 'reget',
      p1: 'regēmus',
      p2: 'regētis',
      p3: 'regent'
    }
  },
  {
    id: 'mittere',
    principalParts: 'mittō, mittere, mīsī, missus',
    infinitive: 'mittere',
    definition: 'to send',
    conjugation: '3rd',
    futureActive: {
      s1: 'mittam',
      s2: 'mittēs',
      s3: 'mittet',
      p1: 'mittēmus',
      p2: 'mittētis',
      p3: 'mittent'
    }
  },
  {
    id: 'ducere',
    principalParts: 'dūcō, dūcere, dūxī, ductus',
    infinitive: 'dūcere',
    definition: 'to lead',
    conjugation: '3rd',
    futureActive: {
      s1: 'dūcam',
      s2: 'dūcēs',
      s3: 'dūcet',
      p1: 'dūcēmus',
      p2: 'dūcētis',
      p3: 'dūcent'
    }
  },
  {
    id: 'ponere',
    principalParts: 'pōnō, pōnere, posuī, positus',
    infinitive: 'pōnere',
    definition: 'to put, place',
    conjugation: '3rd',
    futureActive: {
      s1: 'pōnam',
      s2: 'pōnēs',
      s3: 'pōnet',
      p1: 'pōnēmus',
      p2: 'pōnētis',
      p3: 'pōnent'
    }
  },
  {
    id: 'scribere',
    principalParts: 'scrībō, scrībere, scrīpsī, scrīptus',
    infinitive: 'scrībere',
    definition: 'to write',
    conjugation: '3rd',
    futureActive: {
      s1: 'scrībam',
      s2: 'scrībēs',
      s3: 'scrībet',
      p1: 'scrībēmus',
      p2: 'scrībētis',
      p3: 'scrībent'
    }
  },
  {
    id: 'trahere',
    principalParts: 'trahō, trahere, trāxī, tractus',
    infinitive: 'trahere',
    definition: 'to drag, draw',
    conjugation: '3rd',
    futureActive: {
      s1: 'traham',
      s2: 'trahēs',
      s3: 'trahet',
      p1: 'trahēmus',
      p2: 'trahētis',
      p3: 'trahent'
    }
  },
  {
    id: 'dicere',
    principalParts: 'dīcō, dīcere, dīxī, dictus',
    infinitive: 'dīcere',
    definition: 'to say',
    conjugation: '3rd',
    futureActive: {
      s1: 'dīcam',
      s2: 'dīcēs',
      s3: 'dīcet',
      p1: 'dīcēmus',
      p2: 'dīcētis',
      p3: 'dīcent'
    }
  },

  // --- 3rd-io Conjugation ---
  {
    id: 'capere',
    principalParts: 'capiō, capere, cēpī, captus',
    infinitive: 'capere',
    definition: 'to take, seize',
    conjugation: '3rd (-io)',
    futureActive: {
      s1: 'capiam',
      s2: 'capiēs',
      s3: 'capiet',
      p1: 'capiēmus',
      p2: 'capiētis',
      p3: 'capient'
    }
  },
  {
    id: 'facere',
    principalParts: 'faciō, facere, fēcī, factus',
    infinitive: 'facere',
    definition: 'to make, do',
    conjugation: '3rd (-io)',
    futureActive: {
      s1: 'faciam',
      s2: 'faciēs',
      s3: 'faciet',
      p1: 'faciēmus',
      p2: 'faciētis',
      p3: 'facient'
    }
  },
  {
    id: 'fugere',
    principalParts: 'fugiō, fugere, fūgī, fugitus',
    infinitive: 'fugere',
    definition: 'to flee',
    conjugation: '3rd (-io)',
    futureActive: {
      s1: 'fugiam',
      s2: 'fugiēs',
      s3: 'fugiet',
      p1: 'fugiēmus',
      p2: 'fugiētis',
      p3: 'fugient'
    }
  },

  // --- 4th Conjugation ---
  {
    id: 'audire',
    principalParts: 'audiō, audīre, audīvī, audītus',
    infinitive: 'audīre',
    definition: 'to hear',
    conjugation: '4th',
    futureActive: {
      s1: 'audiam',
      s2: 'audiēs',
      s3: 'audiet',
      p1: 'audiēmus',
      p2: 'audiētis',
      p3: 'audient'
    }
  },
  {
    id: 'venire',
    principalParts: 'veniō, venīre, vēnī, ventus',
    infinitive: 'venīre',
    definition: 'to come',
    conjugation: '4th',
    futureActive: {
      s1: 'veniam',
      s2: 'veniēs',
      s3: 'veniet',
      p1: 'veniēmus',
      p2: 'veniētis',
      p3: 'venient'
    }
  },
  {
    id: 'dormire',
    principalParts: 'dormiō, dormīre, dormīvī, dormītus',
    infinitive: 'dormīre',
    definition: 'to sleep',
    conjugation: '4th',
    futureActive: {
      s1: 'dormiam',
      s2: 'dormiēs',
      s3: 'dormiet',
      p1: 'dormiēmus',
      p2: 'dormiētis',
      p3: 'dormient'
    }
  },
  {
    id: 'scire',
    principalParts: 'sciō, scīre, scīvī, scītus',
    infinitive: 'scīre',
    definition: 'to know',
    conjugation: '4th',
    futureActive: {
      s1: 'sciam',
      s2: 'sciēs',
      s3: 'sciet',
      p1: 'sciēmus',
      p2: 'sciētis',
      p3: 'scient'
    }
  },
  {
    id: 'punire',
    principalParts: 'pūniō, pūnīre, pūnīvī, pūnītus',
    infinitive: 'pūnīre',
    definition: 'to punish',
    conjugation: '4th',
    futureActive: {
      s1: 'pūniam',
      s2: 'pūniēs',
      s3: 'pūniet',
      p1: 'pūniēmus',
      p2: 'pūniētis',
      p3: 'pūnient'
    }
  },

  // --- Irregular ---
  {
    id: 'esse',
    principalParts: 'sum, esse, fuī, futūrus',
    infinitive: 'esse',
    definition: 'to be',
    conjugation: 'Irregular',
    futureActive: {
      s1: 'erō',
      s2: 'eris',
      s3: 'erit',
      p1: 'erimus',
      p2: 'eritis',
      p3: 'erunt'
    }
  },
  {
    id: 'ire',
    principalParts: 'eō, īre, iī, itus',
    infinitive: 'īre',
    definition: 'to go',
    conjugation: 'Irregular',
    futureActive: {
      s1: 'ībō',
      s2: 'ībis',
      s3: 'ībit',
      p1: 'ībimus',
      p2: 'ībitis',
      p3: 'ībunt'
    }
  },
  {
    id: 'velle',
    principalParts: 'volō, velle, voluī',
    infinitive: 'velle',
    definition: 'to want, wish',
    conjugation: 'Irregular',
    futureActive: {
      s1: 'volam',
      s2: 'volēs',
      s3: 'volet',
      p1: 'volēmus',
      p2: 'volētis',
      p3: 'volent'
    }
  }
];