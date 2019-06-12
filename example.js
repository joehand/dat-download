var datDownload = require('dat-download');

(async () => {
  try {
    await datDownload('dat://beakerbrowser.com/index.html')
    console.log('done downloading! thanks')
  } catch (e) {
    throw e
  }
})()
