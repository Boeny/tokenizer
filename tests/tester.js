var assert = require('chai').assert;

function run_test(text, callback){
	it(text, function(){
		let res = callback(assert);
		if (res === undefined) return;
		
		if (res instanceof Array){
			assert[res[0] && typeof res[0] == 'object' ? 'deepEqual' : 'equal'](res[0], res[1], res[2]);
			return;
		}
		
		assert.isTrue(res);
	});
}

function test(tests){
	for (let title in tests){
		describe(title, function(){
			let subtests = tests[title];
			
			for (let text in subtests){
				run_test(text, subtests[text]);
			}
		});
	}
};

function obj_val(o){
	return o[Object.keys(o)[0]];
}

module.exports = function(modules){
	if (typeof obj_val(obj_val(modules)) == 'function'){// tests -> subtests -> function
		test(modules);
		return;
	}
	
	for (let name in modules){
		describe(name, ()=>{
			test(modules[name]);
		});
	}
};