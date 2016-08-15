module.exports = {
  constants: { F_OK: 1 },

  readdirSync: (a, b) => ['/home/thumb/a.jpg', '/home/preview/a.jpg'],

  access: (path, mode, cb) => path == '/home/error/path'
    ? cb('Error')
    : cb()
}
