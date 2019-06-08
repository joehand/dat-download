const assert = require('assert')
const fs = require('fs')
const path = require('path')
const Dat = require('dat-node')
const mirror = require('mirror-folder')
const pump = require('pump')
const ram = require('random-access-memory')
const mkdirp = require('mkdirp')
const debug = require('debug')('dat-download')

module.exports = (datPath, downloadDest = process.cwd(), { overwrite = true } = {}) => {
  assert.strictEqual(typeof datPath, 'string', 'dat-download: string path required')

  if (datPath.indexOf('//') > -1) datPath = datPath.split('//')[1]
  const key = 'dat://' + datPath.split('/')[0]
  const entryPath = '/' + datPath.split('/').slice(1).join('/')
  // if (entryPath === '/') downloadDest = path.join(downloadDest, ?datPath.split('/')[0])
  debug('downloadDir', downloadDest)
  debug('dat key', key)
  debug('dat path', entryPath)

  return new Promise(async (resolve, reject) => {
    const dat = await Dat(ram, { key: key, sparse: true })
    const net = dat.joinNetwork()
    net.once('connection', () => {
      debug('Connected')
    })

    dat.archive.metadata.update(async () => {
      try {
        await download(entryPath)
        await dat.close()
        resolve()
      } catch (e) {
        await dat.close()
        reject(e)
      }
    })

    function download (entryPath) {
      return new Promise((resolve, reject) => {
        dat.archive.stat(entryPath, async (err, stat) => {
          if (err) return reject(err)
          if (stat.isDirectory()) await downloadDir(entryPath)
          else if (stat.isFile()) await downloadFile(entryPath)
          resolve()
        })
      })
    }

    function downloadDir (dirname) {
      return new Promise((resolve, reject) => {
        var dest = path.join(downloadDest, dirname)
        debug('downloading dir', dirname, 'to', dest)
        fs.stat(dest, function (_, stat) {
          // throw if dest exists
          if (overwrite === false) if (stat && stat.isDirectory()) return reject(new Error('Destination path exists:' + dest))
          mkdirp(dest, function (err) {
            if (err) return reject(err)
            debug('starting download')
            const prog = mirror({ fs: dat.archive, name: dirname, keepExisting: true }, dest, (err) => {
              if (err) return reject(err)
              resolve()
            })
            prog.on('put', src => {
              debug('Download', src.name)
            })
          })
        })
      })
    }

    function downloadFile (file, cb) {
      return new Promise((resolve, reject) => {
        mkdirp(downloadDest, (err) => {
          if (err) return reject(err)
          var dest = path.join(downloadDest, file)
          debug('downloading file', file, 'to', dest)
          var rs = dat.archive.createReadStream(file)
          var ws = fs.createWriteStream(path.join(downloadDest, file))
          pump(rs, ws, (err) => {
            if (err) return reject(err)
            resolve()
          })
        })
      })
    }
  })
}
