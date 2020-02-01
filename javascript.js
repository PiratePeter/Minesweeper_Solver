


function trySolving(){
	openRandom()
	solveAll();
};

function solveAll(){
	for(var i = 0; i < 20; i++){
		for(var y = 1; y <= 16; y++){
			for(var x = 1; x <= 30; x++){
				solveAdvanced(y,x);
			}
		}
	}
}

function copy2DimensionalArray(original){
	var clone = new Array(original.length);
	for (var i = 0; i < original.length; i++){
		clone[i] = original[i].slice(0);
	}
	return clone;
}

function addArrayToSum(sum, array) {
	for(var j = 0; j < sum.length; j++){
		for(var i = 0; i < sum[j].length; i++){
			sum[j][i]+=array[j][i];
		}
	}
}


function solveAdvanced(y,x) {
	if(isBlank(y,x)||isBomb(y,x)){
		return;
	}
	//console.log(y+"_"+x);
	var original = createArray(y,x);
	var numberOfMines = getCount(y,x)-checkMines(y,x);
	if(numberOfMines==0){
		openAll(y,x);
	}
	var list = createInitialList(numberOfMines, checkBlanks(y,x));
	var sum = [[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0]];
	var possibilityCounter = 0;
	while(list != null){
		var clone = copy2DimensionalArray(original);
		var index = 0;
		for(var j = 0; j < 3; j++){
			for(var i = 0; i < 3; i++){
				var field = clone[1+j][1+i];
				if(field==-1){
					clone[1+j][1+i] = list[index];
					index++					
				}
			}
		}
		var isPossible = checkPossibility(clone, y, x);
		//console.log(clone);
		//console.log(isPossible);
		if(isPossible){
			addArrayToSum(sum, clone);
			possibilityCounter++;
		}
		list = nextPermutation(numberOfMines,list);
	}
	//console.log(sum);
	//console.log(possibilityCounter);
	for(var j = 0; j < 3; j++){
		for(var i = 0; i < 3; i++){
			var field = sum[1+j][1+i];
			if(field==0){
				if(isBlank(y+j-1,x+i-1)){
					click(y+j-1,x+i-1,0);
				}
			} else if(field==possibilityCounter){
				if(isBlank(y+j-1,x+i-1)){
					click(y+j-1,x+i-1,2);
				}
			}
		}
	}
}

function checkPossibility(possibility, y, x) {
	if(!checkPossible(possibility, y, x, -1,-1)){
		return false;
	}
	if(!checkPossible(possibility, y, x, 0,-1)){
		return false;
	}
	if(!checkPossible(possibility, y, x, 1,-1)){
		return false;
	}
	if(!checkPossible(possibility, y, x, -1,0)){
		return false;
	}
	if(!checkPossible(possibility, y, x, 1,0)){
		return false;
	}
	if(!checkPossible(possibility, y, x, -1,1)){
		return false;
	}
	if(!checkPossible(possibility, y, x, 0,1)){
		return false;
	}
	if(!checkPossible(possibility, y, x, 1,1)){
		return false;
	} else {
		return true;
	}
}
	
function checkPossible(possibility, y, x, yRel, xRel) {
	if(isBlank(y+yRel,x+xRel)||isBomb(y+yRel,x+xRel)){
		return true;
	}
	var bombCounter = 0;
	var blankCounter = 0;
	var count = getCount(y+yRel,x+xRel);
	for(var j = 0; j < 3; j++){
		for(var i = 0; i < 3; i++){
			var fieldValue = possibility[1+yRel+j][1+xRel+i];
			if(fieldValue==1){
				bombCounter++;
			} else if(fieldValue==-1){
				blankCounter++;
			}
		}
	}
	if(count>bombCounter+blankCounter){
		return false;
	} else if(count<bombCounter){
		return false;
	}
	return true;
}

	


function createInitialList(numberOfMines,length) {
	var list = new Array(length);
	for(var i = 0; i < length; i++){
		if(i<numberOfMines){
			list[i] = 1;
		} else {
			list[i] = 0;
		}
	}
	return list;
}


function createArray(y,x) {
	var fields = [[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0]];
	for(var j = 0; j < 5; j++){
		for(var i = 0; i < 5; i++){
			fields[j][i] = getValue(y+j-2,x+i-2);
		}
	}
	return fields;
};	
	
function nextPermutation(number, newList){
	var row = 0;	
	for(var i = 0; i < newList.length; i++){
		if(newList[i] == 1){
			row++;
			if(row == number){
				if(i==newList.length-1){
					return null;
				}
			}
		} else {
			if(row > 0){
				for(var j = 0; j < i; j++){
					if(j<row-1){
						newList[j] = 1;
					} else {
						newList[j] = 0;
					}
				}
				newList[i] = 1;
				return newList;
			}
		}
		
	}
}


function getValue(y,x){
	if(isBlank(y,x)){
	return -1;
} else if(isBomb(y,x)){
	return 1;
} else {
	return 0;
}
};

function openRandom(){
	click(randint(16,1),randint(30,1),0);
};

function randint(max, min){
	return min+Math.floor(Math.random()*(max-min))
};

function getCount(y,x) {
	return parseInt(getClass(y,x).substring(11));
};

function openAll(y,x) {
	for(var j = y-1; j <= y+1; j++){
	for(var i = x-1; i <= x+1; i++){
	if(isBlank(j,i)){
	click(j,i,0);
}
}
}
};

function click(y,x, button) {
	if(isDisplayed(y,x)){
		document.getElementById(y+"_"+x).dispatchEvent(new MouseEvent("mousedown", {'view':window, 'bubbles':true, 'cancelable':true, 'button':button}));
		document.getElementById(y+"_"+x).dispatchEvent(new MouseEvent("mouseup", {'view':window, 'bubbles':true, 'cancelable':true, 'button':button}));
		if(isDeath(y,x)){
			console.log("I lost")
		}
	} else {
		console.log("I cant' click "+y+"_"+x)
	}
}

function isDisplayed(y,x) {
	var obj = document.getElementById(y+"_"+x);
return obj!=null&&"display: none;"!=obj.getAttribute("style");
};

function getClass(y,x) {
		return document.getElementById(y+"_"+x).getAttribute("class");
};

function isBomb(y,x) {
	return isDisplayed(y,x)&&"square bombflagged"==getClass(y,x);
};

function isBlank(y,x) {
	return isDisplayed(y,x)&&"square blank"==getClass(y,x);
};

function isDeath(y,x) {
	return "square bombdeath"==getClass(y,x);
};

function restart() {
	document.getElementById("face").dispatchEvent(new MouseEvent("mousedown", {'view':window, 'bubbles':true, 'cancelable':true, 'button':0}));
document.getElementById("face").dispatchEvent(new MouseEvent("mouseup", {'view':window, 'bubbles':true, 'cancelable':true, 'button':0}));
};

function checkBlanks(y,x) {
	var counter = 0;
if(isBlank(y-1,x-1)){
	counter++
}
if(isBlank(y-1,x)){
	counter++
}
if(isBlank(y-1,x+1)){
	counter++
}
if(isBlank(y,x-1)){
	counter++
}
if(isBlank(y,x+1)){
	counter++
}
if(isBlank(y+1,x-1)){
	counter++
}
if(isBlank(y+1,x)){
	counter++
}
if(isBlank(y+1,x+1)){
	counter++
}
return counter;
};

function checkMines(y,x) {
	var counter = 0;
if(isBomb(y-1,x-1)){
	counter++
}
if(isBomb(y-1,x)){
	counter++
}
if(isBomb(y-1,x+1)){
	counter++
}
if(isBomb(y,x-1)){
	counter++
}
if(isBomb(y,x+1)){
	counter++
}
if(isBomb(y+1,x-1)){
	counter++
}
if(isBomb(y+1,x)){
	counter++
}
if(isBomb(y+1,x+1)){
	counter++
}
return counter;
};

