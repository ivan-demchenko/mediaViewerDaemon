module.exports = {
  constants: { F_OK: 1 },

  readdirSync: (a, b) => ['/test_config_home/thumb/a.jpg', '/test_config_home/preview/a.jpg'],

  access: (path, mode, cb) => path == '/test_config_home/type/nonexisting'
    ? cb('err')
    : cb(null)
}
