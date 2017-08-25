# dat-download

One-time file downloads via Dat. Download a single file or subdirectory from a dat. Automatically joins the network and handles everything for you.

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

## Example

```js
var datDownload = require('dat-download')

datDownload('dat://778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639/dat.json', process.cwd(), function (err) {
    if (err) throw err
    console.log('done downloading! thanks')
})
```

Works with DNS-type dat keys too!

```js
var datDownload = require('dat-download')

datDownload('dat://beakerbrowser.com/index.html', process.cwd(), function (err) {
    if (err) throw err
    console.log('done downloading! thanks')
})
```

## Install

```
npm install dat-download
```

## API

### `datDownload(datPath, [destination], callback)`

* `datPath` - dat key with subdirectory or file path. If the whole key is specified, it will download to `destination/key`.
* `destination` - download folder

## License

[MIT](LICENSE.md)

[npm-image]: https://img.shields.io/npm/v/dat-download.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/dat-download
[travis-image]: https://img.shields.io/travis/joehand/dat-download.svg?style=flat-square
[travis-url]: https://travis-ci.org/joehand/dat-download
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard
