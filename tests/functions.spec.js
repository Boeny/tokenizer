global.isString = function(s){
	return typeof s == 'string';
}
global.isObject = function(o){
	return o && typeof o == 'object' && !isArray(o);
}
global.isArray = function(arr){
	return arr instanceof Array;
}
global.inArray = function(e, arr){
	return arr.indexOf(e) > -1;
}

//------------------------------------------- CHECKING
global.checkString = function(str, target){
	if (!str) {
		throw Error('some element of config["'+target+'"] is empty');
	}
}
global.checkArrayOfStrings = function(arr, target){
	for (let i in arr){
		let str = arr[i];
		
		if (!isString(str)){
			throw Error('a type of the element in the config["'+target+'"] is '+typeof str);
		}
		checkString(str, target);
	}
}

global.checkObject = function(obj, target){
	for (let key in obj) {
		if (!isString(obj[key])){
			throw Error('value of some object in config["'+target+'"].end has not a string type');
		}
	}
}
global.checkArrayOfObjects = function(arr, target){
	for (let i in arr){
		let obj = arr[i];
		
		if (obj !== null && !isObject(obj)){
			throw Error('a type of the element in the config["'+target+'"] is '+typeof obj);
		}
		if (obj !== null) checkObject(obj, target);
	}
}

//------------------------------------------- FS
let fs = require('fs');

global.checkFile = (file) => './'+file+(file.indexOf('.') == -1 ? '.js' : '');

global.read = function(file){
	return fs.readFileSync(checkFile(file), 'utf-8').replace(/\r/g,'');
};
global.write = function(file, data){
	return fs.writeFileSync(checkFile(file), data, 'utf-8');
};
global.forEachRow = function(content, callback){
	content = content.split('\n');
	
	for (var i = 0; i < content.length; i++){
		content[i] = callback(content[i], i);
	}
	
	return content.join('\n');
};

//------------------------------------------- PARSING
global.prepareParsingString = function(s){
	return s.replace(/[.]/g,'\\.')
		.replace(/\(/g,'\\(')
		.replace(/\)/g,'\\)')
		.replace(/\s/g,'\\s')
		.replace(/\n/g,'\\n')
		.replace(/\-/g,'\\-');
}
global.getParsingRegexp = function(s, mode){
	return new RegExp( prepareParsingString(s), mode );
};

global.checkParsing = function(text, src, target){
	let matches = text.match(getParsingRegexp(src, 'g'));
	if (!matches) return;
	
	for (let i in matches){
		if (matches[i] !== src)
			throw Error('src "'+src+'" mismatches to "'+matches[i]+'" in config["'+target+'"]');
	}
};
global.checkParsingTarget = function(text, src, target){
	if (isString(src)){
		src = [src];
	}
	
	for (let i in src){
		checkParsing(text, src[i], target);
	}
};

global.parseString = function(text, src, target){
	let regexp = getParsingRegexp(src, 'g');
	let matches = text.match(regexp);
	return matches ? text.replace(regexp, target) : text;
};
global.parseArray = function(text, src, target){
	for (var i = 0; i < src.length; i++){
		text = parseString(text, src[i], target);
	}
	return text;
};
