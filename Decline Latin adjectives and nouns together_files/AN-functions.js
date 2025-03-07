
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  GLOBAL VARIABLES 

	totANMistakes = 0;	
	adjectiveFirst = true;
 	currentANSet = 1;
 	currentANSequential = -1;
	currentAN = [];
		for(var i=0; i<21; i++)
			currentAN[i] = ["", ""];
	irrANForms = [];
		for (var i=0; i<12; i++)
			irrANForms[i] = ["", ""];
	currentGender = "m";

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ prototype of Array.indexOf (otherwise not working in IE)

if(!Array.indexOf){
  Array.prototype.indexOf = function(obj){
   for(var i=0; i<this.length; i++){
    if(this[i]==obj){
     return i;
    }
   }
   return -1;
  }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ manage default values in input forms

function onBlur(el) {	
    if (trimAndLower(el.value) == '') {
        el.value = el.defaultValue;
        el.className = "lightGray";
    }
    else {
    	el.value = trimAndLower(el.value);
    	el.className = "normColor";
    }
}

function onFocus(el) {
	 if ((el.value == el.defaultValue) && (el.defaultValue[0] == "(")) {
        el.value = '';
        el.className = "normColor";
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ converts to lowcase and deletes spaces

function trim(s)
{
	var l=0; var r=s.length -1;
	while(l < s.length && s[l] == ' ')
	{	l++; }
	while(r > l && s[r] == ' ')
	{	r-=1;	}
	return s.substring(l, r+1);
}

function trimAndLower(paramString) {
	return trim(paramString.toLowerCase());
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ extracts test scope from open window parameters (if any)

function extractANSet() {                                       
                                                                    // default set is the first part of the first parameter
																							// other parameters are ignored
   var s;
                                                                                   
	if (location.search.substring(1).length > 0) {   
   	var par = location.search.substring(1);
   	var pars = new Array();
   	pars=par.split("&");                                                // split parameter string into an array of single parameters
   	s = pars[0].substr(pars[0].indexOf("=")+1);                     // s contains the default declination
   } else {
   	s = "1";																			// default = "1"
   }
   currentANSet = s;
   return s;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ returns a number

function getNumber(n) {
	currentANSequential ++;
	if (currentANSequential >= n)
		currentANSequential = 0;
	return currentANSequential;
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ selects AN from current set

function selectAN(ANSet) {
  
  	var xAN;
  	var num;
  	
   switch (ANSet) {
   	case "1":                                                     // 1st and 2nd decl.
   		num = getNumber(dBaseAN1.length);
   		xAN = dBaseAN1[num];
   		break;
   	case "2":                                                     // 1st, 2nd and 3rd decl. 
   		num = getNumber(dBaseAN2.length);
   		xAN = dBaseAN2[num];
   	break;
   	case "3":                                                     // personal pronouns
   		num = getNumber(dBaseAN3.length);
   		xAN = dBaseAN3[num];
   	break;
   } 
    
   return xAN; 
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ preSelectANSet(n)

function preSelectANSet(itemToSelect) {
    
    // Loop through all the items
    for (iLoop = 0; iLoop< selectForm.scopeSelection.options.length; iLoop++)
    {    
      if (selectForm.scopeSelection.options[iLoop].value == itemToSelect)
      {
        // Item is found. Set its selected property, and exit the loop
        selectForm.scopeSelection.options[iLoop].selected = true;
        break;
      }
    }
}	

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ show singular / plural

function showANForm(n){

	if (n == "Singular") {
		document.getElementById("spanFrm1Singular").className = "visible";
		document.getElementById("spanFrm1Plural").className = "invisible";
	} else {
		document.getElementById("spanFrm1Singular").className = "invisible";
		document.getElementById("spanFrm1Plural").className = "visible";
	}
	
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ disable entry for not used cases

function checkANNotUsedCases(){

	for (var i=0; i<6; i++) {                                // ---- singular
		for(var x=0; x<2; x++){
			frm1[i*2+x].className = "normColor";
			if (currentAN[i][x] == "") {
				frm1[i*2+x].disabled = true;
				frm1[i*2+x].className = "lightGray";
				frm1[i*2+x].value = "(not used)";
			} else { 
				frm1[i*2+x].disabled = false;
				frm1[i*2+x].value = defaultANFormValues[i][x];
			}
		}
	}
	for (var i=6; i<12; i++) {                                // ---- plural
		for(var x=0; x<2; x++){
			frm1[i*2+x+1].className = "normColor";
			if (currentAN[i][x] == "") {
				frm1[i*2+x+1].disabled = true;
				frm1[i*2+x+1].className = "lightGray";
				frm1[i*2+x+1].value = "(not used)";
			} else { 
				frm1[i*2+x+1].disabled = false;
				frm1[i*2+x+1].value = defaultANFormValues[i][x];
			}
		}
	}
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ resets form

function clearANForm() {
	
			for (var i=0; i<6; i++){                                // 2 endings, singular
				for (var x=0; x<2; x++){
					if (frm1[(i*2)+x].disabled != true) {
						frm1[(i*2)+x].className = "normColor";						
						if (irrANForms[i][x] != "") {
							 	frm1[(i*2)+x].value = irrANForms[i][x];
							 	// frm2[(i*2)+x].className = "rightColor";
							}
							else {
								frm1[(i*2)+x].value = defaultANFormValues[i][x];
								frm1[(i*2)+x].className = "lightGray";
							}
					}
				}
			}
			for (var i=6; i<12; i++){                                // 2 endings, plural
				for (var x=0; x<2; x++){
					if (frm1[(i*2)+x+1].disabled != true) {
						frm1[(i*2)+x+1].className = "normColor";						
						if (irrANForms[i][x] != "") {
							 	frm1[(i*2)+x+1].value = irrANForms[i][x];
							 	// frm2[(i*2)+x+1].className = "rightColor";
							}
							else {
								frm1[(i*2)+x+1].value = defaultANFormValues[i][x];
								frm1[(i*2)+x+1].className = "lightGray";
							}
					}
				}
			}
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ writes page headers

function writeANPageHeaders(AN) {
	
	var s = "";
	
	if (adjectiveFirst == true) {
		s = "<i>" + currentAN[12][0] + " + " + currentAN[12][1] + "</i> (" +currentGender + ".)";
	} else {
		s = "<i>" + currentAN[12][0] + "</i> (" + currentGender + ".) <i> + " + currentAN[12][1] + "</i>";
	}
	document.getElementById("header1").innerHTML = '"' + AN[2] + '"';
   document.getElementById("header3").innerHTML = s;

}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ changes the "clear form" button to "try another one" button

function askForNewAN() {
	document.getElementById("clearButton").className = "invisible";
	document.getElementById("tryAnotherButton").className = "visible";
	document.getElementById("checkButton").innerHTML = checkButtonDisabled;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ resets form

function clearANForm() {

			for (var i=0; i<6; i++){                                // 2 endings, singular
				for (var x=0; x<2; x++){
					if (frm1[(i*2)+x].disabled != true) {
						frm1[(i*2)+x].className = "normColor";						
						if (irrANForms[i][x] != "") {
							 	frm1[(i*2)+x].value = irrANForms[i][x];
							 	// frm1[(i*2)+x].className = "rightColor";
							}
							else {
								frm1[(i*2)+x].value = defaultANFormValues[i][x];
								frm1[(i*2)+x].className = "lightGray";
							}
					}
				}
			}
			for (var i=6; i<12; i++){                                // 2 endings, plural
				for (var x=0; x<2; x++){
					if (frm1[(i*2)+x+1].disabled != true) {
						frm1[(i*2)+x+1].className = "normColor";						
						if (irrANForms[i][x] != "") {
							 	frm1[(i*2)+x+1].value = irrANForms[i][x];
							 	// frm1[(i*2)+x+1].className = "rightColor";
							}
							else {
								frm1[(i*2)+x+1].value = defaultANFormValues[i][x];
								frm1[(i*2)+x+1].className = "lightGray";
							}
					}
				}
			}

}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ new AN couple to decline

function newAN() {
	var AN = selectAN(currentANSet);
	
	var rndm = Math.floor(Math.random()*2);                        // adjective first or name first?
	if (rndm == 1) {
		adjectiveFirst = true;
	} else adjectiveFirst = false;	
	currentAN = declineAN(AN, adjectiveFirst);
	
	showANForm("Singular");
	checkANNotUsedCases();
	writeANPageHeaders(AN);
	clearANForm();
	
	document.getElementById("clearButton").className = "visible";
	document.getElementById("tryAnotherButton").className = "invisible";
	document.getElementById("checkButton").innerHTML = checkButtonEnabled;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++ select test scope

function selectANScope(){
	
	var oldANSet = currentANSet;
	
	if(selectForm.scopeSelection.options[0].selected) {   //-----  1st and 2nd declension adjectives & nouns
		currentANSet = "1";
		if (currentANSet != oldANSet) {
			currentANSequential = -1;
			newAN();
		}
	}
	if(selectForm.scopeSelection.options[1].selected) {   //-----  3rd declension adjectives & nouns
		currentANSet = "2";
		if (currentANSet != oldANSet) {
			currentANSequential = -1;
			newAN();
		}
	}
	if(selectForm.scopeSelection.options[2].selected) {   //------ ALL adjectives & nouns 
		currentANSet = "3";
		if (currentANSet != oldANSet) {
			currentANSequential = -1;
			newAN();
		}
	}

}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ shows help page

function showANHelp() {
	var stili = ""
	var popUpHelp = window.open("AN-help.html", "", stili);
}


// ++++++++++++++++++++++++++++++++++++++++++++ select a single couple AN to decline within currentDeclension

function selectSingleAN() {
	
	hiddenSelection.hiddenInput.value = "x" + currentANSet;
	selectPopUp = window.open("selectPage.html", "", "");
	
}

function activatePopUpSelection() {
	
	selectPopUp.close();
	
	var ANNumber = hiddenSelection.hiddenInput.value.toString();
	
	var AN = [];
	
	switch(currentANSet) {
		case "1":
				var AN = dBaseAN1[ANNumber];
		break;
		case "2":
				var AN = dBaseAN2[ANNumber];
		break;
		case "3":
				var AN = dBaseAN3[ANNumber];
		break;
	}
		
	var rndm = Math.floor(Math.random()*2);                        // adjective first or name first?
	if (rndm == 1) {
		adjectiveFirst = true;
	} else adjectiveFirst = false;
	
	currentAN = declineAN(AN, adjectiveFirst);
	showANForm("Singular");
  	checkANNotUsedCases();
  	clearANForm();
	writeANPageHeaders(AN);
	
	document.getElementById("clearButton").className = "visible";
	document.getElementById("checkButton").innerHTML = checkButtonEnabled;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ close  pageAN

function closeANWindow() {
	history.go(-1);
	//window.open('', '_self', ''); //bug fix
	//window.close();
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ checkANForm

function checkANForm() {
	
	var v = "";
	
	for (var i=0; i<6; i++) {                       //singular
		for (var x=0; x<2; x++) {
			if (currentAN[i][x] != "") {
				if (trimAndLower(frm1[(i*2)+x].value) == trimAndLower(currentAN[i][x]))
					frm1[(i*2)+x].className = "rightColor";
				else {
					if (frm1[(i*2)+x].value == defaultANFormValues[i][x]) {
						v = currentAN[i][x];
					} else {
						v = frm1[(i*2)+x].value;
						if (v.length > 12) 
							v = "..." + v.substring(v.length -12);
						v = "[" + v + "] " + currentAN[i][x];
					}
					frm1[(i*2)+x].value = v;
					frm1[(i*2)+x].className = "wrongColor";
					totANMistakes ++;
				}
			}
		}
	}
	
	for (var i=6; i<12; i++) {                     // plural
		for (var x=0; x<2; x++) {
				
			if (currentAN[i][x] != "") {
				if (trimAndLower(frm1[(i*2)+x+1].value) == trimAndLower(currentAN[i][x]))
					frm1[(i*2)+x+1].className = "rightColor";
				else {
					if (frm1[(i*2)+x+1].value == defaultANFormValues[i][x]) {
						v = currentAN[i][x];
					} else {
						v = frm1[(i*2)+x+1].value;
						if (v.length > 12) 
							v = "..." + v.substring(v.length -12);
						v = "[" + v + "] " + currentAN[i][x];
					}
					frm1[(i*2)+x+1].value = v;
					frm1[(i*2)+x+1].className = "wrongColor";
					totANMistakes ++;
				}
			}
		}
	}
	
	showANForm("Singular");
   askForNewAN();
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ initialize pageAN

function initializePageAN() {
	
	var s = extractANSet();
	currentANSet = s;
	var AN = selectAN(currentANSet);
	preSelectANSet(currentANSet);
	
	var rndm = Math.floor(Math.random()*2);                        // adjective first or name first?
	if (rndm == 1) {
		adjectiveFirst = true;
	} else adjectiveFirst = false;
	
	currentAN = declineAN(AN, adjectiveFirst);
		
	showANForm("Singular");
	checkANNotUsedCases();
	clearANForm();
	
	writeANPageHeaders(AN);	
	
	// language-dependent HTML
	document.getElementById("frm1TitleS").innerHTML = LSingularUp;	
	document.getElementById("frm1TitleP").innerHTML = LPluralUp;	
	document.getElementById("frm1bp").innerHTML = LShowPlural;
	document.getElementById("frm1bs").innerHTML = LShowSingular;	
	checkButtonEnabled = '<input id="checkB" onclick="checkANForm()" value="' + LCheckButton + '" type="button" tabIndex="-1">';
	checkButtonDisabled = '<input id="checkB" onclick="checkANForm()" value="' + LCheckButton + '" type="button" tabIndex="-1" disabled>';
	document.getElementById("checkButton").innerHTML = checkButtonEnabled;
	document.getElementById("clearButton").innerHTML = '<input onclick="clearANForm()" value="' + LClearButton + '" type="button" tabIndex="-1">';
	document.getElementById("closeWindow").innerHTML = '<input onclick ="closeANWindow()" value="' + LCloseWindowButton + '" type="button" tabIndex="-1">';
	document.getElementById("helpButton").innerHTML = '<input onclick ="showANHelp()" value="' + LHelpButton + '" type="button" tabIndex="-1">';
	document.getElementById("tryAnotherButton").innerHTML = '<input id="tryAnotherB" onclick="newAN()" value="' + LTryAnotherNoun + '" type="button" tabIndex="-1">';
	document.getElementById("tryAnotherButton").className = "invisible";

	document.getElementById("ANSelect1").innerHTML = LANSelect1;
	document.getElementById("ANSelect2").innerHTML = LANSelect2;
	document.getElementById("ANSelect3").innerHTML = '&nbsp;<a href="javascript:void(0)" onclick="selectSingleAN()">' + LANSelect3 + '</a>&nbsp;';
	document.getElementById("ANSelect4").innerHTML = LANSelect4;
	
	// default values for form
	var i=0;
	var x=0;
	for (i=0; i<6; i++)
		for (x=0; x<2; x++)
			frm1[(i*2)+x].defaultValue = defaultANFormValues[i][x];
	for (i=6; i<12; i++)
		for (x=0; x<2; x++)
			frm1[(i*2)+x+1].defaultValue = defaultANFormValues[i][x];	
}

