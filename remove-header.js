const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('page.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('src/app/admin');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import Header from \"@\/components\/admin\/Header\";\r?\n?/g, '');
  content = content.replace(/<Header \/>\r?\n?/g, '');
  // Because my layout is flex col, maybe I need to adjust padding in pages that had Header
  // The Header was inside the pages, so the pages had `<Header />` then `<div className="flex-1 ...">`
  fs.writeFileSync(file, content);
});
console.log('Removed Header from ' + files.length + ' files.');
