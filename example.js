var datDownload = require('dat-download')

datDownload('dat://beakerbrowser.com/index.html', process.cwd(), function (err) {
  if (err) throw err
  console.log('done downloading! thanks')
})
