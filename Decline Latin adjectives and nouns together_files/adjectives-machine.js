/* N.B. after 12 cases des[0-11]:
        des[12]: lemma
        des[13]: stem
        des[14]: gender
        des[15]: declination
        des[16-19]: notes
        des[20]: translation
*/


	
	currentForm = 1;                // --------------------  select form for 1, 2, or 3 endings
	
	irrAdjForms = [];   //-------------------   contains irregular forms for current adjective
		for (var i=0; i<12; i++)
			irrAdjForms[i] = [];
	
	desAdj1 = [];      // -----------------------  arrays of desinences
		for (var i=0; i<12; i++)
			desAdj1[i] = [];
	desAdj2 = [];
		for (var i=0; i<12; i++)
			desAdj2[i] = [];
	pQui = [];
		for (var i=0; i<11; i++)
			pQui = [];
	
	desPron = [];
		for (var i=0; i<11; i++)
			pQui = [];

	desAdj1[0] = ["us", "a", "um"];
	desAdj1[1] = ["i", "ae", "i"];
	desAdj1[2] = ["o", "ae", "o"];
	desAdj1[3] = ["um", "am", "um"];
	desAdj1[4] = ["e", "a", "um"];
	desAdj1[5] = ["o", "a", "o"];
	desAdj1[6] = ["i", "ae", "a"];
	desAdj1[7] = ["orum", "arum", "orum"];
	desAdj1[8] = ["is", "is", "is"];
	desAdj1[9] = ["os", "as", "a"];
	desAdj1[10] = ["i", "ae", "a"];
	desAdj1[11] = ["is", "is", "is"];

	desAdj2[0] = ["--", "is", "e"];
	desAdj2[1] = ["is", "is","is"];
	desAdj2[2] = ["i", "i", "i"];
	desAdj2[3] = ["em", "em", "e"];
	desAdj2[4] = ["--", "is", "e"];
	desAdj2[5] = ["i", "i", "i"];
	desAdj2[6] = ["es", "es", "ia"];
	desAdj2[7] = ["ium", "ium", "ium"];
	desAdj2[8] = ["ibus", "ibus", "ibus"];
	desAdj2[9] = ["es", "es", "ia"];
	desAdj2[10] = ["es", "es", "ia"];
	desAdj2[11] = ["ibus", "ibus", "ibus"];
	
	pQui[0] = ["qui", "quae", "quod"];
	pQui[1] = ["cuius", "cuius", "cuius"];
	pQui[2] = ["cui", "cui", "cui"];
	pQui[3] = ["quem", "quam", "quod"];
	pQui[4] = ["", "", ""];
	pQui[5] = ["quo", "qua", "quo"];
	pQui[6] = ["qui", "quae", "quae"];
	pQui[7] = ["quorum", "quarum", "quorum"];
	pQui[8] = ["quibus", "quibus", "quibus"];
	pQui[9] = ["quos", "quas", "quae"];
	pQui[10] = ["", "", ""];
	pQui[11] = ["quibus", "quibus", "quibus"];
	
	desPron[0] = ["us", "a", "um"];
	desPron[1] = ["ius", "ius", "ius"];
	desPron[2] = ["i", "i", "i"];
	desPron[3] = ["um", "am", "um"];
	desPron[4] = ["", "", ""];
	desPron[5] = ["o", "a", "o"];
	desPron[6] = ["i", "ae", "a"];
	desPron[7] = ["orum", "arum", "orum"];
	desPron[8] = ["is", "is", "is"];
	desPron[9] = ["os", "as", "a"];
	desPron[10] = ["", "", ""];
	desPron[11] = ["is", "is", "is"];
	
// ---------------------------------------------------------------------------------------------- 1st and 2nd declension adjectives

function declineAdj1(nom, stem, adjSet, trans) {         

var d = new Array(21);
	 for (var i=0; i<21; i++)
		d[i] = new Array(3);
		
	 for(var i=0; i<21; i++)                                                    // clears the arrays
		for (var x=0; x<3; x++) 	        
        	d[i][x] = "";
        	
	 for (var i=0; i<12; i++)
    	for (var x=0; x<3; x++)
    		irrAdjForms[i][x] = ""; 
    		
    currentForm = "1"                                                        // needs form for 3 endings
 	
    for (var w=0; w<12; w++)                                                 // builds standard cases
    	for (var z=0; z<3; z++)
			d[w][z] = stem + desAdj1[w][z];
	
	 d[0][0] = nom;                                                           // restores nom. m. s. for -er adj.
	 		
	                           // ------------------------------------------------------------------------IRREGULARS
	                           
	 if (nom == "meus")        //------------------------------------------------ vocative of "meus"                                                                  
		d[4] = ["mi", "mi", "mi"];
	
	                           //------------------------------------------------ gen -ius, dat. -i
	 if ((nom == "totus") || (nom == "unus") || (nom == "alius") || (nom == "solus")) {
	 	d[1][0] = stem + "ius";
	 	d[1][1] = stem + "ius";
	 	d[1][2] = stem + "ius";
	 	irrAdjForms[1][0] = d[1][0];
	 	irrAdjForms[1][1] = d[1][1];
	 	irrAdjForms[1][2] = d[1][2];
	 	d[2][0] = stem + "i";
	 	d[2][1] = stem + "i";
	 	d[2][2] = stem + "i";
	 	irrAdjForms[2][0] = d[2][0];
	 	irrAdjForms[2][1] = d[2][1];
	 	irrAdjForms[2][2] = d[2][2];
	 }
	 
	 if (nom == "alius")      //----------------------------------------------- alius, n.s. aliud
	 	d[0][2] = "aliud";
		
	 if ((nom == "tuus") || (nom == "suus") || (nom == "vester")) // ---------------vocative of other possessives (excl. noster) 
	 	d[4] = ["", "", ""];
    
    d[12][0] = d[0][0] + ", a, um";                                                                // stores extra info
    	if ((nom.substring(nom.length-1, nom.length) == "r") && (nom != stem)) {    // (lemma for -er adj.)
    		var pc = stem.substring(stem.length-2, stem.length-1);
    		if (pc == "h")
    			pc = stem.substring(stem.length-3, stem.length-1);
    		d[12][0] = d[0][0] + ", " + pc + "ra, " + pc + "rum";
    	}
    d[13][0] = stem;
    d[15][0] = "1";
    d[20][0] = trans;
 
    return d;
}

// ---------------------------------------------------------------------------------------------- 3rd declension adjectives - 3 endings

function declineAdj2a(nom, stem, adjSet, trans) {  

var d = new Array(21);
	 for (var i=0; i<21; i++)
		d[i] = new Array(3);
		
	 for(var i=0; i<21; i++)                                                    // clears the arrays
		for (var x=0; x<3; x++) 	        
        	d[i][x] = "";
        	
	 for (var i=0; i<12; i++)
    	for (var x=0; x<3; x++)
    		irrAdjForms[i][x] = ""; 
        
    currentForm = "1"                                                        // needs form for 3 endings
 	
    for (var w=0; w<12; w++)                                                 // builds standard cases
    	for (var z=0; z<3; z++)
			d[w][z] = stem + desAdj2[w][z];
	
	 d[0][0] = nom;                                                           // restores nom. m. s. for -er adj.		
	 d[4][0] = nom;                                                           // voc. m. s. = nom. m. s.
	
    
    d[12][0] = d[0][0] + ", is, e";                                         // stores extra info
    	if ((nom.substring(nom.length-1, nom.length) == "r") && (nom != stem)) {    // (lemma for -er adj.)
    		var pc = stem.substring(stem.length-2, stem.length-1);
    		if (pc == "h")
    			pc = stem.substring(stem.length-3, stem.length-1);
    		d[12][0] = d[0][0] + ", " + pc + "ris, " + pc + "re";
    	}
    // if (stem != nom)
    //	d[12][0] = d[0][0] + ", " + d[0][1] + ", " + d[0][2];
    d[13][0] = stem;
    d[15][0] = "1";
    d[20][0] = trans;
    
    return d;	      

}

// ---------------------------------------------------------------------------------------------- 3rd declension adjectives - 2 endings

function declineAdj2b(nom, stem, adjSet, trans) {  

var d = new Array(21);
	 for (var i=0; i<21; i++)
		d[i] = new Array(3);
		
	 for(var i=0; i<21; i++)                                                    // clears the arrays
		for (var x=0; x<3; x++) 	        
        	d[i][x] = "";
        	
	 for (var i=0; i<12; i++)
    	for (var x=0; x<3; x++)
    		irrAdjForms[i][x] = ""; 

    currentForm = "2"                                                        // needs form for 2 endings
 	
    for (var w=0; w<12; w++) {                                                // builds standard cases
    	d[w][0] = stem + desAdj2[w][1];           										// masc.-fem.
    	d[w][1] = stem + desAdj2[w][2];														// neuter
    }
	
	    
    d[12][0] = d[0][0] + ", e";                                             // stores extra info
    d[13][0] = stem;
    d[15][0] = "1";
    d[20][0] = trans;
    
    return d;		      

}

// ---------------------------------------------------------------------------------------------- 3rd declension adjectives - 1 ending

function declineAdj2c(nom, stem, adjSet, trans) {  
	      
var d = new Array(21);
	 for (var i=0; i<21; i++)
		d[i] = new Array(3);
		
	 for(var i=0; i<21; i++)                                                    // clears the arrays
		for (var x=0; x<3; x++) 	        
        	d[i][x] = "";
        	
	 for (var i=0; i<12; i++)
    	for (var x=0; x<3; x++)
    		irrAdjForms[i][x] = ""; 
        
    currentForm = "3"                                                        // needs form for 1 ending
 	
    for (var w=0; w<12; w++) {                                                // builds standard cases
    	d[w][0] = stem + desAdj2[w][0];           										// all genders
    }
    d[0][0] = nom;
    d[4][0] = nom;
    																									// adds neuter
    d[3][1] = nom;
    d[6][1] = stem + "ia";
	 d[9][1] = stem + "ia";
	 d[10][1] = stem + "ia";

	                           // ------------------------------------------------------------------------IRREGULARS

	                           // -------------------------------------------- abl.s. -e, gen. pl. -um
	                           
	 if ((nom == "pauper") || (nom == "princeps") || (nom == "particeps") || (nom == "superstes") || (nom == "compos") || (nom == "sospes") || (nom == "dives") || (nom == "vetus")) {
	 	d[5][0] = stem + "e";
	 	d[7][0] = stem + "um";
	 	irrAdjForms[5][0] = d[5][0];
	 	irrAdjForms[7][0] = d[7][0];
	 }	    
	 
	                           // -------------------------------------------- gen. pl. -um
	                           
	 if ((nom =="memor") || (nom == "immemor") || (nom == "inops") || (nom == "supplex") || (nom == "vigil")) {
		d[7][0] = stem + "um";
		irrAdjForms[7][0] = d[7][0];	 	
	 }




	    
    d[12][0] = d[0][0] + ", " + d[1][0];                                    // stores extra info
    d[13][0] = stem;
    d[15][0] = "1";
    d[20][0] = trans;
    
    return d;		      

}

// ---------------------------------------------------------------------------------------------- personal pronouns

function declineAdj3(nom, stem, adjSet, trans) {  
	      
var d = new Array(21);
	 for (var i=0; i<21; i++)
		d[i] = new Array(3);
		
	 for(var i=0; i<21; i++)                                                    // clears the arrays
		for (var x=0; x<3; x++) 	        
        	d[i][x] = "";
        	
	 for (var i=0; i<12; i++)
    	for (var x=0; x<3; x++)
    		irrAdjForms[i][x] = ""; 
        
    currentForm = "4"                                                        // needs form for personal pron.
 	
    switch(nom) {
    	case "ego":
    		d[0][0] = "ego";
    		d[1][0] = "mei";
    		d[2][0] = "mihi";
    		d[3][0] = "me";
    		d[4][0] = "";
    		d[5][0] = "me";
    		d[12][0] = "ego";     //lemma
    		d[13][0] = "--";      // stem
    		d[15][0] = "3";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "emphatic forms: egomet, mihimet, memet";
    	break;
    	
    	case "tu":
    		d[0][0] = "tu";
    		d[1][0] = "tui";
    		d[2][0] = "tibi";
    		d[3][0] = "te";
    		d[4][0] = "";
    		d[5][0] = "te";
    		d[12][0] = "tu";     //lemma
    		d[13][0] = "--";      // stem
    		d[15][0] = "3";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "emphatic forms: tute, tete";
    	break;
    	
    	case "nos":
    		d[0][0] = "nos";
    		d[1][0] = "nostri, nostrum";
    		d[2][0] = "nobis";
    		d[3][0] = "nos";
    		d[4][0] = "";
    		d[5][0] = "nobis";
    		d[12][0] = "nos";     //lemma
    		d[13][0] = "no";      // stem
    		d[15][0] = "3";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "emphatic forms: nosmet, nobismet";
    		d[17][0] = "gen. objective: nostri";
    		d[18][0] = "gen. partitive: nostrum";
    		irrAdjForms[1][0] = "nostri, nostrum";
    	break;
    	
    	case "vos":
    		d[0][0] = "vos";
    		d[1][0] = "vestri, vestrum";
    		d[2][0] = "vobis";
    		d[3][0] = "vos";
    		d[4][0] = "";
    		d[5][0] = "vobis";
    		d[12][0] = "vos";     //lemma
    		d[13][0] = "vo";      // stem
    		d[15][0] = "3";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "emphatic forms: vosmet, vobismet";
    		d[17][0] = "gen. objective: vestri/vostri";
    		d[18][0] = "gen. partitive: vestrum/vostrum";
    		irrAdjForms[1][0] = "vestri, vestrum";
    	break;
    	
    	case "se":
    		d[0][0] = "";
    		d[1][0] = "sui";
    		d[2][0] = "sibi";
    		d[3][0] = "se";
    		d[4][0] = "";
    		d[5][0] = "se";
    		d[12][0] = "se";     //lemma
    		d[13][0] = "--";      // stem
    		d[15][0] = "3";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "emphatic form: sese";
    		d[17][0] = "N.B.: only reflexive use";
    	break;
    }
	    
	 return d;		      

}

// ---------------------------------------------------------------------------------------------- demonstratives, intensive 

function declineAdj4(nom, stem, adjSet, trans) {  
	      
var d = new Array(21);
	 for (var i=0; i<21; i++)
		d[i] = new Array(3);
		
	 for(var i=0; i<21; i++)                                                    // clears the arrays
		for (var x=0; x<3; x++) 	        
        	d[i][x] = "";
        	
	 for (var i=0; i<12; i++)
    	for (var x=0; x<3; x++)
    		irrAdjForms[i][x] = ""; 
        
    currentForm = "1"                                                        // needs form for 3-endings
 	
    switch(nom) {
    	case "hic":
    		d[0] = ["hic", "haec", "hoc"];
    		d[1] = ["huius", "huius", "huius"];
    		d[2] = ["huic", "huic", "huic"];
    		d[3] = ["hunc", "hanc", "hoc"];
    		d[4] = ["", "", ""];
    		d[5] = ["hoc", "hac", "hoc"];
    		d[6] = ["hi", "hae", "haec"];
    		d[7] = ["horum", "harum", "horum"];
    		d[8] = ["his", "his", "his"];
    		d[9] = ["hos", "has", "haec"];
    		d[10] = ["", "", ""];
    		d[11] = ["his", "his", "his"];
    		d[12][0] = "hic, haec, hoc";     //lemma
    		d[13][0] = "--";      // stem
    		d[15][0] = "4";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "";
    	break;
    	
    	case "ille":
    		d[0] = ["ille", "illa", "illud"];
    		d[1] = ["illius", "illius", "illius"];
    		d[2] = ["illi", "illi", "illi"];
    		d[3] = ["illum", "illam", "illud"];
    		d[4] = ["", "", ""];
    		d[5] = ["illo", "illa", "illo"];
    		d[6] = ["illi", "illae", "illa"];
    		d[7] = ["illorum", "illarum", "illorum"];
    		d[8] = ["illis", "illis", "illis"];
    		d[9] = ["illos", "illas", "illa"];
    		d[10] = ["", "", ""];
    		d[11] = ["illis", "illis", "illis"];
    		d[12][0] = "ille, illa, illud";     //lemma
    		d[13][0] = "--";      // stem
    		d[15][0] = "4";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "";
    	break;
    	
    	case "iste":
    		d[0] = ["iste", "ista", "istud"];
    		d[1] = ["istius", "istius", "istius"];
    		d[2] = ["isti", "isti", "isti"];
    		d[3] = ["istum", "istam", "istud"];
    		d[4] = ["", "", ""];
    		d[5] = ["isto", "ista", "isto"];
    		d[6] = ["isti", "istae", "ista"];
    		d[7] = ["istorum", "istarum", "istorum"];
    		d[8] = ["istis", "istis", "istis"];
    		d[9] = ["istos", "istas", "ista"];
    		d[10] = ["", "", ""];
    		d[11] = ["istis", "istis", "istis"];
    		d[12][0] = "iste, ista, istud";     //lemma
    		d[13][0] = "--";      // stem
    		d[15][0] = "4";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "";
    	break;
    	
    	case "is":
    		d[0] = ["is", "ea", "id"];
    		d[1] = ["eius", "eius", "eius"];
    		d[2] = ["ei", "ei", "ei"];
    		d[3] = ["eum", "eam", "id"];
    		d[4] = ["", "", ""];
    		d[5] = ["eo", "ea", "eo"];
    		d[6] = ["ii", "eae", "ea"];
    		d[7] = ["eorum", "earum", "eorum"];
    		d[8] = ["iis", "iis", "iis"];
    		d[9] = ["eos", "eas", "ea"];
    		d[10] = ["", "", ""];
    		d[11] = ["iis", "iis", "iis"];
    		d[12][0] = "is, ea, id";     //lemma
    		d[13][0] = "--";      // stem
    		d[15][0] = "4";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "alternative forms for ii: ei, i";
    		d[17][0] = "alternative forms for iis: eis, is";
    	break;
    		
    	case "idem":
    		d[0] = ["idem", "eadem", "idem"];
    		d[1] = ["eiusdem", "eiusdem", "eiusdem"];
    		d[2] = ["eidem", "eidem", "eidem"];
    		d[3] = ["eundem", "eandem", "idem"];
    		d[4] = ["", "", ""];
    		d[5] = ["eodem", "eadem", "eodem"];
    		d[6] = ["iidem", "eaedem", "eadem"];
    		d[7] = ["eorundem", "earundem", "eorundem"];
    		d[8] = ["iisdem", "iisdem", "iisdem"];
    		d[9] = ["eosdem", "easdem", "eadem"];
    		d[10] = ["", "", ""];
    		d[11] = ["iisdem", "iisdem", "iisdem"];
    		d[12][0] = "idem, eadem, idem";     //lemma
    		d[13][0] = "--";      // stem
    		d[15][0] = "4";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "";
    		d[17][0] = "";
    	break;
    	
    	case "ipse":
    		d[0] = ["ipse", "ipsa", "ipsum"];
    		d[1] = ["ipsius", "ipsius", "ipsius"];
    		d[2] = ["ipsi", "ipsi", "ipsi"];
    		d[3] = ["ipsum", "ipsam", "ipsum"];
    		d[4] = ["", "", ""];
    		d[5] = ["ipso", "ipsa", "ipso"];
    		d[6] = ["ipsi", "ipsae", "ipsa"];
    		d[7] = ["ipsorum", "ipsarum", "ipsorum"];
    		d[8] = ["ipsis", "ipsis", "ipsis"];
    		d[9] = ["ipsos", "ipsas", "ipsa"];
    		d[10] = ["", "", ""];
    		d[11] = ["ipsis", "ipsis", "ipsis"];
    		d[12][0] = "ipse, ipsa, ipsum";     //lemma
    		d[13][0] = "--";      // stem
    		d[15][0] = "4";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "";
    		d[17][0] = "";
    	break;
    }
	
	 return d;		      

}

// ---------------------------------------------------------------------------------------------- qui and derivatives 

function declineAdj5(nom, stem, adjSet, trans) {  
	      
var d = new Array(21);
	for (var i=0; i<21; i++)
		d[i] = new Array(3);
		
	for(var i=0; i<21; i++)                                                    // clears the arrays
		for (var x=0; x<3; x++) 	        
      	d[i][x] = "";
        	
	for (var i=0; i<12; i++)
   	for (var x=0; x<3; x++)
    		irrAdjForms[i][x] = ""; 
        
   currentForm = "1"                                                        // needs form for 3-endings
    	
 	
   if (nom == "qui") {
   		for (var i=0; i<12; i++)
   			d[i] = pQui[i];
   		currentForm = "1";       // form for 3-ending
   		d[12][0] = "qui, quae, quod";     //lemma
    		d[13][0] = "--";      // stem
    		d[15][0] = "5";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "";
    		d[17][0] = "";
    }
    	
    if (nom == "quis") {
   		for (var i=0; i<12; i++) {
   			d[i][0] = pQui[i][0];
   			d[i][1] = pQui[i][2];
   		}
   		d[0] = ["quis", "quid", ""];
   		d[3] = ["quem", "quid", ""]
   		currentForm = "2";       // form for 2-ending
   		d[12][0] = "quis, quid";     //lemma
    		d[13][0] = "--";      // stem
    		d[15][0] = "5";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "";
    		d[17][0] = "";
    }

    if (nom == "aliquis") {
   		for (var i=0; i<12; i++) {
   			d[i][0] = "ali" + pQui[i][0];
   			d[i][1] = "ali" + pQui[i][2];
   		}
   		d[0] = ["aliquis", "aliquid", ""];
   		d[3] = ["aliquem", "aliquid", ""];
   		d[4] = ["", "", ""];
   		d[6] = ["aliqui", "aliqua", ""];
   		d[9] = ["aliquos", "aliqua", ""];
   		d[10] = ["", "", ""];
   		currentForm = "2";       // form for 2-ending
   		d[12][0] = "aliquis, aliquid";     //lemma
    		d[13][0] = "--";      // stem
    		d[15][0] = "5";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "";
    		d[17][0] = "";
    }
    	
    if (nom ==	"aliqui") {
   		for (var i=0; i<12; i++) {
   			d[i][0] = "ali" + pQui[i][0];
   			d[i][1] = "ali" + pQui[i][1];
   			d[i][2] = "ali" + pQui[i][2];
   		}
   		d[0] = ["aliqui", "aliqua", "aliquod"];
   		d[4] = ["", "", ""];
   		d[6][2] = "aliqua";
   		d[9][2] = "aliqua";
   		d[10] = ["", "", ""];
   		currentForm = "1";       // form for 3-ending
   		d[12][0] = "aliqui, aliqua, aliquod";     //lemma
    		d[13][0] = "--";      // stem
    		d[15][0] = "5";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "";
    		d[17][0] = "";
    }
    	
    if (nom ==	"quidam") {
   		for (var i=0; i<12; i++) {
				d[i][0] = pQui[i][0] + "dam";
				d[i][1] = pQui[i][1] + "dam";
				d[i][2] = pQui[i][2] + "dam";
   		}
   		d[4] = ["", "", ""];
   		d[3] = ["quendam", "quandam", "quoddam"];
   		d[7] = ["quorundam", "quarundam", "quorundam"]; 
   		d[10] = ["", "", ""];
   		currentForm = "1";       // form for 3-ending
   		d[12][0] = "quidam, quaedam, quoddam";     //lemma
    		d[13][0] = "--";      // stem
    		d[15][0] = "5";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "";
    		d[17][0] = "";
    }
    	
    if (nom == "quicumque") {
   		for (var i=0; i<12; i++) {
				d[i][0] = pQui[i][0] + "cumque";
				d[i][1] = pQui[i][1] + "cumque";
				d[i][2] = pQui[i][2] + "cumque";
   		}
   		d[4] = ["", "", ""];
   		d[10] = ["", "", ""];		   		
   		currentForm = "1";       // form for 3-ending
   		d[12][0] = "quicumque, quaecumque, quodcumque";     //lemma
    		d[13][0] = "--";      // stem
    		d[15][0] = "5";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "";
    		d[17][0] = "";
    }
    	
    if (nom == "quisquam") {
   		for (var i=0; i<6; i++){ 
  				d[i][0] = pQui[i][0] + "quam";
  				d[i][1] = pQui[i][2] + "quam";
  			}
   		d[0] = ["quisquam", "quicquam", ""];
   		d[1] = ["cuiusquam", "ullius rei", ""];
   			irrAdjForms[1][1] = d[1][1];
   		d[2] = ["cuiquam", "ulli rei", ""];
   			irrAdjForms[2][1] = d[2][1];
   		d[4] = ["", "", ""];
   		d[5] = ["ullo", "ulla re", ""];
   			irrAdjForms[5] = d[5];
   		currentForm = "2";       // form for 2-ending
   		d[12][0] = "quisquam, quicquam";     //lemma
    		d[13][0] = "--";      // stem
    		d[15][0] = "5";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "";
    		d[17][0] = "";
    }
    	
    if (nom == "quisque") {
   		for (var i=0; i<12; i++){ 
  				d[i][0] = pQui[i][0] + "que";
  				d[i][1] = pQui[i][2] + "que";
  			}
  			d[0] = ["quisque", "quidque", ""];
   		d[3] = ["quemque", "quidque", ""];
   		d[4] = ["", "", ""];
   		currentForm = "2";       // form for 2-ending
   		d[12][0] = "quisque, quidque";     //lemma
    		d[13][0] = "--";      // stem
    		d[15][0] = "5";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "Note: also quicque for quidque";
    		d[17][0] = "Note: also adj. quique, quaeque, quodque";
    }
    	
    if (nom == "unusquisque") {
   		d[0] = ["unusquisque", "unumquidque", ""];
   		d[1] = ["uniuscuiusque", "uniuscuiusque", ""];
   		d[2] = ["unicuique", "unicuique", ""];
   		d[3] = ["unumquemque", "unumquidque", ""];
   		d[4] = ["", "", ""];
   		d[5] = ["unoquoque", "unoquoque", ""];
   		currentForm = "2";       // form for 2-ending
   		d[12][0] = "unusquisque, unumquidque";     //lemma
    		d[13][0] = "--";      // stem
    		d[15][0] = "5";       // set
    		d[20][0] = trans; 	 // translation
    		d[16][0] = "Note: also adj. unusquisque, unaquaeque, unumquodque";
    		d[17][0] = "";
    }
    	
    return d 	   	
}

// ---------------------------------------------------------------------------------------------- uter and derivatives 

function declineAdj6 (nom, stem, adjSet, trans) {
	
	var d = new Array(21);
	for (var i=0; i<21; i++)
		d[i] = new Array(3);
		
	for(var i=0; i<21; i++)                                                    // clears the arrays
		for (var x=0; x<3; x++) 	        
      	d[i][x] = "";
        	
	for (var i=0; i<12; i++)
   	for (var x=0; x<3; x++)
    		irrAdjForms[i][x] = ""; 
   
   currentForm = "1"                                                        // needs form for 3-endings
	
	for (var i=0; i<12; i++)                                                 // builds standard forms
		if ((i != 4) && (i != 10)) {
   		d[i][0] = "utr" + desPron[i][0];
   		d[i][1] = "utr" + desPron[i][1];
   		d[i][2] = "utr" + desPron[i][2];
   	}
	
   d[0][0] = "uter";                                                        // restores nominative m. s.
   
   switch(nom) {
   	case "uter":
   		d[12][0] = "uter, utra, utrum";   		
   	break;
   	
   	case "uterque":
   		for (var i=0; i<12; i++)
   			if ((i != 4) && (i != 10)) {
   				d[i][0] = d[i][0] + "que";
   				d[i][1] = d[i][1] + "que";
   				d[i][2] = d[i][2] + "que";
   			}
   		d[12][0] = "uterque, utraque, utrumque";
   	break;
   	
   	case "neuter":
   		for (var i=0; i<12; i++)
   			if ((i != 4) && (i != 10)) {
   				d[i][0] = "ne" + d[i][0];
   				d[i][1] = "ne" + d[i][1];
					d[i][2] = "ne" + d[i][2];   				
   			}
   		d[12][0] = "neuter, neutra, neutrum";
   	break;
   }
   
	d[13][0] = stem;      // stem
   d[15][0] = "6";       // set
   d[20][0] = trans; 	 // translation
	
	return d;

}

// ---------------------------------------------------------------------------------------------- other indefinites 


function declineAdj7 (nom, stem, adjSet, trans) {

	var d = new Array(21);
	for (var i=0; i<21; i++)
		d[i] = new Array(3);
		
	for(var i=0; i<21; i++)                                                    // clears the arrays
		for (var x=0; x<3; x++) 	        
      	d[i][x] = "";
        	
	for (var i=0; i<12; i++)
   	for (var x=0; x<3; x++)
    		irrAdjForms[i][x] = ""; 
        
   currentForm = "1"                                                        // needs form for 3-endings
   
  	for (var i=0; i<12; i++)                                                 // builds standard forms
		if ((i != 4) && (i != 10)) {
   		d[i][0] = stem + desPron[i][0];
   		d[i][1] = stem + desPron[i][1];
   		d[i][2] = stem + desPron[i][2];
   	}

   switch(nom) {
   	case "ullus":
   		d[12][0] = "ullus, ulla, ullum";
   	break;
   	
   	case "nullus":
   		d[12][0] = "nullus, nulla, nullum";
   	break;
   	
   	case "alius":
   		d[12][0] = "alius, alia, alium";
   	break;
   	
   	case "alter":
   		d[0][0] = "alter";
   		d[12][0] = "alter, altera, alterum";
   	break;
   	
		case "nemo":
			for(var i=0; i<21; i++)                                                    // clears the arrays
				for (var x=0; x<3; x++) 	        
      			d[i][x] = "";
      	currentForm = "4"                                                        // needs form for 1-ending
      	d[0][0] = "nemo";
      	d[1][0] = "nullius";
      	d[2][0] = "nulli";
      	d[3][0] = "neminem";
      	d[5][0] = "nullo"; 
      	d[12][0] = "nemo";
      	d[16][0] = "Note: gen. also 'neminis'";
      	irrAdjForms[1][0] = d[1][0];
      	irrAdjForms[2][0] = d[2][0];
			irrAdjForms[5][0] = d[5][0];
   	break;
   	
   	case "nihil":
			for(var i=0; i<21; i++)                                                    // clears the arrays
				for (var x=0; x<3; x++) 	        
      			d[i][x] = "";
      	currentForm = "4"                                                        // needs form for 1-ending
      	d[0][0] = "nihil";
      	d[1][0] = "nullius rei";
      	d[2][0] = "nulli rei";
      	d[3][0] = "nihil";
      	d[5][0] = "nulla re"; 
      	d[12][0] = "nihil";
      	irrAdjForms[1][0] = d[1][0];
      	irrAdjForms[2][0] = d[2][0];
			irrAdjForms[5][0] = d[5][0];
   	break;
   }
	
	d[13][0] = stem;      // stem
   d[15][0] = "7";       // set
   d[20][0] = trans; 	 // translation
   
	return d;

}
// ---------------------------------------------------------------------------------------------- MAIN DECLINE FUNCTION

function declineAdj(nom, stem, adjSet, trans){
	
var r = new Array(21);
	 for (var i=0; i<21; i++)
		r[i] = new Array(3);
	
	 switch (adjSet)
    {
        case "1":
				r = declineAdj1 (nom,stem,adjSet,trans);
            break;
        case "2a":
            r = declineAdj2a (nom,stem,adjSet,trans);
            break;
        case "2b":
            r = declineAdj2b (nom,stem,adjSet,trans);
            break;  
        case "2c":
            r = declineAdj2c (nom,stem,adjSet,trans);
            break; 
        case "3":
        		r = declineAdj3 (nom, stem, adjSet, trans);
        		break;
        	case "4":
        		r = declineAdj4 (nom, stem, adjSet, trans);
        		break;
        	case "5":
        		r = declineAdj5 (nom, stem, adjSet, trans);
        		break;
        	case "6":
        		r = declineAdj6 (nom, stem, adjSet, trans);
        		break;
        	case "7":
        	   r = declineAdj7 (nom, stem, adjSet, trans);
        		break;
    }
	 
    return r;
    
}
