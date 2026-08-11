const https = require('https');
const key = require('fs').readFileSync('../secrets/.gemini-key', 'utf8').trim();
https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => console.log(d));
});
