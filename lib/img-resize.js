var Q = require('q');
var config = require('./config.json');
var spawn = require('child_process').spawn;
var path = require('path');

module.exports = function(src, dst, size) {
  return Q.Promise((res, rej) => {
    var dstPath = path.dirname(dst);
    var convertProcess = spawn(path.join(__dirname, 'img.sh'), [
      `--src-file=${src}`,
      `--dst-file=${dst}`,
      `--dst-path=${dstPath}`,
      `--new-size=${size}`
    ]);

    convertProcess.stdout.on('data', (data) => console.log('stdout: ' + data));
    convertProcess.stderr.on('data', (data) => console.log('stdout: ' + data));
    convertProcess.on('close', (code) => {
      console.log('Process exited with code ' + code);
      res(true);
    });

  });
};
