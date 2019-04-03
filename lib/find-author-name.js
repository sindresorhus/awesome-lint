'use strict';

const fs = require('fs');
const path = require('path');
const parse = require('parse-github-url');

module.exports = ({repoURL, dirname}) => {
    if (repoURL) {
        return parse(repoURL).owner;
    }

    const pkgJsonFile = path.resolve(dirname, 'package.json');
    if (fs.existsSync(pkgJsonFile)) {
        const json = require(pkgJsonFile);
        if (json && json.repository) {
            return json.repository.split('/')[0];
        }
    }
};
