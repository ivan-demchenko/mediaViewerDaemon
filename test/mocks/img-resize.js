const Future = require('fluture');

module.exports = () => {
    return Future((rej, res) => res('done: 0'))
}
