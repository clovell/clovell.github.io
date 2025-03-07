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
	//document.getElementById("clearButton").className = "invisible";
	//document.getElementById("tryAnotherButton").className = "visible";
	document.getElementById("checkButton").innerHTML = checkButtonDisabled;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ resets form

function clearANForm() {
	
	for (var i=0; i<15; i++){                                // 2 endings, singular
		frm1[i].value = frm1[i].defaultValue;
		frm1[i].className = "lightGray";
	}
	document.getElementById("checkButton").innerHTML = checkButtonEnabled;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ shows help page

function showANHelp() {
	var stili = ""
	var popUpHelp = window.open("nouns-help.html", "", stili);
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ close  pageAN

function closeANWindow() {
	history.go(-1);
	//window.open('', '_self', ''); //bug fix
	//window.close();
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ checkIlle

function checkIlle() {
	
	var v = "";

	for (var i=0; i<15; i++) {
	    if (trimAndLower(frm1[i].value) == trimAndLower(dBaseIlle[i])) {
			frm1[i].className = "rightColor"; //input was correct
		} else {
			if (frm1[i].value == frm1[i].defaultValue) {
				v = dBaseIlle[i];
			} else {
				v = frm1[i].value;
				v = "[" + v + "] " + dBaseIlle[i]; 
			}
			frm1[i].value = v;
			frm1[i].className = "wrongColor";
			totANMistakes ++;
		}
	}
	askForNewAN();
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ initialize pageAN

function initializePageAN() {
	/*
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
	*/
	// language-dependent HTML
	document.getElementById("frm1TitleS").innerHTML = LSingularUp;	
	//document.getElementById("frm1TitleP").innerHTML = LPluralUp;	
	//document.getElementById("frm1bp").innerHTML = LShowPlural;
	//document.getElementById("frm1bs").innerHTML = LShowSingular;	
	checkButtonEnabled = '<input id="checkB" onclick="checkIlle()" value="' + LCheckButton + '" type="button" tabIndex="-1">';
	checkButtonDisabled = '<input id="checkB" onclick="checkIlle()" value="' + LCheckButton + '" type="button" tabIndex="-1" disabled>';
	document.getElementById("checkButton").innerHTML = checkButtonEnabled;
	document.getElementById("clearButton").innerHTML = '<input onclick="clearANForm()" value="' + LClearButton + '" type="button" tabIndex="-1">';
	document.getElementById("closeWindow").innerHTML = '<input onclick ="closeANWindow()" value="' + LCloseWindowButton + '" type="button" tabIndex="-1">';
	document.getElementById("helpButton").innerHTML = '<input onclick ="showANHelp()" value="' + LHelpButton + '" type="button" tabIndex="-1">';
	//document.getElementById("tryAnotherButton").innerHTML = '<input id="tryAnotherB" onclick="newAN()" value="' + LTryAnotherNoun + '" type="button" tabIndex="-1">';
	//document.getElementById("tryAnotherButton").className = "invisible";

	//document.getElementById("ANSelect1").innerHTML = LANSelect1;
	//document.getElementById("ANSelect2").innerHTML = LANSelect2;
	//document.getElementById("ANSelect3").innerHTML = '&nbsp;<a href="javascript:void(0)" onclick="selectSingleAN()">' + LANSelect3 + '</a>&nbsp;';
	//document.getElementById("ANSelect4").innerHTML = LANSelect4;
	
	// default values for form
	//var i=0;
	//var x=0;
	//for (i=0; i<6; i++)
	//	for (x=0; x<2; x++)
	//		frm1[(i*2)+x].defaultValue = defaultANFormValues[i][x];
	//for (i=6; i<12; i++)
	//	for (x=0; x<2; x++)
	//		frm1[(i*2)+x+1].defaultValue = defaultANFormValues[i][x];	
}