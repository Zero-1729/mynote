/*
    Author: Abubakar NK <github.com/Zero1729>
    License: MIT

    Experimental Notes importer utility functions to manipulate arrays
*/

const isArrayEqual = (a, b) => {
    let equal = true

    if (a.length == b.length) {
        let i = 0

        while (i < a.length) {
            if (a[i] != b[i]) {
                equal = false
                break
            }

            i += 1
        }

        return equal
    } else {
        return false
    }
}

const sortOldestFirst = (arr) => {
    arr.sort((a,b) => {return Date.parse(a.epoch) > Date.parse(b.epoch)})
    return arr
}

module.exports = { isArrayEqual, sortOldestFirst }
