# dat-download

One-time file downloads via Dat. Download a single file or subdirectory from a dat. Automatically joins the network and handles everything for you.

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

## Example

```js
var datDownload = require('dat-download')

await datDownload('dat://778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639/dat.json', process.cwd())

console.log('done downloading! thanks')
```

Works with DNS-type dat keys too!

```js
var datDownload = require('dat-download')

await datDownload('dat://beakerbrowser.com/index.html', process.cwd())
```

Can also download a whole dat:

```js
var datDownload = require('dat-download')

await datDownload('dat://beakerbrowser.com/', process.cwd())
```

## Install

```
npm install dat-download
```

## API

### `await datDownload(datPath, [destination])`

* `datPath` - dat key with subdirectory or file path. If the whole key is specified, it will download to `destination/key`.
* `destination` - download folder

[npm-image]: https://img.shields.io/npm/v/dat-download.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/dat-download
[travis-image]: https://img.shields.io/travis/joehand/dat-download.svg?style=flat-square
[travis-url]: https://travis-ci.org/joehand/dat-download
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

## Licensing

This package is free to use for commercial purposes for a trial period under the terms of the [Prosperity Public License](./LICENSE).

Licenses for long-term commercial use are available via [licensezero.com](https://licensezero.com).

[![licensezero.com pricing](https://licensezero.com/projects/67986d53-c480-4633-8cdf-e4d0d9ae61c6/badge.svg)](https://licensezero.com/projects/67986d53-c480-4633-8cdf-e4d0d9ae61c6)