var sourceMap = require('source-map');
var fs = require('fs');

var sourcemap = JSON.parse(fs.readFileSync('source.map', 'utf8'));

var smc = new sourceMap.SourceMapConsumer(sourcemap);

console.log(smc.originalPositionFor({
  line: 801,
  column: 25109
}));