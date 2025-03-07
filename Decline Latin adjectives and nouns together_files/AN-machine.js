
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ finds n in database of nouns

function findN(noun) {
	var i=0;
	var el;
	var c;
	var ahead = true;
	var ahead2 = true;
	
	do {
		i++;
		switch(i) {
			case 1:
				el = dBase1;
				break;
			case 2:
				el = dBase2;
				break;
			case 3:
				el = dBase3;
				break;
			case 4:
				el = dBase4;
				break;
			case 5:
				el = dBase5;
				break;
		} 
		
		c = 0;
		do {
			if (el[c][0] == noun) {
				ahead2 = false;
				ahead = false;
				} else {
				c++;
				}
			} while ((c< el.length) && (ahead2 == true));					
		if (i == 5) 
			ahead = false;
	} while (ahead == true);
	
	return el[c]; 
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ finds a in database of adjectives

function findA(adj) {
	
	var i=0;
	var el;
	var c;
	var ahead = true;
	var ahead2 = true;
	
	do {
		i++;
		switch(i) {
			case 1:
				el = dBaseAdj1;
				break;
			case 2:
				el = dBaseAdj2;
				break;
			case 3:
				el = dBaseAdj3;
				break;
			case 4:
				el = dBaseAdj4;
				break;
			case 5:
				el = dBaseAdj5;
				break;
			case 6:
				el = dBaseAdj6;
				break;
			case 7:
				el = dBaseAdj7;
				break;
		} 
		
		c = 0;
		do {
			if (el[c][0] == adj) {
				ahead2 = false;
				ahead = false;
				} else {
				c++;
				}
			} while ((c< el.length) && (ahead2 == true));					
		if (i == 7)
			ahead = false;
	} while (ahead == true);
	
	return el[c]; 
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ declines noun and adjective (uses the other -machine libraries)

function declineAN(couple, aFirst) {
	
	var adj = couple[0];
	var noun = couple[1];
	var trans = couple[2];
		
	var n = findN(noun);               // finds noun in database and declines it
	var nDeclined = []; 
	nDeclined = decline(n[0], n[1], n[2], n[3], n[4], n[5]);
	
	var a = findA(adj);	             // finds adjective in database and declines it
	var aDeclined = [];
		for(var i=0; i<21; i++)
			aDeclined[i] = ["", "", ""];
	aDeclined = declineAdj(a[0], a[1], a[2], a[3]); 
	
	currentGender = n[2]; 							// selects correct gender for adjective
	var aGender = [];
						
	switch (currentForm) {
		case "1":                               // 3-ending adj.
			if (currentGender == "m") {
				for (var i=0; i<21; i++)
					aGender[i] = aDeclined[i][0];
			}
			if (currentGender == "f") {
				for (var i=0; i<21; i++)
					aGender[i] = aDeclined[i][1];
			}
			if (currentGender == "n") {
				for (var i=0; i<21; i++)
					aGender[i] = aDeclined[i][2];
			}				
			break;
		case "2":                                // 2-ending adj.
			if ((currentGender == "m") || (currentGender == "f")) {
				for (var i=0; i<21; i++)
					aGender[i] = aDeclined[i][0];
			} else {
				for (var i=0; i<21; i++)
					aGender[i] = aDeclined[i][1];
			}
			break;
		case "3":                                // 1-ending adj.
			for (var i=0; i<21; i++)
				aGender[i] = aDeclined[i][0];
			if (currentGender == "n") {
				aGender[3] = aDeclined[3][1];
				aGender[6] = aDeclined[6][1];
				aGender[9] = aDeclined[9][1];
				aGender[10]= aDeclined[10][1];
			}
			break;
	}
	aGender[12] = aDeclined[12][0];
		
	var d = [];
	for (var i=0; i<21; i++)
		d[i] = ["", ""];
	
	if (aFirst == true) {
			for (var i=0; i<21; i++) {
				d[i][0] = aGender[i];
				d[i][1] = nDeclined[i];
				d[12][1] = nDeclined[12];
				d[12][0] = aDeclined[12][0];	
			}
		}	
		else {
			for (var i=0; i<21; i++) {
				d[i][1] = aGender[i];
				d[i][0] = nDeclined[i];
				d[12][0] = nDeclined[12];
				d[12][1] = aDeclined[12][0];	
			}
		}
		
	return d;
}