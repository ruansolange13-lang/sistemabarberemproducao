const fs = require('fs');

const js = fs.readFileSync('bundle.js', 'utf8');

// Find all URLs
const urls = [...new Set(js.match(/https?:\/\/[^"'\s`<>]+/g) || [])];
console.log('=== ASSET & EXTERNAL URLS ===');
urls.filter(u => !u.includes('w3.org') && !u.includes('reactjs.org') && !u.includes('babel')).forEach(u => console.log(u));

// Look for component names or Portuguese text sections
console.log('\n=== SAMPLE TEXT BLOCKS ===');
const ptSnippets = js.match(/"[^"]*(?:autoescola|cnh|habilitaç|direção|categoria|veículo|matrícula|parcela|instrutor|detran|cfc|whatsapp)[^"]*"/gi) || [];
console.log('Found snippets count:', ptSnippets.length);
ptSnippets.slice(0, 30).forEach(s => console.log(s));
