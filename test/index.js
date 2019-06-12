const fs = require('fs')
const path = require('path')
const test = require('tape')
const tmp = require('temporary-directory')
const downloadDat = require('..')

const createDat = require('./helper')

const testdats = {
  fullDat: 'dat://60c525b5589a5099aa3610a8ee550dcd454c3e118f7ac93b7d41b6b850272330/',
  file: 'dat://60c525b5589a5099aa3610a8ee550dcd454c3e118f7ac93b7d41b6b850272330/dat.json',
  subdir: 'dat://60c525b5589a5099aa3610a8ee550dcd454c3e118f7ac93b7d41b6b850272330/public/imgs/'
}

test('Download dat', async function (t) {
  tmp(async function (_, dir, cleanup) {
    const dat = await createDat()
    await downloadDat(dat.key.toString('hex'), dir)
    fs.stat(dir, function (err, stat) {
      t.error(err, 'no error')
      t.ok(stat)
      t.ok(stat.isDirectory(), 'directory exists')
      cleanup(async function () {
        await dat.close()
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
