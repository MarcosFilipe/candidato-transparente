const fs = require('fs');
const Papa = require('papaparse');
const csv = fs.readFileSync('public/data/2024/bens/bem_candidato_2024_SC.csv','latin1');
const res = Papa.parse(csv, {
  header: true,
  delimiter: ';',
  quoteChar: '"',
  skipEmptyLines: true,
  transformHeader: (h) => h.trim().replace(/^"|"$/g, ''),
});
console.log('rows', res.data.length, 'errors', res.errors.length);
console.log('headers', Object.keys(res.data[0]).slice(0, 12));
console.log(res.data[0]);
