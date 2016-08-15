module.exports = {
  constants: {
    F_OK: 1
  },
  access: (path, mode, cb) => path == '/home/error/path'
    ? cb('err')
    : cb()
}
