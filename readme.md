<h1 align="center">
	<br>
	<img width="400" src="https://cdn.rawgit.com/sindresorhus/awesome-lint/master/media/logo.svg" alt="awesome-lint">
	<br>
	<br>
	<br>
</h1>

> Linter for [Awesome](https://awesome.re) lists

[![Build Status](https://travis-ci.org/sindresorhus/awesome-lint.svg?branch=master)](https://travis-ci.org/sindresorhus/awesome-lint) [![Gitter](https://badges.gitter.im/join_chat.svg)](https://gitter.im/sindresorhus/awesome)

Intended to make it easier to create and maintain Awesome lists.

Includes a bunch of [general Markdown rules](https://github.com/sindresorhus/awesome-lint/blob/master/config.js) and some [Awesome specific rules](https://github.com/sindresorhus/awesome-lint/tree/master/rules).

![](screenshot.png)

[example.com](http://example.com/)


## CLI

### Install

```
$ npm install --global awesome-lint
```

### Usage

```
❯ awesome-lint

  readme.md:1:1
  ✖    1:1  Missing Awesome badge after the main heading      awesome-badge
  ✖   12:1  Marker style should be -                          unordered-list-marker-style
  ✖  199:3  Remove trailing slash (https://sindresorhus.com)  trailing-slash

  3 errors
```

### Tip

Add it as a `test` script in package.json and activate Travis CI to lint on new commits and pull requests.

###### package.json

```json
{
  "scripts": {
    "test": "awesome-lint"
  },
  "devDependencies": {
    "awesome-lint": "*"
  }
}
```

###### .travis.yml

```
language: node_js
node_js:
  - 'node'
```


## API

### Install

```
$ npm install --save awesome-lint
```

### Usage

```js
const awesomeLint = require('awesome-lint');

awesomeLint.report();
```

### Docs

#### awesomeLint()

Returns a `Promise` for a [`VFile`](https://github.com/wooorm/vfile).

#### awesomeLint.report()

Show the lint output.


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
