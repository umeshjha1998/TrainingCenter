const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./src', function (filePath) {
    if (filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content.replace(/className="([^"]*material-icons[^"]*)"/g, (match, p1) => {
            if (!p1.includes('notranslate')) {
                return `className="${p1} notranslate" translate="no"`;
            }
            return match;
        });
        // also handle template literals className={`...`}
        newContent = newContent.replace(/className=\{`([^`]*material-icons[^`]*)`\}/g, (match, p1) => {
            if (!p1.includes('notranslate')) {
                return `className={\`${p1} notranslate\`} translate="no"`;
            }
            return match;
        });

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    }
});
