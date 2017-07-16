const TEST_ROOT = './tests';
require(TEST_ROOT+'functions.spec');
const config = require (TEST_ROOT+'config.spec');
const parseBy = require(TEST_ROOT+'parsing.spec');

write('result', read('test.txt'));

require('./tester')({
	'main config:': config('./config'),
	'user config:': config('./params'),
	'parse with user config:': parseBy('./params'),
	'parse with main config:': parseBy('./config'),
});