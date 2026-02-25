import {remark} from 'remark';
import remarkParse from 'remark-parse';
import fs from 'node:fs';

const file = process.argv[2];
const md = fs.readFileSync(file, 'utf8');
const ast = remark().use(remarkParse).parse(md);
console.log(ast.children.map(n => n.type));
console.log(JSON.stringify(ast.children[0], null, 2));
