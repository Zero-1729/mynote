/*
    Author: Abubakar NK <github.com/Zero1729>
    License: MIT

    Experimental Notes importer utility functions
*/

const { isArrayEqual, sortOldestFirst } = require('./array')

const validNoteFields = [
    'epoch',
    'favourite',
    'hash',
    'text',
    'timestamp',
    'title'
]

const checkNoteValidity = (note) => {
    let noteFields = Object.keys(note)
    noteFields.sort()

    if (isArrayEqual(noteFields, validNoteFields)) {
        return note
    } else {
        throw "[Warn] Notes don't match the standard MyNote fields"
    }
}

const mergeNotes = (oldNotes, newNotes) => {
    let merged = []

    for (var i = 0;i < oldNotes.length;i++) {
        merged.push(checkNoteValidity(oldNotes[i]))
    }

    for (var i = 0;i < newNotes.length;i++) {
        merged.push(checkNoteValidity(newNotes[i]))
    }

    // Sort them in ascending order of recency with respect to their date created
    return sortOldestFirst(merged)
}

module.exports = { mergeNotes }
