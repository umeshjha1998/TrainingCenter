const fs = require('fs');
const path = require('path');

function replaceAll(dir) {
    fs.readdirSync(dir).forEach(f => {
        let p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) replaceAll(p);
        else if (p.endsWith('.jsx')) {
            let content = fs.readFileSync(p, 'utf8');
            let newContent = content
                .replace(/import\s*\{\s*Link\s*\}\s*from\s*['"]react-router-dom['"];?/g, 'import Link from "next/link";')
                .replace(/<Link([^>]*?)to=/g, '<Link$1href=');

            if (content !== newContent) {
                fs.writeFileSync(p, newContent);
                console.log("Updated", p);
            }
        }
    });
}
replaceAll('src');

// Also fix app/page.jsx
const rootPagePath = 'src/app/page.jsx';
let rootPage = fs.readFileSync(rootPagePath, 'utf8');
rootPage = rootPage.replace('../src/pages/Home', '../pages/Home');
fs.writeFileSync(rootPagePath, rootPage);
console.log("Fixed src/app/page.jsx");
