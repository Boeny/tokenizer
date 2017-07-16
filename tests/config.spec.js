module.exports = function(path){
	let config = require(path);
	
	return {
		'must be an object': () => isObject(config),
		
		'values could be either fullfilled string or an object or an array of fullfilled strings': () => {
			for (let target in config){
				let src = config[target];
				
				if (!src){
					throw Error('config["'+target+'"] is empty');
				}
				if (!inArray(typeof src, ['string','object'])){
					throw Error('type of config["'+target+'"] is '+typeof src);
				}
				if (isString(src)) checkString(src, target);
				if (isArray(src)) checkArrayOfStrings(src, target);
			}
		},
		
		'if value is object, it must contain a fullfilled token': () => {
			for (let target in config){
				let src = config[target];
				if (isObject(src) && !src.token) throw Error('token has not found');
			}
		},
		
		'token could be a fullfilled string or an array of fullfilled strings': () => {
			for (let target in config){
				let src = config[target];
				if (!isObject(src)) continue;
				
				let t = src.token;
				
				if (!isString(t) && !isArray(t)){
					throw Error('a type of the token in the config["'+target+'"] is '+typeof t);
				}
				if (isString(t)) checkString(t, target);
				if (isArray(t)) checkArrayOfStrings(t, target);
			}
		},
		
		'if "end" key exists, it could be an object or array of an objects (including "null"), which type of the values must be a string': () => {
			for (let target in config){
				let src = config[target];
				if (!isObject(src) || !src.end) continue;
				
				let end = src.end;
				
				if (typeof end !== 'object'){
					throw Error('a type of the end key in the config["'+target+'"] is '+typeof end);
				}
				if (isArray(end))
					checkArrayOfObjects(end, target);
				else
					checkObject(end, target);
			}
		}
	};
};
