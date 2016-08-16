const Future = require('fluture');

module.exports = {
  cachePath: (type, file) => type + '/' + file,
  cachedCopyExists: (type, src) => {
    return src === 'a.jpg'
      ? Future((rej, res) => rej(false))
      : Future((rej, res) => res(true))
  }
}
