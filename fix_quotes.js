const fs = require('fs');
const path = require('path');

function fix(dir) {
    fs.readdirSync(dir).forEach(f => {
        let p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) fix(p);
        else if (p.endsWith('.jsx')) {
            let content = fs.readFileSync(p, 'utf8');
            let fixed = content.split('\\"').join('"');
            if (content !== fixed) fs.writeFileSync(p, fixed);
        }
    });
}
fix('src/app');
