'use strict';
const fs = require('fs');
const path = require('path');
const globby = require('globby');
const find = require('unist-util-find');
const rule = require('unified-lint-rule');
const remark = require('remark');
const findAuthorName = require('../lib/find-author-name');

const authorName = 'sindresorhus';
const authorEmail = 'sindresorhus@gmail.com';

module.exports = rule('remark-lint:awesome/code-of-conduct', (ast, file) => {
    const {dirname} = file;
    const cocFile = globby.sync(['{.github/,}{code-of-conduct,code_of_conduct}.md'], {nocase: true, cwd: dirname})[0];

    if (!cocFile) {
        return;
    }

    const cocPath = path.resolve(dirname, cocFile);
    const cocContent = fs.readFileSync(cocPath, 'utf8').trim();

    if (!cocContent) {
        file.message('code-of-conduct.md file must not be empty');
        return;
    }

    // parse code-of-conduct.md to get the real ast
    ast = remark().parse(cocContent);

    const placeholder = find(ast, node => (
        node.type === 'linkReference' &&
        node.label === 'INSERT EMAIL ADDRESS')
    );
    if (placeholder) {
        file.message('Email placeholder must be replaced with yours', placeholder);
        return;
    }

    if (findAuthorName(file) !== authorName) {
        const email = find(ast, node => {
            console.log(node.type, node.value);
            return (
            node.type === 'text' &&
            node.value.indexOf(authorEmail) >= 0
        )
        });
        if (email) {
            file.message('Default email must be replaced with yours', email);
        }
    }
});
