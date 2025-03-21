<h1 align="center">
	<br>
	<img width="500" src="media/logo.svg" alt="awesome-lint">
	<br>
	<br>
	<br>
</h1>

> Linter for [Awesome](https://awesome.re) lists

Intended to make it easier to create and maintain Awesome lists.

Includes a bunch of [general Markdown rules](config.js) and some [Awesome specific rules](rules).

![](media/screenshot.png)

## CLI

### Usage

The CLI requires Node.js and Git.

Type the command `npx awesome-lint` followed by the URL of the repo you want to check:

```
❯ npx awesome-lint https://github.com/sindresorhus/awesome-something

  readme.md:1:1
  ✖    1:1  Missing Awesome badge after the main heading      awesome-badge
  ✖   12:1  Marker style should be -                          unordered-list-marker-style
  ✖  199:3  Remove trailing slash (https://sindresorhus.com)  trailing-slash

  3 errors
```

### Special comments

You can enable, disable, and ignore rules using special comments. This is based on [remark-message-control](https://github.com/remarkjs/remark-message-control#markers).

By default, all rules are turned on. For example, 4 errors (2 of `no-dead-urls` and 2 of `awesome-list-item`) will be generated for following code snippets.

```md
- [foo](https://foo.com) - an invalid description.
- [foo](https://foo.com) - invalid description.
```

###### `disable`

The `disable` keyword turns off all messages of the given rule identifiers. If no identifiers are specified, all messages are turned off.

**Don't leave spaces after the last rule identifier.**

For example, only the 2 `no-dead-urls` errors are left:

```md
<!--lint disable awesome-list-item-->
- [foo](https://foo.com) - an invalid description.
- [foo](https://foo.com) - invalid description.
```

###### `enable`

The `enable` keyword turns on all messages of the given rule identifiers. If no identifiers are specified, all messages are turned on.

For example, only the second line reports a `awesome-list-item` rule violation:

```md
<!--lint disable awesome-list-item-->
- [foo](https://foo.com) - an invalid description.
<!--lint enable awesome-list-item-->
- [foo](https://foo.com) - invalid description.
```

###### `ignore`

The `ignore` keyword turns off all messages of the given rule identifiers occurring in the following node. If no identifiers are specified, all messages are turned ignored. After the end of the following node, messages are turned on again. This is the main difference with `disable`.

For example, to turn off certain messages for the next node:

```md
<!--lint ignore awesome-list-item-->
- [foo](https://foo.com) - an invalid description.

List items share the same parent node. So let's create a new list.

- [foo](https://foo.com) - invalid description.
```

### Continuous Integration

#### GitHub Actions

You can use [GitHub Actions](https://github.com/features/actions) for free to automatically run `awesome-lint` against all pull requests.

Create `/.github/workflows/main.yml` with the following contents:

```yml
name: CI
on:
  pull_request:
    branches: [main]
jobs:
  Awesome_Lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: npx awesome-lint
```

*`fetch-depth: 0`* is needed so that we can check the repo age.

You may add [branch protection rules](https://docs.github.com/en/github/administering-a-repository/configuring-protected-branches) to prevent merging branches not passing `awesome-lint`.

#### Travis

Add it as a `test` script in package.json and activate Travis CI to lint on new commits and pull requests.

**Note:** [Travis CI only clones repositories to a maximum of 50 commits by default](https://docs.travis-ci.com/user/customizing-the-build/#git-clone-depth), which may result in a false positive of `awesome/git-repo-age`, and so you should set `depth` to `false` in `.travis.yml` if needed.

**Note:** Avoid rate limit problems on Travis CI by defining a [GitHub personal access token](https://github.com/settings/tokens/new) in an environment variable named `github_token`. See [defining variables in repository settings](https://docs.travis-ci.com/user/environment-variables/#defining-variables-in-repository-settings).

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

```sh
npm install awesome-lint
```

### Usage

```js
import awesomeLint from 'awesome-lint';

awesomeLint.report();
```

### Docs

#### awesomeLint()

Returns a `Promise` for a list of [`VFile`](https://github.com/vfile/vfile) objects.

#### awesomeLint.report()

Show the lint output. This can be custom reported by setting `options.reporter=<function>` and passing in `options` as a parameter.
