const fs = require('fs');
const icon192 = "PASTE_BASE64_HERE";
const icon512 = "PASTE_BASE64_HERE";
fs.writeFileSync('public/icon-192.png', Buffer.from(icon192, 'base64'));
fs.writeFileSync('public/icon-512.png', Buffer.from(icon512, 'base64'));
console.log('Icons written:', fs.statSync('public/icon-192.png').size, fs.statSync('public/icon-512.png').size, 'bytes');
