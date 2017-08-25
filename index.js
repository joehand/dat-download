var assert = require('assert')
var fs = require('fs')
var path = require('path')
var Dat = require('dat-node')
var mirror = require('mirror-folder')
var pump = require('pump')
var ram = require('random-access-memory')
var mkdirp = require('mkdirp')
var debug = require('debug')('dat-download')

module.exports = function (datPath, downloadDest, cb) {
  assert.equal(typeof datPath, 'string', 'dat-download: string path required')
  if (typeof downloadDest === 'function') {
    cb = downloadDest
    downloadDest = process.cwd()
  }
  assert.equal(typeof cb, 'function', 'dat-download: callback required')

  if (datPath.indexOf('//') > -1) datPath = datPath.split('//')[1]
  var key = 'dat://' + datPath.split('/')[0]
  var entryPath = '/' + datPath.split('/').slice(1).join('/')
  if (entryPath === '/') downloadDest = path.join(downloadDest, datPath.split('/')[0])
  debug('downloadDir', downloadDest)
  debug('dat key', key)
  debug('dat path', entryPath)

  Dat(ram, {key: key, sparse: true}, function (err, dat) {
    if (err) return cb(err)
    var archive = dat.archive
    dat.joinNetwork()
    archive.metadata.update(function () {
      download(entryPath, function (err) {
        if (err) return cb(err)
        dat.close(cb)
      })
    })

    function download (entryPath, cb) {
      archive.stat(entryPath, function (err, stat) {
        if (err) return cb(err)
        if (stat.isDirectory()) downloadDir(entryPath, cb)
        if (stat.isFile()) downloadFile(entryPath, cb)
      })
    }

    function downloadDir (dirname, cb) {
      debug('downloading dir', dirname)
      var dest = path.join(downloadDest, dirname)
      fs.stat(dest, function (_, stat) {
        // throw if dest exists
        if (stat && stat.isDirectory()) return cb(new Error('Destination path exists:' + dest))
        mkdirp(dest, function (err) {
          if (err) return cb(err)
          mirror({fs: archive, name: dirname}, dest, cb)
        })
      })
    }

    function downloadFile (file, cb) {
      mkdirp(downloadDest, function (err) {
        if (err) return cb(err)
        var dest = path.join(downloadDest, file)
        debug('downloading file', file, 'to', dest)
        var rs = archive.createReadStream(file)
        var ws = fs.createWriteStream(path.join(downloadDest, file))
        pump(rs, ws, cb)
      })
    }
  })
}
