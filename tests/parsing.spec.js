module.exports = function(path){
	let config = require(path);
	
	return {
		'parses string value or array to the key': () => {
			for (let target in config){
				let src = config[target];
				if (!isObject(src)) checkParsingTarget(src);
			}
		},
		
		'parses token of the object to the key': () => {
			for (let target in config){
				let src = config[target];
				if (isObject(src))  checkParsingTarget(src.token);
			}
		},
		
		'if "end" key exists, it must find the ending string for each token if it exists': () => {
			var text = read('result');
			
			for (let target in config){
				let src = config[target];
				
				if (isString(src)){
					text = parseString(text, src, target);
					continue;
				}
				if (isArray(src)){
					text = parseArray(text, src, target);
					continue;
				}
				
				if (!src.end) continue;
				
				if (isString(src.token)){
					src.token = [src.token];
				}
				
				if (!isArray(src.end)){
					src.end = [src.end];
				}
				let end;
				let endingFound = false;
				
				for (let i=0; i<src.token.length;){
					let token = src.token[i];
					let regexp = getParsingRegexp(token);
					// находим первое совпадение
					let match = regexp.exec(text);
					
					if (match) {
						// если end = null в массиве, то не используем поиск конца
						if (src.end[i] === null){
							endingFound = true;
							continue;
						}
						// для всех следующих токенов
						// используем последний end
						if (src.end[i] !== undefined) end = src.end[i];
						
						// смещаемся на длину токена
						let cutText = text.slice(match.index + token.length);
						let textStart = text.slice(0, match.index - 1);
						let textEnd = '';
						
						// ищем в оставшемся тексте конечную строку
						let endKeys = Object.keys(end);
						
						for (let j = 0; j < endKeys.length; j++){
							let key = endKeys[j];
							let keyRegexp = getParsingRegexp(key).exec(cutText);
							
							if (keyRegexp){
								textEnd = cutText.replace(keyRegexp, end[key]);
								endingFound = true;
								break;
							}
						}
						if (!endingFound) break;
						
						text = textStart + token + textEnd;
					}
					else{
						i++;
					}
				}
				
				if (!endingFound){
					write('result', text);
					throw Error('ending string has not found in config["'+target+'"]');
				}
			}
			
			write('result', text);
		},
	};
};
