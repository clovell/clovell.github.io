/* N.B. after 12 cases des[0-11]:
        des[12]: lemma
        des[13]: stem
        des[14]: gender
        des[15]: declination
        des[16-19]: notes
        des[20]: translation
*/


var

irrForms = new Array(11);   //-------------------   contains irregular forms for current noun

des1 = new Array(11);
des2 = new Array(11);
des2n = new Array(11);
des3a = new Array(11);
des3an = new Array(11);
des3b = new Array(11);
des3c = new Array(11);
des4 = new Array(11);
des4n = new Array(11);
des5 = new Array(11);

des1[0] = "a";
des1[1] = "ae";
des1[2] = "ae";
des1[3] = "am";
des1[4] = "a";
des1[5] = "a";
des1[6] = "ae";
des1[7] = "arum";
des1[8] = "is";
des1[9] = "as";
des1[10] = "is";
des1[11] = "ae";

des2[0] = "us";
des2[1] = "i";
des2[2] = "o";
des2[3] = "um";
des2[4] = "o";
des2[5] = "e";
des2[6] = "i";
des2[7] = "orum";
des2[8] = "is";
des2[9] = "os";
des2[10] = "is";
des2[11] = "i";

des2n[0] = "um";
des2n[1] = "i";
des2n[2] = "o";
des2n[3] = "um";
des2n[4] = "o";
des2n[5] = "um";
des2n[6] = "a";
des2n[7] = "orum";
des2n[8] = "is";
des2n[9] = "a";
des2n[10] = "is";
des2n[11] = "a";

des3a[0] = "+";
des3a[1] = "is";
des3a[2] = "i";
des3a[3] = "em";
des3a[4] = "e";
des3a[5] = "+";
des3a[6] = "es";
des3a[7] = "um";
des3a[8] = "ibus";
des3a[9] = "es";
des3a[10] = "ibus";
des3a[11] = "es";

des3an[0] = "+";
des3an[1] = "is";
des3an[2] = "i";
des3an[3] = "+";
des3an[4] = "e";
des3an[5] = "+";
des3an[6] = "a";
des3an[7] = "um";
des3an[8] = "ibus";
des3an[9] = "a";
des3an[10] = "ibus";
des3an[11] = "a";

des3b[0] = "+";
des3b[1] = "is";
des3b[2] = "i";
des3b[3] = "em";
des3b[4] = "e";
des3b[5] = "+";
des3b[6] = "es";
des3b[7] = "ium";
des3b[8] = "ibus";
des3b[9] = "es";
des3b[10] = "ibus";
des3b[11] = "es";

des3c[0] = "+";
des3c[1] = "is";
des3c[2] = "i";
des3c[3] = "+";
des3c[4] = "i";
des3c[5] = "+";
des3c[6] = "ia";
des3c[7] = "ium";
des3c[8] = "ibus";
des3c[9] = "ia";
des3c[10] = "ibus";
des3c[11] = "ia";

des4[0] = "us";
des4[1] = "us";
des4[2] = "ui";
des4[3] = "um";
des4[4] = "u";
des4[5] = "us";
des4[6] = "us";
des4[7] = "uum";
des4[8] = "ibus";
des4[9] = "us";
des4[10] = "ibus";
des4[11] = "us";

des4n[0] = "u";
des4n[1] = "us";
des4n[2] = "u";
des4n[3] = "u";
des4n[4] = "u";
des4n[5] = "u";
des4n[6] = "ua";
des4n[7] = "uum";
des4n[8] = "ibus";
des4n[9] = "ua";
des4n[10] = "ibus";
des4n[11] = "ua";

des5[0] = "es";
des5[1] = "ei";
des5[2] = "ei";
des5[3] = "em";
des5[4] = "e";
des5[5] = "es";
des5[6] = "es";
des5[7] = "erum";
des5[8] = "ebus";
des5[9] = "es";
des5[10] = "ebus";
des5[11] = "es";


// ----------------------------------------------------------------------------------------------------------------------------
function decline1(nom, stem, gender, declN, trans, lemma) {         // 1st declension
var d = new Array(21);

    for(var i=0; i<21; i++) {                                                   // clears the arrays
        d[i] = "";
        irrForms[i] = "";
    }
 
    for (var i=0; i<12; i++) {                                                // builds standard cases
      d[i] = stem + des1[i];
    }
    
    d[12] = lemma;                                                                // stores extra info
    d[13] = stem;
    d[14] = gender;
    d[15] = declN;
    d[20] = trans;
    																									// pluralia tantum    
    
    if ((nom == "copiae") || (nom == "tenebrae") || (nom == "litterae") || (nom == "insidiae") || (nom == "epulae") || (nom == "divitiae") || (nom == "deliciae")) {
			for (var i=0; i<6; i++)
    			d[i] = "";
    }
    
                                                                                                // notes 
 	 if (nom == "familia")   d[16]="gen. s. 'familias' in some cases";
    if (nom == "caelicola") d[16]="gen. pl. 'caelicolum' in some cases";
    if (nom == "terrigena") d[16]="gen. pl. 'terrigenum' in some cases";
    if (nom == "dea")       d[16]="dat. and abl. pl. 'deabus' in some cases";
    if (nom == "filia")     d[16]="dat. and abl. pl. 'filiabus' in some cases";
    

    
    return d;
}



// ----------------------------------------------------------------------------------------------------------------------------
function decline2(nom, stem, gender, declN, trans, lemma) {         // 2nd declension
var d = new Array(21);

    for(var i=0; i<21; i++) {                                                   // clears the arrays
        d[i] = "";
        irrForms[i] = "";
    }
 
    for (var i=0; i<12; i++) {                                                 // builds standard cases
      d[i] = stem + des2[i];
    }

	if (gender == "n") {
        for (var i=0; i<12; i++) {                                                 // corrects if neuter
            d[i] = stem + des2n[i];
        }
    }

	if ((nom == "vulgus") || (nom == "pelagus") || (nom == "virus")) {           // pelagus, vulgus, virus (neuters in -us)
        d[0] = nom;
        irrForms[0] = d[0];
        d[3] = nom;
        d[5] = nom;
        d[16]="nom. -us but gender is neuter";
    }


    if (nom.substring(nom.length-1, nom.length) == "r") {      						// -er and -ir nouns
        d[0] = nom; 
        d[5] = nom;
    }

    d[12] = lemma;                                                    // stores extra info
    d[13] = stem;
    d[14] = gender;
    d[15] = declN;
    d[20] = trans;

    if (nom.substring(nom.length-3, nom.length) == "ius") {      // -ius nouns
        d[5] = stem;
    }
    
    if (nom == "meus") {                                                             // 'meus'
        d[5] = "mi";
        irrForms[5] = "mi";
    }
 	 
 	 if (nom == "deus") {                                                             // 'deus'
        d[5] = "deus";
        irrForms[5] = "deus";
    }
    
 	 if (nom == "pontus") {                                                             // 'pontus', no plural
		   for (var i=6; i<12; i++) {
		   	d[i] = "";
		   }  
    }
    
    if (nom == "iugerum") {                                                        // plural of iugerum, 3rd decl.
        for (var i = 6; i<12; i++) {
            d[i] = stem+des3an[i];
            irrForms[i] = stem+des3an[i]
        }
    }

    
	if (nom == "liberi") {                                                             // 'liberi', no singular
		   for (var i=0; i<6; i++) {
		   	d[i] = "";
		   }  
    }
																													// pluralia tantum
	if ((nom == "arma") || (nom == "castra")) {
		for (var i=0; i<6; i++)
			d[i] = "";
	} 
                                                                                                  // notes
    if (nom == "deus") {   
        d[16]="nom. and voc. pl. also 'di' and 'dii'";
        d[17]="gen. pl. also 'deum'";    
        d[18]="dat. and abl. pl:  also 'diis' and 'dis'";
    }
    
    if ((nom == "cupressus") || (nom == "fagus")) {
        d[16]="also gen. s. '" + stem + "us'";
        d[17]="also abl. s. '" + stem + "u'";
        d[18]="also nom. pl. '" + stem + "us'";
    }
	
    return d;
}


// ----------------------------------------------------------------------------------------------------------------------------
function decline3a(nom, stem, gender, declN, trans, lemma) {        // 3rd declension, standard endings
                                                                                            
                                                                                                 
var d = new Array(21);

    for(var i=0; i<21; i++) {                                                   // clears the arrays
        d[i] = "";
        irrForms[i] = "";
    }
 
    for (var i=0; i<12; i++) {                                                 // builds standard cases
      d[i] = stem + des3a[i];
      d[0] = nom;
      d[5] = nom;
    }
    
 
    if (gender == "n") {                                                        // corrects if neuter
        d[3] = nom;
        d[6] = stem + des3an[6];
        d[9] = stem + des3an[9];
        d[10] = stem + des3an[10];
        
    }
 
                                                                                                // corrects if 2 consonants
   if ("bcdfghklmnpqrstvxz".indexOf(stem.substring(stem.length-2, stem.length-1)) > -1) {
      if (nom != "gigas" && nom != "parens") {                       
           d[7] = stem + "ium";
       }
   }
   
                                                                                // irregulars and notes
    if (nom == "vas") {                                                         // plural of vas
        for (var i=6; i<12; i++) {
            d[i] = stem + des2n[i];
            irrForms[i] = stem + des2n[i];
        }
    }
    
    if (nom == "Iuppiter") {                                                         // Iuppiter
        for (var i=6; i<12; i++) {
            d[i] = "";
        }
        d[1] = "Iovis";
        d[2] = "Iovi";
        d[3] = "Iovem";
        d[5] = "Iuppiter";
        d[4] = "Iove";
    }
    
    if (nom == "rus") {                                                         // rus
        for (var i=6; i<12; i++) {
            d[i] = "";
        }
        d[6] = "rura";
        d[9] = "rura";
    }

    
     if (nom == "bos") {                                                         // plural of bos
        d[7] = "boum";
        		irrForms[7] = "boum";
        d[8] = "bubus";
        		irrForms[8] = "bubus";
        d[11] = "bubus";
        		irrForms[11] = "bubus";
        d[16] = "dat. and abl. pl. also 'bobus'";
    }
    
    if (nom == "sus") d[16] = "dat. and abl. pl. also 'subus'";
    if (nom == "plebs") {
    	d[16] = "nom. also 'plebes'";
    	d[17] = "gen. also 'plebi'";
    }
    
    d[12] = lemma;                                                    // stores extra info
    d[13] = stem;
    d[14] = gender;
    d[15] = declN;
    d[20] = trans;


    return d;
}


// ----------------------------------------------------------------------------------------------------------------------------

function decline3b(nom, stem, gender, declN, trans, lemma) {        // 3rd decl, mostly masc/fem i-stems 
                                                                                                                               
var d = new Array(21);

    for(var i=0; i<21; i++) {                                                   // clears the arrays
        d[i] = "";
        irrForms[i] = "";
    }
 
    for (var i=0; i<12; i++) {                                                 // builds standard cases
      d[i] = stem + des3b[i];
      d[0] = nom;
      d[5] = nom;
    }
    
                                                                                       // irregulars
                                                                                       // acc. -im, abl. -i
    if ((nom == "amussis") || 
        (nom == "buris") || 
        (nom == "ravis") || 
        (nom == "sitis") || 
        (nom == "tussis") || 
        (nom == "Neapolis") ||
        (nom == "Caralis") ||
        (nom == "Tiberis") ||
        (nom == "Araris"))
    {   
        d[3] = stem + "im";
        		irrForms[3] = d[3];
        d[4] = stem + "i";
        		irrForms[5] = d[5];
    }
    
                                                                                       // gen.pl. -um
 	 if ((nom == "mater") || 
        (nom == "pater") || 
        (nom == "frater") || 
        (nom == "iuvenis") || 
        (nom == "senex") || 
        (nom == "canis") ||
        (nom == "panis") ||
        (nom == "vates") ||
        (nom == "accipiter")) 
    {   
        d[7] = stem + "um";
        		irrForms[7] = d[7];
	 }
	    
    
    if ((nom == "sitis") || (nom == "fames")) {                                    //  no plural
    	for (var i = 6; i<12; i++) 
    		d[i] = "";
 	 }
	 
	 if (nom == "vis") {                                                             // vis, defective
    	for (var i=0; i<12; i++) {d[i] = "";}
    	d[0] = "vis";
    	d[3] = "vim";
    	d[4] = "vi";
    	d[5] = "vis";
    	for (var i=6; i<12; i++) {d[i] = "vir" + des3b[i];}
    	for (var i=0; i<12; i++) {irrForms[i] = d[i];}
    }

    d[12] = lemma;                                                    // stores extra info
    d[13] = stem;
    d[14] = gender;
    d[15] = declN;
    d[20] = trans;

	if ((nom == "manes") || (nom == "moenia") || (nom == "milia")) {						// pluralia tantum
		for (var i=0; i<6; i++) 
			d[i] = "";
	}								
                                                                                      // notes
    
    if (nom == "puppis") d[16] = "also acc. s. 'puppim'; abl. s. 'puppi'";
    if (nom == "febris") d[16] = "also acc. s. 'febrim'; abl. s. 'febri'";
    if (nom == "turris") d[16] = "also acc. s. 'turrim'; abl. s. 'turri'";
    if (nom == "securis") d[16] = "also acc. s. 'securim'; abl. s. 'securi'";
    
    return d;
}



// ----------------------------------------------------------------------------------------------------------------------------

function decline3c(nom, stem, gender, declN, trans, lemma) {    // 3rd declension, 3rd group
                                                                // neuters -e, -al, -ar
var d = new Array(21);

    for(var i=0; i<21; i++) {                                                   // clears the arrays
        d[i] = "";
        irrForms[i] = "";
    }
 
    for (var i=0; i<12; i++) {                                                 // builds standard cases
      d[i] = stem + des3c[i];
      d[0] = nom;
      d[3] = nom;
      d[5] = nom;
    }
    
    d[12] = lemma;                                                    // stores extra info
    d[13] = stem;
    d[14] = gender;
    d[15] = declN;
    d[20] = trans;

    return d;
}

// ----------------------------------------------------------------------------------------------------------------------------

function decline4(nom, stem, gender, declN, trans, lemma) {        // 4th declension
var d = new Array(21);

    for(var i=0; i<21; i++) {                                                   // clears the arrays
        d[i] = "";
        irrForms[i] = "";
    }
  

    for (var i=0; i<12; i++) {                                                 // builds standard cases
      d[i] = stem + des4[i];
    }
    
    if (gender == 'n') {                                                          // corrects if neuter
        for (var i=0; i<12; i++) {                                                 
            d[i] = stem + des4n[i];
        }
    }
    
                                                                                             // irregulars 
    if ((nom == "arcus") ||
        (nom == "acus") ||
        (nom == "lacus") ||
        (nom == "quercus") ||
        (nom == "specus") ||
        (nom == "tribus") ||
        (nom == "partus") ||
        (nom == "artus")) {
            d[8] = stem + "ubus";
            	irrForms[8] = d[8];
            d[11] = stem + "ubus";
            	irrForms[11] = d[11];
    }
    
    if (nom == "domus") {
        d[5] = "domo";
        		irrForms[5] = d[5];
        d[9] = "domos";
        		irrForms[9] = d[9];
        d[16] = "locative 'domi'";
        d[17] = "also dat. s. 'domo'; abl. s. 'domu'";
        d[18] = "also gen. pl. 'domorum'; acc. pl. 'domus'";
    }
    
    if (nom == "Iesu") {
        for (var i=0; i<12; i++) {
            d[i] = "";
        }
        d[0] = nom;
        d[1] = "Iesu";
        d[2] = "Iesu";
        d[3] = "Iesum";
        d[4] = "Iesu";
        d[5] = "Iesu";
        for (var i = 0; i<6; i++) {
        		irrForms[i] = d[i];
        }
    }
    																										// notes
    if ((nom == "senatus") ||
        (nom == "tumultus") ||
        (nom == "exercitus")) {
            d[16] = "gen. s. also '" + stem + "i'";
            d[17] = "and other cases also 2nd decl.";
        }
        
    if (nom == "passus") {
        d[16] = "also gen. pl. 'passum'";
    }
    
    d[12] = lemma;                                                    // stores extra info
    d[13] = stem;
    d[14] = gender;
    d[15] = declN;
    d[20] = trans;

    return d;
}
// ----------------------------------------------------------------------------------------------------------------------------


function decline5(nom, stem, gender, declN, trans, lemma) {                              // 5th declension
var d = new Array(21);

    for(var i=0; i<21; i++) {                                                   // clears the arrays
        d[i] = "";
        irrForms[i] = "";
    }
  

    for (var i=0; i<6; i++) {                                                 // builds standard cases for singular
      d[i] = stem + des5[i];
    }
    
    if ((nom == "dies") || (nom == "res")) {                       // builds full plural ONLY for dies and res
         for (var i=6; i<12; i++) {                                                 
            d[i] = stem + des5[i];
        }
    }
    
    if ((nom == "acies") ||                                                  // partial plural for other nouns
        (nom == "spes") ||
        (nom == "facies") ||
        (nom == "species") ||
        (nom == "effigies")) {
            d[6] = stem + des5[6];
            d[9] = stem + des5[9];
            d[10]= stem + des5[10];
    }
    
    if ((nom == "pigrities") ||                                            // nouns with s. gen and dat. from 1st declension
        (nom == "luxuries") ||
        (nom == "mollities") ||
        (nom == "barbaries") ||
        (nom == "materies")) {
            d[1] = stem + "ae";
            	irrForms[1] = d[1];
            d[2] = stem + "ae";
            	irrForms[2] = d[2];
            d[16] = "gen. and dat. s. from 1st decl.";
    }
        
       
    d[12] = lemma;                                                    // stores extra info
    d[13] = stem;
    d[14] = gender;
    d[15] = declN;
	 d[20] = trans;

    return d;
}


// ----------------------------------------------------------------------------------------------------------------------------
                                                                                                                // DECLINE FUNCTION

function decline(nom, stem, gender, declN, trans, lemma){
    var r = new Array(21);
    
    switch (declN)
    {
        case "1":
            r = decline1 (nom, stem, gender, declN, trans, lemma);
            break;
        case "2":
            r = decline2 (nom, stem, gender, declN, trans, lemma);
            break; 
        case "3a":
            r = decline3a (nom, stem, gender, declN, trans, lemma);
            break; 
        case "3b":
            r = decline3b (nom, stem, gender, declN, trans, lemma);
            break;
		  case "3c":
            r = decline3c (nom, stem, gender, declN, trans, lemma);
            break;          
        case "4":
            r = decline4 (nom, stem, gender, declN, trans, lemma);
            break; 
	     case "5":
            r = decline5 (nom, stem, gender, declN, trans, lemma);
            break; 
        
    }
 
    return r;
    
}



