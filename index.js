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
  // if (entryPath === '/') downloadDest = path.join(downloadDest, datPath.split('/')[0])
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
      mkdirp(dest, function (err) {
        if (err) return cb(err)
        mirror({fs: archive, name: dirname}, dest, {equals: equals}, cb)
      })

      function equals (src, dst, cb) {
        console.log('src.name, dst.name', src.name, dst.name)
        console.log('dir', src.stat.isDirectory(), dst.stat.isDirectory())
        if (src.stat.isDirectory()) return cb(null, true)
        console.log('not directory')
        if (src.stat.size !== dst.stat.size) return cb(null, false)
        if (src.stat.mtime.getTime() > dst.stat.mtime.getTime()) return cb(null, false)
        cb(null, true)
      }
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
