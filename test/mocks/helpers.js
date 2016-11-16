const Future = require('fluture');

module.exports = {
  cachePath: (type, file) => type + '/' + file,
  getSizeStr: () => '101x101',
  cachedCopyExists: (type, src) => {
    return src === 'a.jpg'
      ? Future((rej, res) => rej('a.jpg'))
      : Future((rej, res) => res('a.jpg'))
  }
}
