import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');
let changedFiles = 0;

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('(() => {})(')) {
        const newContent = content.replace(/\(\(\) => \{\}\)\(/g, 'console.log(');
        fs.writeFileSync(file, newContent, 'utf8');
        changedFiles++;
    }
});

console.log(`Updated ${changedFiles} files.`);
