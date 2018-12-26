const hash = require('hash.js').sha256()

window.hasher = require('hash.js')
window.marko = require('marked')

const sha256 = (noteObject) => {
    flatened = noteObject.title + noteObject.text + noteObject.timestamp.toString() + noteObject.epoch.toString()

    return hash.update(flatened).digest('hex').toString()
}

const isMatch = (hash, otherHash) => {
    if (hash == otherHash) {
        return true
    } else {
        return false
    }
}

exports.sha256 = sha256
exports.isMatch = isMatch
