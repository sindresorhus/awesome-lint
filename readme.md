<h1 align="center">
	<br>
	<img width="500" src="media/logo.svg" alt="awesome-lint">
	<br>
	<br>
	<br>
</h1>

> Linter for [Awesome](https://awesome.re) lists

[![Build Status](https://travis-ci.org/sindresorhus/awesome-lint.svg?branch=master)](https://travis-ci.org/sindresorhus/awesome-lint)

Intended to make it easier to create and maintain Awesome lists.

Includes a bunch of [general Markdown rules](https://github.com/sindresorhus/awesome-lint/blob/master/config.js) and some [Awesome specific rules](https://github.com/sindresorhus/awesome-lint/tree/master/rules).

![](media/screenshot.png)


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

**Note:** [Travis CI only clones repositories to a maximum of 50 commits by default](https://docs.travis-ci.com/user/customizing-the-build/#git-clone-depth), which may result in a false positive of `awesome/git-repo-age`, and so you should set `depth` to `false` in `.travis.yml` if needed.

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
# git:
#   depth: false
```


## API

### Install

```
$ npm install awesome-lint
```

### Usage

```js
const awesomeLint = require('awesome-lint');

awesomeLint.report();
```

### Docs

#### awesomeLint()

Returns a `Promise` for a list of [`VFile`](https://github.com/wooorm/vfile).

#### awesomeLint.report()

Show the lint output. This can be custom reported by setting `options.reporter=<function>` and passing in `options` as a parameter.


## Maintainers

- [Sindre Sorhus](http://github.com/sindresorhus)
- [Travis Fischer](https://github.com/transitive-bullshit)


## License

MIT
