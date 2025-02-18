// +++++++++++++++++++++++++++++++++++++++++++++++++++  GLOBAL VARIABLES 

r = new Array(); 
irrForms = new Array();
totMistakes = 0;
currentDeclension = 0;
lastRandomNumbers = new Array(10);
lastRNIndex = 0;
audioAvailable = false;
var checkButtonDisabled = "";
var checkButtonEnabled = "";

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

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ manage default values in input forms

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
// ++++++++++++++++++++++++++++++++++++++++++++++++ opens help window

function showHelp(){

	var stili = "";	
	var popUpHelp = window.open("nouns-help.html", "", stili);
}

// ++++++++++++++++++++++++++++++++++++++++++++++++ converts to lowcase and deletes spaces

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

// ++++++++++++++++++++++++++++++++++++++++++++++++ extracts noun to decline from open window parameters (if any)

function extractDeclensionParameter() {                                       
                                                                    // default declination is the first part of the first parameter
																							// other parameters are ignored
   var s;
                                                                                   
	if (location.search.substring(1).length > 0) {   
   	var par = location.search.substring(1);
   	var pars = new Array();
   	pars=par.split("&");                                                // split parameter string into an array of single parameters
   	s = pars[0].substr(pars[0].indexOf("=")+1);                     // s contains the default declination
   } else {
   	s = "0";
   }
   currentDeclension = s;
   return s;
}

// ++++++++++++++++++++++++++++++++++++++++++++ checks for mistakes

function checkForm(){

    totMistakes = 0;                                                       // global var counting mistakes
    var good;    
    var maxL = 18;  																		//max length for tect entry
    
    for (var i=0; i<5; i++){
        
        good = trimAndLower(r[i]);                                                                  // left column, singular
        if(!frm1[i*2].disabled) {
            if (trimAndLower(frm1[i*2].value) == good) {
                frm1[i*2].className = "rightColor";
            }
            else {
                totMistakes ++;
                frm1[i*2].className = "wrongColor";
                if ((frm1[i*2].value == "") || (frm1[i*2].value == defaultNFormValues[i])) {
                    frm1[i*2].value = good;
                }
                else {
                	var s = "[" + frm1[i*2].value + "] " + good;
                	if (s.length > maxL)
                		s = "[..." + s.substring(s.length-maxL-1, s.length);
                  frm1[i*2].value = s;
                }
            }
        }
            
        good = trimAndLower(r[i+6]);                                                           // right column, plural
        if (!frm1[(i*2)+1].disabled) {
            if (trimAndLower(frm1[(i*2)+1].value) == good) {
                frm1[(i*2)+1].className = "rightColor";
            }
            else {
                totMistakes ++;
                frm1[(i*2)+1].className = "wrongColor";
                if ((frm1[(i*2)+1].value == "") || (frm1[(i*2)+1].value == defaultNFormValues[i+6])) {
                    frm1[(i*2)+1].value = good;
                }
                else {
                	var s = "[" + frm1[i*2+1].value + "] " + good;
                	if (s.length > maxL)
                		s = "[..." + s.substring(s.length-maxL-1, s.length);
                  frm1[(i*2)+1].value = s;
                }
            }
        }

    }
   
    askForNewNoun();
    
  	if (audioAvailable)
		document.getElementById("audioButton").innerHTML = "<input onclick='audioPlay()' value='" + LAudioButton + "' type='button' tabIndex='-1'>";
	else
		document.getElementById("audioButton").innerHTML = "";



}


// ++++++++++++++++++++++++++++++++++++++++++++ resets form

function clearForm() {

	for (var i=0; i<5; i++) {
		//------------------------------------------------left column		
		if (frm1[i*2].disabled != true) {
			if (irrForms[i] != "") {
            frm1[i*2].value = irrForms[i];
      	} else {
      		frm1[i*2].value = defaultNFormValues[i];
      		frm1[i*2].className = "lightGray";
      	}
      }
		//------------------------------------------------right column 
		if (frm1[(i*2)+1].disabled != true) {
			if (irrForms[i+6] != "") {
            frm1[(i*2)+1].value = irrForms[i+6];
      	} else {
      		frm1[(i*2)+1].value = defaultNFormValues[i+6];
      		frm1[(i*2)+1].className = "lightGray";
      	}
      }
	}
}


// ++++++++++++++++++++++++++++++++++++++++++++ closes and goes back to previous window

function closeWindow()  {
	history.go(-1);
//	window.open('', '_self', ''); //bug fix
//	window.close();

}

// +++++++++++++++++++++++++++++++++++++++++++++++++ clears array of stored random numbers

function clearRandomNumbers() {
	
	for (var i=0; i<10; i++)	
		lastRandomNumbers[i] = 999;
	lastRNIndex = 0;
	
}

// +++++++++++++++++++++++++++++++++++++++++++++++++ adds n to array of stored random numbers

function saveRandomNumber(n) {
	
	lastRandomNumbers[lastRNIndex] = n;
	lastRNIndex ++;
	if (lastRNIndex == 10)
		lastRNIndex = 0;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++ checks if n is already stored (avoid repetitions in 10 tests)

function inRandomNumbers(n) {
	var c = 0;	
	for (var i=0; i<= lastRNIndex; i++)
		if (lastRandomNumbers[i] == n)
			c ++;
	return (c > 0);
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++ returns a random number between 0 and n

function getRandom(n) {
	var rndm; 
	do {
		rndm = Math.floor(Math.random()*(n));
	}
	while (inRandomNumbers(rndm));
	saveRandomNumber(rndm);
	return rndm; 
}


// +++++++++++++++++++++++++++++++++++++++++++++++++ selects a noun to decline. If decl = 0 can be from all 5 decl.

function selectNoun(decl) {
  
  	 var noun;
    
    var l1 = dBase1.length;
    var l2 = dBase2.length;
    var l3 = dBase3.length;
    var l4 = dBase4.length;
    var l5 = dBase5.length;
        
    var start2 = l1; 
    var start3 = l1+l2;
    var start4 = l1+l2+l3;
    var start5 = l1+l2+l3+l4;
    var lTot = l1 + l2 + l3 + l4 + l5;
    
    var rndm;
    
	console.log(rndm);

    do {     
    	switch (decl) {
        case "0":
				rndm = getRandom (lTot);
            if (rndm >= start5) noun = dBase5[rndm-start5];
                else if (rndm >= start4) noun = dBase4[rndm-start4];
                    else if (rndm >= start3) noun = dBase3[rndm-start3];
                        else if (rndm >= start2) noun = dBase2[rndm-start2];
                            else noun = dBase1[rndm];
            break;
        case "1":
            rndm = getRandom (l1);
            noun = dBase1[rndm];
            break;
        case "2":
            rndm = getRandom(l2);
            noun = dBase2[rndm];
            break;
        case "3":
            rndm = getRandom(l3);
            noun = dBase3[rndm];
            break;
        case "4":
            rndm = getRandom(l4);
            noun = dBase4[rndm];
            break;
        case "5":
            rndm = getRandom(l5);
            noun = dBase5[rndm];
            break;
    	}
    } while(parseInt(noun[6]) > 1);   // use small vocabulary
    
    audioAvailable = (noun[7] == "s");

	console.log(noun);

    return noun; 
}

// ++++++++++++++++++++++++++++++++++++++++++++ write page's headers


function writePageHeaders() {    
    var nd;
    switch(r[15].charAt(0)) {
        case "1":
            nd = LFirst;
            break;
        case "2":
            nd = LSecond;
            break;
        case "3":
            nd = LThird;
            break;
        case "4":
            nd = LFourth;
            break;
        case "5":
            nd = LFifth;
            break;
    }
    document.getElementById("header1").innerHTML = nd + " " + LDeclension + ":";
    document.getElementById("header3").innerHTML = "<i>" + r[12] + "</i>, " + r[14] + ".  (" + unescape(r[20]) + ")";
}

// ++++++++++++++++++++++++++++++++++++++++++++ disables entry for not used cases

function checkNotUsedCases() {	

	for (var i=0; i<5; i++) {
		//------------------------------------------------left column		
		frm1[i*2].className = "normColor";
   	if (r[i] == "") {                          // disables input if case is not used
      	frm1[i*2].disabled = true;
      	frm1[i*2].className = "lightGray";
         frm1[i*2].value = "(not used)";
      }
      else {
      	frm1[i*2].disabled = false;
      	frm1[i*2].value = defaultNFormValues[i];
      }
      if (irrForms[i] != "")                  // suggests irregular forms
			frm1[i*2].value = irrForms[i];  
 		
 		//------------------------------------------------right column 
      frm1[(i*2)+1].className = "normColor";
   	if (r[i+6] == "") {                         // disables input if case is not used
         frm1[(i*2)+1].disabled = true;
         frm1[(i*2)+1].className = "lightGray";
         frm1[(i*2)+1].value = "(not used)";
      }
      else {
      	frm1[(i*2)+1].disabled = false;
      	frm1[(i*2)+1].value = defaultNFormValues[i+6];
      }
		if (irrForms[i+6] != "")                  // suggests irregular forms
			frm1[(i*2)+1].value = irrForms[i+6];  

   }
}


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ preSelect(n)

function preSelect(itemToSelect) {
    
    // Loop through all the items
    var el = selectForm.scopeSelection.options;
    for (var iLoop = 0; iLoop< el.length; iLoop++)
    {    
      if (el[iLoop].value == itemToSelect)
      {
        // Item is found. Set its selected property, and exit the loop
        el[iLoop].selected = true;
        break;
      }
    }
}	

// ++++++++++++++++++++++++++++++++++++++++++++ new noun to decline

function newNoun() {
	var n = selectNoun(currentDeclension);
	r = decline(n[0], n[1], n[2], n[3], n[4], n[5]);
	checkNotUsedCases();
	writePageHeaders();	
	clearForm();

	document.getElementById("clearButton").className = "visible";
	document.getElementById("tryAnotherButton").className = "invisible";
	document.getElementById("checkButton").innerHTML = checkButtonEnabled;
	document.getElementById("audioButton").innerHTML = "";
	document.getElementById("extraButton").innerHTML = "";	
	
}

// ++++++++++++++++++++++++++++++++++++++++++++ changes the "clear form" button to "try a new noun" button

function askForNewNoun() {
	document.getElementById("clearButton").className = "invisible";
	document.getElementById("tryAnotherButton").className = "visible";
	document.getElementById("checkButton").innerHTML = checkButtonDisabled;
	document.getElementById("audioButton").innerHTML = ""; 	
	if ((r[16] != "") || (r[17] != "") || (r[18] != "") || (r[19] != "")) 
		document.getElementById("extraButton").innerHTML = extraInfoButton;
	else 
		document.getElementById("extraButton").innerHTML = "";	
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ selectScope()

function selectScope() {
	var newDecl = "";
		
	for (var i=0; i<5; i++) {
		if(selectForm.scopeSelection.options[i].selected)
			newDecl = i.toString();
	}
		
	if (newDecl != currentDeclension) {
		
		clearRandomNumbers();
		var n = selectNoun(newDecl);
		r = decline(n[0], n[1], n[2], n[3], n[4], n[5]);
		checkNotUsedCases(); 
   	clearForm(); 
		writePageHeaders();  
		currentDeclension = newDecl.toString(); 
		askForNewNoun(); 
		newNoun();
	}
}

// ++++++++++++++++++++++++++++++++++++++++++++ select a single noun to decline within currentDeclension

function selectSingleNoun() {
	
	if (currentDeclension == 0) {	
		alert(LAlertSelectNoun);
	} else {
		hiddenSelection.hiddenInput.value = "n" + currentDeclension;
		selectPopUp = window.open("selectPage.html", "", "");
	}
	
}

function activatePopUpSelection() {
	
	selectPopUp.close();
	
	var n = hiddenSelection.hiddenInput.value;
	var nName = [];
	nName = n.split("|");
	nName.pop();
	
	audioAvailable = (nName[7] == "s");
	
	r = decline(nName[0], nName[1], nName[2], nName[3], nName[4], nName[5]);
  	checkNotUsedCases();
  	clearForm();
	writePageHeaders();

	document.getElementById("clearButton").className = "visible";
	document.getElementById("checkButton").innerHTML = checkButtonEnabled;
	
}

// ++++++++++++++++++++++++++++++++++++++++++++ display extra info on noun

function extraInfo() {
	var b = "";
	var t = "";
	document.getElementById("footer").className = "invisible";
	document.getElementById("extraInfo").className = "visible";
	
	t = "<br /> <br /> Informazioni aggiuntive su <i>" + r[12] + "</i>: <br /> <br />"
	for (var i=16; i<=19; i++)
		if (r[i] != "")
			t = t + r[i] + "<br />";
	t = t + "<br />";
	b = "<input onclick='hideExtraInfo()' value='" + LStopAudio + "' type='button'>";
	
	document.getElementById("extraInfo").innerHTML = t + b;
}

function hideExtraInfo() {
	document.getElementById("footer").className = "visible";
	document.getElementById("extraInfo").className = "invisible";
	
}

// ++++++++++++++++++++++++++++++++++++++++++++ audio play

function audioPlay() {
	
var b = "";
	var t = "";
	var n1 = '"../audio/nouns/' + r[0] + '.mp3" ';
	var n2 = '"../audio/nouns/' + r[0] + '.ogg" ';
	
	document.getElementById("footer").className = "invisible";
	document.getElementById("audioPlay").className = "visible";

	t = '<br /><br />';
	t = t + '<audio controls="controls" height="50px" width="100px">';
	t = t + '<source src=' + n1 + ' type="audio/mpeg" />';
	t = t + '<source src=' + n2 + ' type="audio/ogg" />';
	t = t + '<embed height="50px" width="100px" src=' + n1 + ' />';
	t = t + '</audio>';
	t = t + '<br /><br />';

	b = "<input onclick='hideAudioPlay()' value='" + LStopAudio + "' type='button'>";
	
	document.getElementById("audioPlay").innerHTML = t + b;
	
}

function hideAudioPlay() {
	document.getElementById("footer").className = "visible";
	document.getElementById("audioPlay").className = "invisible";
	
}
// ++++++++++++++++++++++++++++++++++++++++++++ initialize page

function initializePage() {

	clearRandomNumbers();
	var temp;    
   var s = extractDeclensionParameter();    
   var n = selectNoun(s);

	audioAvailable = (n[7] == "s");
			  
   currentDeclension = s;   
   preSelect(s);
   r = decline(n[0], n[1], n[2], n[3], n[4], n[5]);
   checkNotUsedCases();
	clearForm();
	writePageHeaders();	
	
	//if (window.opener == undefined) document.getElementById("closeWindow").className="invisible";
		
	document.getElementById("extraInfo").className = "invisible";
	hideAudioPlay();
	
	// language-dependent HTML
	document.getElementById("headerSingular").innerHTML = LSingularUp;
	document.getElementById("headerPlural").innerHTML = LPluralUp;
	checkButtonEnabled = '<input id="checkB" onclick="checkForm()" value="' + LCheckButton + '" type="button" tabIndex="-1">';
	checkButtonDisabled = '<input id="checkB" onclick="checkForm()" value="' + LCheckButton + '" type="button" tabIndex="-1" disabled>';
	console.log(checkButtonDisabled);
	document.getElementById("checkButton").innerHTML = checkButtonEnabled;
	document.getElementById("clearButton").innerHTML = '<input onclick="clearForm()" value="' + LClearButton + '" type="button" tabIndex="-1">';
	document.getElementById("closeWindow").innerHTML = '<input onclick ="closeWindow()" value="' + LCloseWindowButton + '" type="button" tabIndex="-1">';
	document.getElementById("helpButton").innerHTML = '<input onclick ="showHelp()" value="' + LHelpButton + '" type="button" tabIndex="-1">';
	document.getElementById("declSelection1").innerHTML = LDeclSelection1 + "&nbsp;";
	document.getElementById("declSelection2").innerHTML = LDeclSelection2;
	document.getElementById("nounSelection1").innerHTML = LNounSelection1;
	document.getElementById("nounSelection2").innerHTML = '<a href="javascript:void(0)" onclick="selectSingleNoun()" tabIndex="-1">&nbsp;' + LNounSelection2 + '</a>&nbsp;';
	document.getElementById("nounSelection3").innerHTML = LNounSelection3;
	document.getElementById("tryAnotherButton").innerHTML = '<input id="tryAnotherB" onclick="newNoun()" value="' + LTryAnotherNoun + '" type="button" tabIndex="-1">';
	document.getElementById("tryAnotherButton").className = "invisible";
	extraInfoButton = "<input onclick='extraInfo()' value='" + LExtraInfo + "' type='button' tabIndex='-1'>";
	

	for (var i=0; i<5; i++) {                            // default values for table
		frm1[i*2].defaultValue = defaultNFormValues[i];
		frm1[i*2+1].defaultValue = defaultNFormValues[i+6];
	}
	
}


