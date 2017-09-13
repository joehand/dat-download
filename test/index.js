var fs = require('fs')
var path = require('path')
var test = require('tape')
var tmp = require('temporary-directory')
var downloadDat = require('..')

var testdats = {
  fullDat: 'dat://778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639/',
  fullDat2: 'dat://778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639',
  file: 'dat://778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639/dat.json',
  subdir: 'dat://43bafc583c0c42fcc712b35a5f6bce62cc92567a5c719d10ea6acfca4903b843/knight-publicbits-ppt'
}

test('Download full dat', function (t) {
  tmp(function (_, dir, cleanup) {
    downloadDat(testdats.fullDat, dir, function (err) {
      t.error(err, 'no error')
      fs.stat(dir, function (err, stat) {
        t.error(err, 'no error')
        t.ok(stat.isDirectory(), 'directory exists')
        cleanup(function () {
          t.end()
        })
      })
    })
  })
})

test('Download full dat 2', function (t) {
  tmp(function (_, dir, cleanup) {
    downloadDat(testdats.fullDat2, dir, function (err) {
      t.error(err, 'no error')
      fs.stat(dir, function (err, stat) {
        t.error(err, 'no error')
        t.ok(stat.isDirectory(), 'directory exists')
        cleanup(function () {
          t.end()
        })
      })
    })
  })
})

test('Download subdir', function (t) {
  tmp(function (_, dir, cleanup) {
    downloadDat(testdats.subdir, dir, function (err) {
      t.error(err, 'no error')
      fs.readdir(dir, function (err, entries) {
        t.error(err, 'no error')
        t.ok(entries.length === 1, 'directory exists')
        t.ok(entries[0] === 'knight-publicbits-ppt')
        cleanup(function () {
          t.end()
        })
      })
    })
  })
})

test('Download single file', function (t) {
  tmp(function (_, dir, cleanup) {
    downloadDat(testdats.file, dir, function (err) {
      t.error(err, 'no error')
      fs.stat(path.join(dir, 'dat.json'), function (err, stat) {
        t.error(err, 'no error')
        t.ok(stat, 'file exists')
        cleanup(function () {
          t.end()
        })
      })
    })
  })
})
