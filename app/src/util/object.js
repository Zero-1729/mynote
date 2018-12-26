/*
    Author: Abubakar NK <github.com/Zero1729>
    License: MIT

    Some utilities for manipulating HashMaps
*/

const reverseHashMap = (hashMap) => {
    // We create variables for storing the new reversed hashMap object,
    // ... dict keys ('k') and values ('v')
    let newHashMap = {}, k = [], v = []

    // We extract the keys and values from the old hashMap Object
    k = Object.keys(hashMap)
    v = Object.values(hashMap)

    // Loop through the values and assign each 'ith' value to its corresponding
    // ... 'ith' key
    for (var i = 0;i < k.length;i++) {
        newHashMap[v[i][0] == ':' && v[i][v[i].length-1] == ":" ? v[i].slice(1, v[i].length-1) : v[i]] = k[i]
    }

    // return the new hashMap containing the values ('v') to keys ('k') mapping
    return newHashMap
}

// Truthy Array Checker
// Short Desc: returns 'true' if all values in an Object are 'true' and 'false' otherwise
// Purpose: Determines whether all values in an Object are 'true'
const objectTruthyChecker = (v) => {
    if (v[0] == false) {return false}
    if (v.length == 0) {return true}
    return objectTruthyChecker(v.slice(1))
}

// Falsehood Array Spotter
// Short Desc: returns an Array of all false elements of an object
// Purpose: Determines whether a given 'value' of a given 'key' in an Object is 'false'
// ... and adds it to an Array ('bin') to be returned
const spotFalseObject = (k, v, bin) => {
    if (v.length == 0) {return bin}
    if (v[0] == false) {return bin.push(k[k.length - v.length])}
    return spotFalseObject(k, v.slice(1), bin)
}

const buildMap = (k, v) => {
    // Assumes that k.length == v.length
    // Creates a hash map itaratively from an Array of keys 'k' and values 'v'

    if (k.length != v.length) {
        throw '[Err] The function requires length of keys and values to equal'
    } else {
        let tmp = {}

        for (var i = 0;i < k.length;i++) {
            tmp[k[i]] = v[i]
        }

        return tmp
    }
}

exports.reverseHashMap        = reverseHashMap
exports.objectTruthyChecker   = objectTruthyChecker
exports.spotFalseObject       = spotFalseObject
exports.buildMap              = buildMap
