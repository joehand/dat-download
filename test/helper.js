const Dat = require('dat-node')

module.exports = async function () {
  const dat = await Dat(__dirname, { temp: true })
  await dat.importFiles()
  dat.joinNetwork()
  return dat
}
