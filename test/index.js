var fs = require('fs')
var path = require('path')
var test = require('tape')
var tmp = require('temporary-directory')
var downloadDat = require('..')

var testdats = {
  fullDat: 'dat://60c525b5589a5099aa3610a8ee550dcd454c3e118f7ac93b7d41b6b850272330/',
  file: 'dat://60c525b5589a5099aa3610a8ee550dcd454c3e118f7ac93b7d41b6b850272330/dat.json',
  subdir: 'dat://60c525b5589a5099aa3610a8ee550dcd454c3e118f7ac93b7d41b6b850272330/public/imgs/'
}

test('Download full dat', function (t) {
  tmp(async function (_, dir, cleanup) {
    await downloadDat(testdats.fullDat, dir)
    var key = testdats.fullDat.split('//')[1]
    fs.stat(path.join(dir, key), function (err, stat) {
      t.error(err, 'no error')
      t.ok(stat.isDirectory(), 'directory exists')
      cleanup(function () {
        t.end()
      })
    })
  })
})

test('Download single file', function (t) {
  tmp(async (_, dir, cleanup) => {
    await downloadDat(testdats.file, dir)
    fs.stat(path.join(dir, 'dat.json'), function (err, stat) {
      t.error(err, 'no error')
      t.ok(stat, 'file exists')
      cleanup(function () {
        t.end()
      })
    })
  })
})
