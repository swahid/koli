var sourceMap = require('source-map');
var fs = require('fs');

var sourcemap = JSON.parse(fs.readFileSync('index.android.js.map', 'utf8'));

var smc = new sourceMap.SourceMapConsumer(sourcemap);

console.log(smc.originalPositionFor({
  line: 1520,
  column: 5064
}));