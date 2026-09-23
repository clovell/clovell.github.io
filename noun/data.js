const vocabulary = [
    {
        lemma: "puella, puellae, f.",
        forms: { nom_sg: "puella", gen_sg: "puellae", dat_sg: "puellae", acc_sg: "puellam", abl_sg: "puellā", voc_sg: "puella", nom_pl: "puellae", gen_pl: "puellārum", dat_pl: "puellīs", acc_pl: "puellās", abl_pl: "puellīs", voc_pl: "puellae" }
    },
    {
        lemma: "puer, puerī, m.",
        forms: { nom_sg: "puer", gen_sg: "puerī", dat_sg: "puerō", acc_sg: "puerum", abl_sg: "puerō", voc_sg: "puer", nom_pl: "puerī", gen_pl: "puerōrum", dat_pl: "puerīs", acc_pl: "puerōs", abl_pl: "puerīs", voc_pl: "puerī" }
    },
    {
        lemma: "vir, virī, m.",
        forms: { nom_sg: "vir", gen_sg: "virī", dat_sg: "virō", acc_sg: "virum", abl_sg: "virō", voc_sg: "vir", nom_pl: "virī", gen_pl: "virōrum", dat_pl: "virīs", acc_pl: "virōs", abl_pl: "virīs", voc_pl: "virī" }
    },
    {
        lemma: "fēmina, fēminae, f.",
        forms: { nom_sg: "fēmina", gen_sg: "fēminae", dat_sg: "fēminae", acc_sg: "fēminam", abl_sg: "fēminā", voc_sg: "fēmina", nom_pl: "fēminae", gen_pl: "fēminārum", dat_pl: "fēminīs", acc_pl: "fēminās", abl_pl: "fēminīs", voc_pl: "fēminae" }
    },
    {
        lemma: "canis, canis, m./f.",
        forms: { nom_sg: "canis", gen_sg: "canis", dat_sg: "canī", acc_sg: "canem", abl_sg: "cane", voc_sg: "canis", nom_pl: "canēs", gen_pl: "canum", dat_pl: "canibus", acc_pl: "canēs", abl_pl: "canibus", voc_pl: "canēs" }
    },
    {
        lemma: "deus, deī, m.",
        forms: { nom_sg: "deus", gen_sg: "deī", dat_sg: "deō", acc_sg: "deum", abl_sg: "deō", voc_sg: "deus", nom_pl: "deī", gen_pl: "deōrum", dat_pl: "deīs", acc_pl: "deōs", abl_pl: "deīs", voc_pl: "deī" }
    },
    {
        lemma: "hortus, hortī, m.",
        forms: { nom_sg: "hortus", gen_sg: "hortī", dat_sg: "hortō", acc_sg: "hortum", abl_sg: "hortō", voc_sg: "horte", nom_pl: "hortī", gen_pl: "hortōrum", dat_pl: "hortīs", acc_pl: "hortōs", abl_pl: "hortīs", voc_pl: "hortī" }
    },
    {
        lemma: "vīlla, vīllae, f.",
        forms: { nom_sg: "vīlla", gen_sg: "vīllae", dat_sg: "vīllae", acc_sg: "vīllam", abl_sg: "vīllā", voc_sg: "vīlla", nom_pl: "vīllae", gen_pl: "vīllārum", dat_pl: "vīllīs", acc_pl: "vīllās", abl_pl: "vīllīs", voc_pl: "vīllae" }
    },
    {
        lemma: "rāmus, rāmī, m.",
        forms: { nom_sg: "rāmus", gen_sg: "rāmī", dat_sg: "rāmō", acc_sg: "rāmum", abl_sg: "rāmō", voc_sg: "rāme", nom_pl: "rāmī", gen_pl: "rāmōrum", dat_pl: "rāmīs", acc_pl: "rāmōs", abl_pl: "rāmīs", voc_pl: "rāmī" }
    },
    {
        lemma: "arbor, arboris, f.",
        forms: { nom_sg: "arbor", gen_sg: "arboris", dat_sg: "arborī", acc_sg: "arborem", abl_sg: "arbore", voc_sg: "arbor", nom_pl: "arborēs", gen_pl: "arborum", dat_pl: "arboribus", acc_pl: "arborēs", abl_pl: "arboribus", voc_pl: "arborēs" }
    },
    {
        lemma: "vōx, vōcis, f.",
        forms: { nom_sg: "vōx", gen_sg: "vōcis", dat_sg: "vōcī", acc_sg: "vōcem", abl_sg: "vōce", voc_sg: "vōx", nom_pl: "vōcēs", gen_pl: "vōcum", dat_pl: "vōcibus", acc_pl: "vōcēs", abl_pl: "vōcibus", voc_pl: "vōcēs" }
    },
    {
        lemma: "templum, templī, n.",
        forms: { nom_sg: "templum", gen_sg: "templī", dat_sg: "templō", acc_sg: "templum", abl_sg: "templō", voc_sg: "templum", nom_pl: "templa", gen_pl: "templōrum", dat_pl: "templīs", acc_pl: "templa", abl_pl: "templīs", voc_pl: "templa" }
    },
    {
        lemma: "plaustrum, plaustrī, n.",
        forms: { nom_sg: "plaustrum", gen_sg: "plaustrī", dat_sg: "plaustrō", acc_sg: "plaustrum", abl_sg: "plaustrō", voc_sg: "plaustrum", nom_pl: "plaustra", gen_pl: "plaustrōrum", dat_pl: "plaustrīs", acc_pl: "plaustra", abl_pl: "plaustrīs", voc_pl: "plaustra" }
    },
    {
        lemma: "imperātor, imperātōris, m.",
        forms: { nom_sg: "imperātor", gen_sg: "imperātōris", dat_sg: "imperātōrī", acc_sg: "imperātōrem", abl_sg: "imperātōre", voc_sg: "imperātor", nom_pl: "imperātōrēs", gen_pl: "imperātōrum", dat_pl: "imperātōribus", acc_pl: "imperātōrēs", abl_pl: "imperātōribus", voc_pl: "imperātōrēs" }
    },
    {
        lemma: "mercātor, mercātōris, m.",
        forms: { nom_sg: "mercātor", gen_sg: "mercātōris", dat_sg: "mercātōrī", acc_sg: "mercātōrem", abl_sg: "mercātōre", voc_sg: "mercātor", nom_pl: "mercātōrēs", gen_pl: "mercātōrum", dat_pl: "mercātōribus", acc_pl: "mercātōrēs", abl_pl: "mercātōribus", voc_pl: "mercātōrēs" }
    },
    {
        lemma: "prīnceps, prīncipis, m.",
        forms: { nom_sg: "prīnceps", gen_sg: "prīncipis", dat_sg: "prīncipī", acc_sg: "prīncipem", abl_sg: "prīncipe", voc_sg: "prīnceps", nom_pl: "prīncipēs", gen_pl: "prīncipum", dat_pl: "prīncipibus", acc_pl: "prīncipēs", abl_pl: "prīncipibus", voc_pl: "prīncipēs" }
    },
    {
        lemma: "mīles, mīlitis, m.",
        forms: { nom_sg: "mīles", gen_sg: "mīlitis", dat_sg: "mīlitī", acc_sg: "mīlitem", abl_sg: "mīlite", voc_sg: "mīles", nom_pl: "mīlitēs", gen_pl: "mīlitum", dat_pl: "mīlitibus", acc_pl: "mīlitēs", abl_pl: "mīlitibus", voc_pl: "mīlitēs" }
    },
    {
        lemma: "agricola, agricolae, m.",
        forms: { nom_sg: "agricola", gen_sg: "agricolae", dat_sg: "agricolae", acc_sg: "agricolam", abl_sg: "agricolā", voc_sg: "agricola", nom_pl: "agricolae", gen_pl: "agricolārum", dat_pl: "agricolīs", acc_pl: "agricolās", abl_pl: "agricolīs", voc_pl: "agricolae" }
    },
    {
        lemma: "frāter, frātris, m.",
        forms: { nom_sg: "frāter", gen_sg: "frātris", dat_sg: "frātrī", acc_sg: "frātrem", abl_sg: "frātre", voc_sg: "frāter", nom_pl: "frātrēs", gen_pl: "frātrum", dat_pl: "frātribus", acc_pl: "frātrēs", abl_pl: "frātribus", voc_pl: "frātrēs" }
    },
    {
        lemma: "soror, sorōris, f.",
        forms: { nom_sg: "soror", gen_sg: "sorōris", dat_sg: "sorōrī", acc_sg: "sorōrem", abl_sg: "sorōre", voc_sg: "soror", nom_pl: "sorōrēs", gen_pl: "sorōrum", dat_pl: "sorōribus", acc_pl: "sorōrēs", abl_pl: "sorōribus", voc_pl: "sorōrēs" }
    },
    {
        lemma: "māter, mātris, f.",
        forms: { nom_sg: "māter", gen_sg: "mātris", dat_sg: "mātrī", acc_sg: "mātrem", abl_sg: "mātre", voc_sg: "māter", nom_pl: "mātrēs", gen_pl: "mātrum", dat_pl: "mātribus", acc_pl: "mātrēs", abl_pl: "mātribus", voc_pl: "mātrēs" }
    },
    {
        lemma: "pater, patris, m.",
        forms: { nom_sg: "pater", gen_sg: "patris", dat_sg: "patrī", acc_sg: "patrem", abl_sg: "patre", voc_sg: "pater", nom_pl: "patrēs", gen_pl: "patrum", dat_pl: "patribus", acc_pl: "patrēs", abl_pl: "patribus", voc_pl: "patrēs" }
    },
    {
        lemma: "fīlia, fīliae, f.",
        forms: { nom_sg: "fīlia", gen_sg: "fīliae", dat_sg: "fīliae", acc_sg: "fīliam", abl_sg: "fīliā", voc_sg: "fīlia", nom_pl: "fīliae", gen_pl: "fīliārum", dat_pl: "fīliābus", acc_pl: "fīliās", abl_pl: "fīliābus", voc_pl: "fīliae" }
    },
    {
        lemma: "fīlius, fīliī, m.",
        forms: { nom_sg: "fīlius", gen_sg: "fīliī", dat_sg: "fīliō", acc_sg: "fīlium", abl_sg: "fīliō", voc_sg: "fīlī", nom_pl: "fīliī", gen_pl: "fīliōrum", dat_pl: "fīliīs", acc_pl: "fīliōs", abl_pl: "fīliīs", voc_pl: "fīliī" }
    },
    {
        lemma: "servus, servī, m.",
        forms: { nom_sg: "servus", gen_sg: "servī", dat_sg: "servō", acc_sg: "servum", abl_sg: "servō", voc_sg: "serve", nom_pl: "servī", gen_pl: "servōrum", dat_pl: "servīs", acc_pl: "servōs", abl_pl: "servīs", voc_pl: "servī" }
    },
    {
        lemma: "ancilla, ancillae, f.",
        forms: { nom_sg: "ancilla", gen_sg: "ancillae", dat_sg: "ancillae", acc_sg: "ancillam", abl_sg: "ancillā", voc_sg: "ancilla", nom_pl: "ancillae", gen_pl: "ancillārum", dat_pl: "ancillīs", acc_pl: "ancillās", abl_pl: "ancillīs", voc_pl: "ancillae" }
    },
    {
        lemma: "lectus, lectī, m.",
        forms: { nom_sg: "lectus", gen_sg: "lectī", dat_sg: "lectō", acc_sg: "lectum", abl_sg: "lectō", voc_sg: "lecte", nom_pl: "lectī", gen_pl: "lectōrum", dat_pl: "lectīs", acc_pl: "lectōs", abl_pl: "lectīs", voc_pl: "lectī" }
    },
    {
        lemma: "ātrium, ātriī, n.",
        forms: { nom_sg: "ātrium", gen_sg: "ātriī", dat_sg: "ātriō", acc_sg: "ātrium", abl_sg: "ātriō", voc_sg: "ātrium", nom_pl: "ātria", gen_pl: "ātriōrum", dat_pl: "ātriīs", acc_pl: "ātria", abl_pl: "ātriīs", voc_pl: "ātria" }
    }
];