<h1 align="center">
	<br>
	<img width="400" src="https://cdn.rawgit.com/sindresorhus/awesome-lint/master/media/logo.svg" alt="awesome-lint">
	<br>
	<br>
	<br>
</h1>

> Linter for [Awesome](https://awesome.re) lists

[![Build Status](https://travis-ci.org/sindresorhus/awesome-lint.svg?branch=master)](https://travis-ci.org/sindresorhus/awesome-lint)


## CLI

### Install

```
$ npm install --global awesome-lint
```

### Usage

```
$ awesome-lint

   1:1-1:18       error    Missing Awesome badge after the main heading              awesome-badge
  7:1-7:161       error    Don’t use emphasis to introduce a section, use a heading  no-emphasis-as-heading
  475:82-475:105  error    Don’t use literal URLs without angle brackets             no-literal-urls
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
