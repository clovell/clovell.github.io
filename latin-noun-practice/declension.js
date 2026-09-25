// Latin Declension and Paradigm Generation Engine
// Handles on-the-fly paradigm creation for Nouns, Adjectives, and Noun-Adjective Pairs.

var LatinDeclension = (function() {
  'use strict';

  // Helper: Strip leading/trailing hyphens and spaces
  function clean(str) {
    return (str || '').trim();
  }

  // Parse a tab-delimited or dash-delimited line into entry and definition
  function parseLine(rawLine) {
    if (typeof rawLine === 'object' && rawLine !== null) {
      if (rawLine.forms) return rawLine; // Already a compiled object
      return {
        entry: rawLine.entry || '',
        translation: rawLine.translation || ''
      };
    }

    var line = clean(rawLine);
    var tabIdx = line.indexOf('\t');
    if (tabIdx !== -1) {
      return {
        entry: clean(line.slice(0, tabIdx)),
        translation: clean(line.slice(tabIdx + 1))
      };
    }

    // Fallback: check for em-dash '—', double-dash '--', or ' : '
    var dashMatch = line.match(/\s*(?:—|--|\s:\s)\s*/);
    if (dashMatch) {
      var splitIdx = dashMatch.index;
      return {
        entry: clean(line.slice(0, splitIdx)),
        translation: clean(line.slice(splitIdx + dashMatch[0].length))
      };
    }

    // Fallback: comma after gender token (e.g. "puella, -ae, f., girl")
    var parts = line.split(',').map(clean);
    var genderIdx = -1;
    for (var i = 0; i < parts.length; i++) {
      if (/^(m|f|n|c)\.?$/i.test(parts[i]) || /^(masc|fem|neut)\.?$/i.test(parts[i])) {
        genderIdx = i;
        break;
      }
    }
    if (genderIdx !== -1 && genderIdx < parts.length - 1) {
      return {
        entry: parts.slice(0, genderIdx + 1).join(', '),
        translation: parts.slice(genderIdx + 1).join(', ')
      };
    }

    return {
      entry: line,
      translation: ''
    };
  }

  // Standardize gender string
  function normalizeGender(g) {
    var raw = clean(g).toLowerCase().replace('.', '');
    if (raw === 'f' || raw === 'fem') return 'f.';
    if (raw === 'm' || raw === 'masc') return 'm.';
    if (raw === 'n' || raw === 'neut') return 'n.';
    if (raw === 'c') return 'c.';
    return 'm.';
  }

  // =========================================================================
  // NOUN PARSING & PARADIGM GENERATION
  // =========================================================================

  function parseNoun(rawItem) {
    if (typeof rawItem === 'object' && rawItem.forms) {
      // Legacy object pass-through
      return rawItem;
    }

    var parsed = parseLine(rawItem);
    var entryStr = parsed.entry;
    var translation = parsed.translation;

    var parts = entryStr.split(',').map(clean);
    if (parts.length < 3) {
      throw new Error('Invalid noun entry (must have at least nom, gen, gender): ' + entryStr);
    }

    var nomSg = parts[0];
    var genSgPart = parts[1];
    var isIStem = false;
    var genPlPart = '';
    var genderStr = '';

    if (parts.length >= 4) {
      // Could be 3rd declension i-stem: "mare, maris, -ium, n." or "mare, maris, marium, n."
      var thirdPart = parts[2].toLowerCase();
      if (thirdPart === '-ium' || thirdPart === 'marium' || thirdPart.indexOf('ium') !== -1 || thirdPart === 'i-stem') {
        isIStem = true;
        genPlPart = parts[2];
        genderStr = parts[3];
      } else {
        genderStr = parts[2];
        // Any extra parts may be translation if tab wasn't used
        if (!translation && parts.length > 3) {
          translation = parts.slice(3).join(', ');
        }
      }
    } else {
      genderStr = parts[2];
    }

    var gender = normalizeGender(genderStr);

    // Identify declension from genitive singular
    var genLower = genSgPart.toLowerCase();
    var declension = 3;
    if (genLower.endsWith('ae')) {
      declension = 1;
    } else if (genLower.endsWith('ī') || genLower.endsWith('i')) {
      declension = 2;
    } else if (genLower.endsWith('is')) {
      declension = 3;
    } else if (genLower.endsWith('ūs') || genLower.endsWith('us')) {
      declension = 4;
    } else if (genLower.endsWith('eī') || genLower.endsWith('ei')) {
      declension = 5;
    }

    // Stem extraction
    var stem = '';
    if (declension === 1) {
      if (genSgPart.startsWith('-')) {
        // e.g. "puella, -ae" -> stem "puell"
        stem = nomSg.replace(/[aā]$/i, '');
      } else {
        // Full genitive: "puellae" -> "puell"
        stem = genSgPart.replace(/ae$/i, '');
      }
    } else if (declension === 2) {
      if (!genSgPart.startsWith('-')) {
        // e.g. "puer, puerī" -> stem "puer", "ager, agrī" -> stem "agr"
        stem = genSgPart.replace(/[īi]$/i, '');
      } else {
        // e.g. "hortus, -ī" -> "hort", "bellum, -ī" -> "bell"
        if (/[uū][sm]$/i.test(nomSg)) {
          stem = nomSg.slice(0, -2);
        } else {
          stem = nomSg;
        }
      }
    } else if (declension === 3) {
      if (!genSgPart.startsWith('-')) {
        // Full genitive: "mātris" -> "mātr", "operis" -> "oper", "maris" -> "mar", "rēgis" -> "rēg"
        stem = genSgPart.replace(/[iī]s$/i, '');
      } else {
        // Hyphenated genitive: "-inis", "-oris", "-eris", "-is"
        var ending = genSgPart.slice(1);
        var endingStem = ending.replace(/[iī]s$/i, '');
        if (!endingStem) {
          // e.g. "-is"
          if (nomSg.endsWith('e') || nomSg.endsWith('is') || nomSg.endsWith('ēs')) {
            stem = nomSg.slice(0, nomSg.endsWith('e') ? -1 : -2);
          } else {
            stem = nomSg.replace(/s$/i, '');
          }
        } else if (nomSg.endsWith('en') && endingStem === 'in') {
          // flūmen -> flūmin
          stem = nomSg.slice(0, -2) + 'in';
        } else if (nomSg.endsWith('us') && (endingStem === 'or' || endingStem === 'er')) {
          // corpus -> corpor, opus -> oper
          stem = nomSg.slice(0, -2) + endingStem;
        } else {
          stem = nomSg.slice(0, -2) + endingStem;
        }
      }
    } else if (declension === 4) {
      stem = nomSg.replace(/[uū][sm]$/i, '');
    } else if (declension === 5) {
      stem = nomSg.replace(/[eē]s$/i, '');
    }

    var forms = generateNounForms(nomSg, stem, declension, gender, isIStem);

    var displayEntry = nomSg + ', ' + genSgPart;
    if (isIStem) {
      displayEntry += ', ' + (genPlPart || '-ium');
    }
    displayEntry += ', ' + gender;

    return {
      id: nomSg.toLowerCase().replace(/[^a-z]/g, '') || ('noun_' + Math.random().toString(36).substr(2, 6)),
      nomSg: nomSg,
      genSgEnding: genSgPart,
      genPlEnding: genPlPart,
      gender: gender,
      translation: translation,
      declension: declension,
      isIStem: isIStem,
      stem: stem,
      displayEntry: displayEntry,
      forms: forms
    };
  }

  function generateNounForms(nomSg, stem, declension, gender, isIStem) {
    var isNeuter = (gender === 'n.');

    if (declension === 1) {
      return {
        sg: {
          nom: [nomSg],
          gen: [stem + 'ae'],
          dat: [stem + 'ae'],
          acc: [stem + 'am'],
          abl: [stem + 'ā', stem + 'a']
        },
        pl: {
          nom: [stem + 'ae'],
          gen: [stem + 'ārum', stem + 'arum'],
          dat: [stem + 'īs', stem + 'is'],
          acc: [stem + 'ās', stem + 'as'],
          abl: [stem + 'īs', stem + 'is']
        }
      };
    }

    if (declension === 2) {
      var genSgForms = [stem + 'ī', stem + 'i'];
      if (stem.endsWith('i')) {
        // e.g. cōnsilium -> cōnsiliī / cōnsilī
        genSgForms.push(stem.slice(0, -1) + 'ī');
        genSgForms.push(stem.slice(0, -1) + 'i');
      }

      if (isNeuter) {
        return {
          sg: {
            nom: [nomSg],
            gen: genSgForms,
            dat: [stem + 'ō', stem + 'o'],
            acc: [nomSg],
            abl: [stem + 'ō', stem + 'o']
          },
          pl: {
            nom: [stem + 'a'],
            gen: [stem + 'ōrum', stem + 'orum'],
            dat: [stem + 'īs', stem + 'is'],
            acc: [stem + 'a'],
            abl: [stem + 'īs', stem + 'is']
          }
        };
      } else {
        return {
          sg: {
            nom: [nomSg],
            gen: genSgForms,
            dat: [stem + 'ō', stem + 'o'],
            acc: [stem + 'um'],
            abl: [stem + 'ō', stem + 'o']
          },
          pl: {
            nom: [stem + 'ī', stem + 'i'],
            gen: [stem + 'ōrum', stem + 'orum'],
            dat: [stem + 'īs', stem + 'is'],
            acc: [stem + 'ōs', stem + 'os'],
            abl: [stem + 'īs', stem + 'is']
          }
        };
      }
    }

    if (declension === 3) {
      if (isIStem) {
        if (isNeuter) {
          // Pure neuter i-stems (mare, animal, exemplar)
          return {
            sg: {
              nom: [nomSg],
              gen: [stem + 'is'],
              dat: [stem + 'ī', stem + 'i'],
              acc: [nomSg],
              abl: [stem + 'ī', stem + 'i']
            },
            pl: {
              nom: [stem + 'ia'],
              gen: [stem + 'ium'],
              dat: [stem + 'ibus'],
              acc: [stem + 'ia'],
              abl: [stem + 'ibus']
            }
          };
        } else {
          // Masculine / Feminine i-stems (cīvis, urbs)
          return {
            sg: {
              nom: [nomSg],
              gen: [stem + 'is'],
              dat: [stem + 'ī', stem + 'i'],
              acc: [stem + 'em'],
              abl: [stem + 'e', stem + 'ī', stem + 'i']
            },
            pl: {
              nom: [stem + 'ēs', stem + 'es'],
              gen: [stem + 'ium'],
              dat: [stem + 'ibus'],
              acc: [stem + 'ēs', stem + 'īs', stem + 'es', stem + 'is'],
              abl: [stem + 'ibus']
            }
          };
        }
      } else {
        // Consonant stem
        if (isNeuter) {
          return {
            sg: {
              nom: [nomSg],
              gen: [stem + 'is'],
              dat: [stem + 'ī', stem + 'i'],
              acc: [nomSg],
              abl: [stem + 'e']
            },
            pl: {
              nom: [stem + 'a'],
              gen: [stem + 'um'],
              dat: [stem + 'ibus'],
              acc: [stem + 'a'],
              abl: [stem + 'ibus']
            }
          };
        } else {
          return {
            sg: {
              nom: [nomSg],
              gen: [stem + 'is'],
              dat: [stem + 'ī', stem + 'i'],
              acc: [stem + 'em'],
              abl: [stem + 'e']
            },
            pl: {
              nom: [stem + 'ēs', stem + 'es'],
              gen: [stem + 'um'],
              dat: [stem + 'ibus'],
              acc: [stem + 'ēs', stem + 'es'],
              abl: [stem + 'ibus']
            }
          };
        }
      }
    }

    if (declension === 4) {
      if (isNeuter) {
        return {
          sg: {
            nom: [nomSg],
            gen: [stem + 'ūs', stem + 'us'],
            dat: [stem + 'ū', stem + 'u'],
            acc: [nomSg],
            abl: [stem + 'ū', stem + 'u']
          },
          pl: {
            nom: [stem + 'ua'],
            gen: [stem + 'uum'],
            dat: [stem + 'ibus'],
            acc: [stem + 'ua'],
            abl: [stem + 'ibus']
          }
        };
      } else {
        return {
          sg: {
            nom: [nomSg],
            gen: [stem + 'ūs', stem + 'us'],
            dat: [stem + 'uī', stem + 'ui'],
            acc: [stem + 'um'],
            abl: [stem + 'ū', stem + 'u']
          },
          pl: {
            nom: [stem + 'ūs', stem + 'us'],
            gen: [stem + 'uum'],
            dat: [stem + 'ibus'],
            acc: [stem + 'ūs', stem + 'us'],
            abl: [stem + 'ibus']
          }
        };
      }
    }

    if (declension === 5) {
      return {
        sg: {
          nom: [nomSg],
          gen: [stem + 'eī', stem + 'ei', stem + 'ēī'],
          dat: [stem + 'eī', stem + 'ei', stem + 'ēī'],
          acc: [stem + 'em'],
          abl: [stem + 'ē', stem + 'e']
        },
        pl: {
          nom: [stem + 'ēs', stem + 'es'],
          gen: [stem + 'ērum', stem + 'erum'],
          dat: [stem + 'ēbus', stem + 'ebus'],
          acc: [stem + 'ēs', stem + 'es'],
          abl: [stem + 'ēbus', stem + 'ebus']
        }
      };
    }

    throw new Error('Unsupported declension: ' + declension);
  }

  // =========================================================================
  // ADJECTIVE PARSING & PARADIGM GENERATION
  // =========================================================================

  // Helper to expand abbreviated adjective endings (e.g. "ācer", "-cris" -> "ācris"; "fortis", "-e" -> "forte")
  function expandEnding(base, ending) {
    if (!ending.startsWith('-')) return ending;
    var suffix = ending.slice(1);
    if (base.endsWith('er')) {
      var root = base.slice(0, -2);
      if (suffix.startsWith(root.slice(-1))) {
        return root.slice(0, -1) + suffix;
      }
      return root + suffix;
    }
    if (base.endsWith('is')) {
      return base.slice(0, -2) + suffix;
    }
    return base + suffix;
  }

  function parseAdjective(rawItem) {
    if (typeof rawItem === 'object' && rawItem.forms && rawItem.forms.m) {
      return rawItem;
    }

    var parsed = parseLine(rawItem);
    var entryStr = parsed.entry;
    var translation = parsed.translation;

    var parts = entryStr.split(',').map(clean).filter(Boolean);
    if (parts.length < 2) {
      throw new Error('Invalid adjective entry (e.g. "bonus, -a, -um" or "fortis, forte"): ' + entryStr);
    }

    var declensionClass = '2-1-2';
    var nomM = '', nomF = '', nomN = '';
    var stem = '';

    var p0 = parts[0];
    var p1 = parts[1];
    var p2 = parts[2] || '';
    var p3 = parts[3] || '';

    // Case 1: 4+ parts (e.g. "ingēns, ingēns, ingēns, gen. ingentis" or "ingēns, ingēns, ingēns, ingentis")
    if (parts.length >= 4) {
      declensionClass = '3rd';
      nomM = p0;
      nomF = p1;
      nomN = p2;
      var cleanGen4 = p3.replace(/^(?:gen(?:itive)?\.?|gen:)\s*/i, '').trim();
      if (cleanGen4.startsWith('-')) {
        var sfx4 = cleanGen4.slice(1).replace(/is$/i, '');
        stem = p0.replace(/ns$/i, '').replace(/[āēīōū]/g, function(v) {
          return { 'ā':'a', 'ē':'e', 'ī':'i', 'ō':'o', 'ū':'u' }[v] || v;
        }) + sfx4;
      } else {
        stem = cleanGen4.replace(/is$/i, '');
      }
    }
    // Case 2: 3 parts
    else if (parts.length === 3) {
      // 2-1-2: "bonus, -a, -um", "pulcher, pulchra, pulchrum", "miser, misera, miserum"
      if ((p1 === '-a' || p1.endsWith('a')) && (p2 === '-um' || p2.endsWith('um'))) {
        declensionClass = '2-1-2';
        nomM = p0;
        if (p1.startsWith('-')) {
          var fSuffix = p1.slice(1);
          if (p0.endsWith('us')) {
            stem = p0.slice(0, -2);
            nomF = stem + fSuffix;
          } else if (p0.endsWith('er')) {
            if (fSuffix === 'a') {
              stem = p0;
              nomF = p0 + 'a';
            } else {
              stem = p0.slice(0, -2) + fSuffix.replace(/a$/, '');
              nomF = stem + 'a';
            }
          }
        } else {
          nomF = p1;
          stem = p1.replace(/a$/i, '');
        }

        if (p2.startsWith('-')) {
          nomN = stem + p2.slice(1);
        } else {
          nomN = p2;
        }
      }
      // 3rd declension 3-termination: "ācer, ācris, ācre", "fortis, fortis, forte", "celer, celeris, celere"
      else if (p2 === '-e' || p2.endsWith('e')) {
        declensionClass = '3rd';
        nomM = p0;
        nomF = p1.startsWith('-') ? expandEnding(p0, p1) : p1;
        nomN = p2.startsWith('-') ? expandEnding(p0, p2) : p2;
        stem = nomF.replace(/is$/i, '');
      }
      // 3rd declension 1-termination with gender note: "ingēns, ingentis, c."
      else if (/^(?:c|m|f|n)\.?$/i.test(p2) || /^(?:gen(?:itive)?\.?|gen:)/i.test(p1) || p1.endsWith('is')) {
        declensionClass = '3rd';
        nomM = p0;
        nomF = p0;
        nomN = p0;
        var cleanGen3 = p1.replace(/^(?:gen(?:itive)?\.?|gen:)\s*/i, '').trim();
        if (cleanGen3.startsWith('-')) {
          var sfx3 = cleanGen3.slice(1).replace(/is$/i, '');
          stem = p0.replace(/ns$/i, '').replace(/[āēīōū]/g, function(v) {
            return { 'ā':'a', 'ē':'e', 'ī':'i', 'ō':'o', 'ū':'u' }[v] || v;
          }) + sfx3;
        } else {
          stem = cleanGen3.replace(/is$/i, '');
        }
      }
      else {
        declensionClass = '2-1-2';
        nomM = p0;
        stem = p0.replace(/us$/i, '');
        nomF = stem + 'a';
        nomN = stem + 'um';
      }
    }
    // Case 3: 2 parts
    else if (parts.length === 2) {
      // 2-termination 3rd declension: "fortis, forte", "fortis, -e", "dulcis, dulce"
      if (p1 === '-e' || p1.endsWith('e')) {
        declensionClass = '3rd';
        nomM = p0;
        nomF = p0;
        nomN = p1.startsWith('-') ? expandEnding(p0, p1) : p1;
        stem = p0.replace(/is$/i, '');
      }
      // 1-termination 3rd declension: "ingēns, ingentis", "ingēns, gen. ingentis", "ingēns, -entis", "fēlīx, fēlīcis"
      else if (/^(?:gen(?:itive)?\.?|gen:)/i.test(p1) || p1.endsWith('is') || p1.startsWith('-')) {
        declensionClass = '3rd';
        nomM = p0;
        nomF = p0;
        nomN = p0;
        var cleanGen2 = p1.replace(/^(?:gen(?:itive)?\.?|gen:)\s*/i, '').trim();
        if (cleanGen2.startsWith('-')) {
          var sfx2 = cleanGen2.slice(1).replace(/is$/i, '');
          if (p0.endsWith('ns')) {
            stem = p0.slice(0, -2).replace(/[āēīōū]/g, function(v) {
              return { 'ā':'a', 'ē':'e', 'ī':'i', 'ō':'o', 'ū':'u' }[v] || v;
            }) + sfx2;
          } else if (p0.endsWith('x')) {
            stem = p0.slice(0, -1) + sfx2;
          } else {
            stem = p0.slice(0, -1) + sfx2;
          }
        } else {
          stem = cleanGen2.replace(/is$/i, '');
        }
      }
      // 2-1-2 abbreviated (e.g. "bonus, -a")
      else if (p1 === '-a' || p1.endsWith('a')) {
        declensionClass = '2-1-2';
        nomM = p0;
        stem = p0.replace(/us$/i, '');
        nomF = stem + 'a';
        nomN = stem + 'um';
      }
      else {
        declensionClass = '3rd';
        nomM = p0;
        nomF = p0;
        nomN = p0;
        stem = p1.replace(/is$/i, '');
      }
    }

    var forms = generateAdjectiveForms(nomM, nomF, nomN, stem, declensionClass);

    var cleanId = nomM.toLowerCase()
      .replace(/[āáà]/g, 'a')
      .replace(/[ēéè]/g, 'e')
      .replace(/[īíì]/g, 'i')
      .replace(/[ōóò]/g, 'o')
      .replace(/[ūúù]/g, 'u')
      .replace(/[ȳýỳ]/g, 'y')
      .replace(/[^a-z0-9]/g, '');

    return {
      id: cleanId || ('adj_' + Math.random().toString(36).substr(2, 6)),
      entry: entryStr,
      displayEntry: entryStr,
      nomM: nomM,
      nomF: nomF,
      nomN: nomN,
      stem: stem,
      declensionClass: declensionClass,
      translation: translation,
      forms: forms
    };
  }

  function generateAdjectiveForms(nomM, nomF, nomN, stem, declensionClass) {
    if (declensionClass === '2-1-2') {
      var genMForms = [stem + 'ī', stem + 'i'];
      var genNForms = [stem + 'ī', stem + 'i'];
      if (stem.endsWith('i')) {
        genMForms.push(stem.slice(0, -1) + 'ī');
        genNForms.push(stem.slice(0, -1) + 'ī');
      }

      return {
        m: {
          sg: {
            nom: [nomM],
            gen: genMForms,
            dat: [stem + 'ō', stem + 'o'],
            acc: [stem + 'um'],
            abl: [stem + 'ō', stem + 'o']
          },
          pl: {
            nom: [stem + 'ī', stem + 'i'],
            gen: [stem + 'ōrum', stem + 'orum'],
            dat: [stem + 'īs', stem + 'is'],
            acc: [stem + 'ōs', stem + 'os'],
            abl: [stem + 'īs', stem + 'is']
          }
        },
        f: {
          sg: {
            nom: [nomF],
            gen: [stem + 'ae'],
            dat: [stem + 'ae'],
            acc: [stem + 'am'],
            abl: [stem + 'ā', stem + 'a']
          },
          pl: {
            nom: [stem + 'ae'],
            gen: [stem + 'ārum', stem + 'arum'],
            dat: [stem + 'īs', stem + 'is'],
            acc: [stem + 'ās', stem + 'as'],
            abl: [stem + 'īs', stem + 'is']
          }
        },
        n: {
          sg: {
            nom: [nomN],
            gen: genNForms,
            dat: [stem + 'ō', stem + 'o'],
            acc: [nomN],
            abl: [stem + 'ō', stem + 'o']
          },
          pl: {
            nom: [stem + 'a'],
            gen: [stem + 'ōrum', stem + 'orum'],
            dat: [stem + 'īs', stem + 'is'],
            acc: [stem + 'a'],
            abl: [stem + 'īs', stem + 'is']
          }
        }
      };
    }

    if (declensionClass === '3rd') {
      // Standard 3rd declension adjective: i-stem (abl sg -ī, neuter pl -ia, gen pl -ium)
      return {
        m: {
          sg: {
            nom: [nomM],
            gen: [stem + 'is'],
            dat: [stem + 'ī', stem + 'i'],
            acc: [stem + 'em'],
            abl: [stem + 'ī', stem + 'i']
          },
          pl: {
            nom: [stem + 'ēs', stem + 'es'],
            gen: [stem + 'ium'],
            dat: [stem + 'ibus'],
            acc: [stem + 'ēs', stem + 'īs', stem + 'es', stem + 'is'],
            abl: [stem + 'ibus']
          }
        },
        f: {
          sg: {
            nom: [nomF],
            gen: [stem + 'is'],
            dat: [stem + 'ī', stem + 'i'],
            acc: [stem + 'em'],
            abl: [stem + 'ī', stem + 'i']
          },
          pl: {
            nom: [stem + 'ēs', stem + 'es'],
            gen: [stem + 'ium'],
            dat: [stem + 'ibus'],
            acc: [stem + 'ēs', stem + 'īs', stem + 'es', stem + 'is'],
            abl: [stem + 'ibus']
          }
        },
        n: {
          sg: {
            nom: [nomN],
            gen: [stem + 'is'],
            dat: [stem + 'ī', stem + 'i'],
            acc: [nomN],
            abl: [stem + 'ī', stem + 'i']
          },
          pl: {
            nom: [stem + 'ia'],
            gen: [stem + 'ium'],
            dat: [stem + 'ibus'],
            acc: [stem + 'ia'],
            abl: [stem + 'ibus']
          }
        }
      };
    }

    throw new Error('Unsupported adjective class: ' + declensionClass);
  }

  // =========================================================================
  // NOUN-ADJECTIVE PAIR GENERATION
  // =========================================================================

  function createNounAdjectivePair(nounItem, adjItem) {
    var noun = typeof nounItem.forms === 'object' && !nounItem.forms.m ? nounItem : parseNoun(nounItem);
    var adj = typeof adjItem.forms === 'object' && adjItem.forms.m ? adjItem : parseAdjective(adjItem);

    var genderKey = 'm';
    if (noun.gender.startsWith('f')) genderKey = 'f';
    else if (noun.gender.startsWith('n')) genderKey = 'n';

    var adjForms = adj.forms[genderKey];
    var nomAdj = genderKey === 'f' ? adj.nomF : genderKey === 'n' ? adj.nomN : adj.nomM;

    var translation = '';
    if (noun.translation && adj.translation) {
      translation = noun.translation + ' + ' + adj.translation;
    } else {
      translation = noun.translation || adj.translation || '';
    }

    return {
      id: noun.id + '_' + adj.id,
      noun: noun,
      adjective: adj,
      genderKey: genderKey,
      displayEntry: noun.displayEntry + ' + ' + adj.displayEntry,
      nomPhrase: noun.nomSg + ' ' + nomAdj,
      nounEntry: noun.displayEntry,
      adjEntry: adj.displayEntry,
      translation: translation,
      forms: {
        noun: noun.forms,
        adj: adjForms
      }
    };
  }

  // =========================================================================
  // BATCH GENERATION
  // =========================================================================

  function generateNouns(rawList) {
    return (rawList || []).map(parseNoun);
  }

  function generateAdjectives(rawList) {
    return (rawList || []).map(parseAdjective);
  }

  function parseVocabularyText(text) {
    var lines = (text || '').split(/\r?\n/);
    var nouns = [];
    var adjectives = [];
    var currentSection = null; // 'nouns' | 'adjectives'

    for (var i = 0; i < lines.length; i++) {
      var rawLine = lines[i].trim();
      if (!rawLine) continue;

      if (rawLine.startsWith('#')) {
        var lower = rawLine.toLowerCase();
        if (lower.indexOf('noun') !== -1) {
          currentSection = 'nouns';
        } else if (lower.indexOf('adj') !== -1) {
          currentSection = 'adjectives';
        }
        continue;
      }

      // Check section or auto-detect
      var isNoun = false;
      if (currentSection === 'nouns') {
        isNoun = true;
      } else if (currentSection === 'adjectives') {
        isNoun = false;
      } else {
        // Auto-detect based on gender token in dictionary entry
        var entryPart = rawLine.split('\t')[0] || rawLine;
        isNoun = /,\s*(m|f|n|c)\.?\s*$/i.test(entryPart) || /,\s*(m|f|n|c)\.?\s*,/i.test(entryPart);
      }

      try {
        if (isNoun) {
          nouns.push(parseNoun(rawLine));
        } else {
          adjectives.push(parseAdjective(rawLine));
        }
      } catch (err) {
        console.warn('Skipping invalid vocabulary line:', rawLine, err);
      }
    }

    return {
      nouns: nouns,
      adjectives: adjectives
    };
  }

  // Get standard noun declension endings based on declension (1, 2, 3), gender ('m', 'f', 'n'), and isIStem (boolean)
  function getNounEndings(declension, gender, isIStem) {
    var decl = parseInt(declension, 10) || 1;
    var gen = (gender || 'f').toLowerCase().charAt(0);
    var isNeuter = (gen === 'n');

    // Helper to generate both -ending and ending variants
    function withHyphenVariants(arr) {
      var res = [];
      arr.forEach(function(item) {
        if (!res.includes(item)) res.push(item);
        if (item.startsWith('-')) {
          var without = item.slice(1);
          if (!res.includes(without)) res.push(without);
        } else if (item && item !== '—') {
          var withH = '-' + item;
          if (!res.includes(withH)) res.push(withH);
        }
      });
      return res;
    }

    if (decl === 1) {
      return {
        sg: {
          nom: withHyphenVariants(['-a', '-ā']),
          gen: withHyphenVariants(['-ae']),
          dat: withHyphenVariants(['-ae']),
          acc: withHyphenVariants(['-am']),
          abl: withHyphenVariants(['-ā', '-a'])
        },
        pl: {
          nom: withHyphenVariants(['-ae']),
          gen: withHyphenVariants(['-ārum', '-arum']),
          dat: withHyphenVariants(['-īs', '-is']),
          acc: withHyphenVariants(['-ās', '-as']),
          abl: withHyphenVariants(['-īs', '-is'])
        }
      };
    }

    if (decl === 2) {
      if (isNeuter) {
        return {
          sg: {
            nom: withHyphenVariants(['-um']),
            gen: withHyphenVariants(['-ī', '-i']),
            dat: withHyphenVariants(['-ō', '-o']),
            acc: withHyphenVariants(['-um']),
            abl: withHyphenVariants(['-ō', '-o'])
          },
          pl: {
            nom: withHyphenVariants(['-a']),
            gen: withHyphenVariants(['-ōrum', '-orum']),
            dat: withHyphenVariants(['-īs', '-is']),
            acc: withHyphenVariants(['-a']),
            abl: withHyphenVariants(['-īs', '-is'])
          }
        };
      } else {
        return {
          sg: {
            nom: withHyphenVariants(['-us', '-er']),
            gen: withHyphenVariants(['-ī', '-i']),
            dat: withHyphenVariants(['-ō', '-o']),
            acc: withHyphenVariants(['-um']),
            abl: withHyphenVariants(['-ō', '-o'])
          },
          pl: {
            nom: withHyphenVariants(['-ī', '-i']),
            gen: withHyphenVariants(['-ōrum', '-orum']),
            dat: withHyphenVariants(['-īs', '-is']),
            acc: withHyphenVariants(['-ōs', '-os']),
            abl: withHyphenVariants(['-īs', '-is'])
          }
        };
      }
    }

    if (decl === 3) {
      var variableNom = ['—', '-', 'var', 'varies', 'none', ''];
      if (isNeuter) {
        var ablSg = isIStem ? withHyphenVariants(['-ī', '-i']) : withHyphenVariants(['-e']);
        var nomPl = isIStem ? withHyphenVariants(['-ia']) : withHyphenVariants(['-a']);
        var genPl = isIStem ? withHyphenVariants(['-ium']) : withHyphenVariants(['-um']);
        var accPl = isIStem ? withHyphenVariants(['-ia']) : withHyphenVariants(['-a']);

        return {
          sg: {
            nom: variableNom,
            gen: withHyphenVariants(['-is']),
            dat: withHyphenVariants(['-ī', '-i']),
            acc: variableNom,
            abl: ablSg
          },
          pl: {
            nom: nomPl,
            gen: genPl,
            dat: withHyphenVariants(['-ibus']),
            acc: accPl,
            abl: withHyphenVariants(['-ibus'])
          }
        };
      } else {
        // Masc / Fem: ablative singular is always -e unless neuter and i-stem is on
        var genPlMasc = isIStem ? withHyphenVariants(['-ium', '-um']) : withHyphenVariants(['-um']);
        var accPlMasc = isIStem ? withHyphenVariants(['-ēs', '-es', '-īs', '-is']) : withHyphenVariants(['-ēs', '-es']);

        return {
          sg: {
            nom: variableNom,
            gen: withHyphenVariants(['-is']),
            dat: withHyphenVariants(['-ī', '-i']),
            acc: withHyphenVariants(['-em']),
            abl: withHyphenVariants(['-e'])
          },
          pl: {
            nom: withHyphenVariants(['-ēs', '-es']),
            gen: genPlMasc,
            dat: withHyphenVariants(['-ibus']),
            acc: accPlMasc,
            abl: withHyphenVariants(['-ibus'])
          }
        };
      }
    }

    return null;
  }

  var DEFAULT_VOCAB_TEXT = [
    '# NOUNS',
    'puella, -ae, f.\tgirl',
    'hortus, -ī, m.\tgarden',
    'puer, puerī, m.\tboy',
    'bellum, -ī, n.\twar',
    'cōnsilium, -ī, n.\tplan, advice',
    'dōnum, -ī, n.\tgift',
    'oppidum, -ī, n.\ttown',
    'perīculum, -ī, n.\tdanger',
    'plaustrum, -ī, n.\twagon, cart',
    'saxum, -ī, n.\trock',
    'verbum, -ī, n.\tword',
    'māter, mātris, f.\tmother',
    'opus, operis, n.\twork',
    'caput, capitis, n.\thead',
    'carmen, carminis, n.\tsong, poem',
    'corpus, corporis, n.\tbody',
    'flūmen, flūminis, n.\triver',
    'iter, itineris, n.\tjourney, route',
    'lēx, lēgis, f.\tlaw',
    'nōmen, nōminis, n.\tname',
    'rēx, rēgis, m.\tking',
    'tempus, temporis, n.\ttime',
    'vulnus, vulneris, n.\twound',
    'mare, maris, -ium, n.\tsea',
    '',
    '# ADJECTIVES',
    'bonus, -a, -um\tgood',
    'magnus, -a, -um\tlarge, great',
    'malus, -a, -um\tbad, evil',
    'multus, -a, -um\tmuch, many',
    'parvus, -a, -um\tsmall',
    'pulcher, pulchra, pulchrum\tbeautiful',
    'miser, misera, miserum\twretched, sad',
    'novus, -a, -um\tnew',
    'longus, -a, -um\tlong',
    'ācer, ācris, ācre\tsharp, keen',
    'fortis, -e\tbrave, strong',
    'brevis, -e\tshort, brief',
    'gravis, -e\theavy, serious',
    'omnis, -e\tall, every',
    'facilis, -e\teasy',
    'difficilis, -e\tdifficult',
    'dulcis, -e\tsweet',
    'ingēns, ingentis\thuge, vast',
    'fēlīx, fēlīcis\thappy, fortunate'
  ].join('\n');

  return {
    parseLine: parseLine,
    parseNoun: parseNoun,
    parseAdjective: parseAdjective,
    parseVocabularyText: parseVocabularyText,
    createNounAdjectivePair: createNounAdjectivePair,
    generateNouns: generateNouns,
    generateAdjectives: generateAdjectives,
    generateAll: generateNouns,
    getNounEndings: getNounEndings,
    DEFAULT_VOCAB_TEXT: DEFAULT_VOCAB_TEXT
  };
})();

// Export for Node environment if testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LatinDeclension;
}
