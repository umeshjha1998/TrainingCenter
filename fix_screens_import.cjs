const fs = require('fs');
const path = require('path');

function replaceAll(dir) {
    fs.readdirSync(dir).forEach(f => {
        let p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) replaceAll(p);
        else if (p.endsWith('.jsx')) {
            let content = fs.readFileSync(p, 'utf8');
            let newContent = content.replace(/import\s+(.*?)\s+from\s+['"](.*)pages\/(.*)['"]/g, 'import $1 from "$2screens/$3"');

            if (content !== newContent) {
                fs.writeFileSync(p, newContent);
                console.log("Updated", p);
            }
        }
    });
}
replaceAll('src/app');
