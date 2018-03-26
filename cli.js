#!/usr/bin/env node

var minimist = require('minimist')
var neatLog = require('neat-log')
var datDownload = require('./')
var debug = require('debug')('dat-next')

process.title = 'dat-next'

var argv = minimist(process.argv.slice(2), {
  alias: {help: 'h'}
})

var key = argv._[0]
var dest = argv._[1] || process.cwd()
var logspeed = argv.logspeed || 400

if (!argv._.length || argv.help) return usage()

datDownload(key, dest, function (err) {
  if (err) throw err
  console.log('done downloading! thanks')
})

function usage () {
  console.error('dat-download dat://<key> [downloadDir]')
  process.exit(1)
}
