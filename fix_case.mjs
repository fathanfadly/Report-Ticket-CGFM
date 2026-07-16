import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
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

const files = walk('./app').concat(walk('./lib'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    content = content.replace(/Ticket_Activities/g, 'ticket_activities');
    content = content.replace(/Broadcasters_Info/g, 'broadcasters_info');
    content = content.replace(/Reporters_Info/g, 'reporters_info');
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
