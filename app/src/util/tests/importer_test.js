const fs           = require('fs')
const {mergeNotes} = require('./importer')

var notes = null

fs.readFile('./sample.backup.json', (err, data) => {
	if (data) {
		notes = JSON.parse(data)

		merged_notes = mergeNotes(notes, [{epoch: Date(),
						favourite: false,
						hash: null,
						text: 'hello',
						timestamp: Date(),
						title: 'Blank'}])

		// merged_notes.sort((a,b) => {return Date.parse(a.epoch) > Date.parse(b.epoch)})
		merged_notes.forEach((note) => {
			console.log(`${merged_notes.indexOf(note)}:\t'${note.epoch}'\t'${note.title}'`)
		})
	}
})
