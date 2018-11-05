// Vuex Store

import Vue  from "vue"
import Vuex from "vuex"
import * as actions from "./actions"
import createPersistedState from "vuex-persistedstate"

const sha256 = require('./../lib/hasher').sha256

Vue.use(Vuex)

// initial state object for store
const state = {
    notes: [],
    activeNote: {},
    allNotesCount: 0,
    favNotesCount: 0,
    unnamedNoteCount: 0,
    onPane: 'all',
    nightmode: false,
    livemode: false,
    searchType: 'Regex',
    showSpanel: true,
    fontSize: 15,
    showModal: false,
    autoMojiOpen: false
    /*hiddenSidepane: false*/
}

// Definition for possible mutations that can be applied to teh state
const mutations = {
    ADD_NOTE (state, title) {
        const newNote = {
            title: title,
            text: "Blank Note",
            epoch: Date(),
            timestamp: Date(),
            favourite: false
        }
        state.notes.push(newNote)
        state.activeNote = newNote

        let index = state.notes.length - 1

        // Create hash for note
        state.notes[index].hash = sha256(newNote)

        state.allNotesCount ++
        state.unnamedNoteCount ++
    },

    EDIT_NOTE (state, text) {
        for (let i = 0;i<state.notes.length;i++) {
            if (state.notes[i].hash == state.activeNote.hash) {
                state.notes[i].text = text
                state.activeNote.text = text

                state.activeNote.timestamp = Date()
                state.notes[i].timestamp = state.activeNote.timestamp

                state.activeNote.hash = sha256(state.activeNote)
                state.notes[i].hash = state.activeNote.hash
            }
        }
    },

    DELETE_NOTE (state) {
        if ( state.allNotesCount <= 0 ) {
            //Perform no more subtractions
        }
        else {
            state.allNotesCount --
        }

        if (state.activeNote.text.slice(0, 10) == "Blank Note") {
            state.unnamedNoteCount --
        }

        var index = state.notes.indexOf(state.activeNote)
        state.notes.splice(index, 1)
        var last_index = state.notes.length - 1

        state.activeNote = state.notes.length > 0 ? state.notes[last_index] : {}
    },

    TOGGLE_FAVOURITE (state) {
        state.activeNote.favourite = !state.activeNote.favourite
        state.favNotesCount += state.activeNote.favourite ? 1 : -1
    },

    SET_ACTIVE_NOTE (state, note) {
        state.activeNote = note
    },

    TOGGLE_LIVE_MODE (state) {
        if (state.livemode) {
            state.livemode = false
        } else {
            state.livemode = true
        }
    },

    CALCULATE_AVG_READ_TIME (state, text) {
        // Using Assumption that average Adult reads 200 words per minute (WPM)
        // Returns 'time' in secs
        return text.split(' ').length * (200 / 120)
    },

    /*TOGGLE_SIDEPANE (state) {
        if (state.hiddenSidepane) {
            state.hiddenSidepane = false
        } else {
            state.hiddenSidepane = true
        }
    },*/

    TOGGLE_NM (state) {
        if (state.nightmode) {
            state.nightmode = false
        } else {
            state.nightmode = true
        }
    },

    TOGGLE_SPANEL (state) {
        console.log("cur: ", state.showSpanel)
        state.showSpanel = !state.showSpanel
    },

    SET_CURRENT_PANE (state, pane) {
        state.onPane = pane
    },

    SET_SEARCH_TYPE (state, type) {
        if (state.searchType == type) {
            state.searchType = 'Fuzzy'
        } else {state.searchType = type}
    },

    LOAD_STYLE (state) {
        if (state.nightmode) {
            let sheetPath = path.join('src', window.path.sep, 'styles', window.path.sep, 'theme', window.path.sep, 'night.css')
            let syntaxSheetPath = path.join('src', window.path.sep, 'styles', window.path.sep, 'code', window.path.sep, 'monokai.css')

            document.getElementsByTagName('link')[0].href = sheetPath;
            document.getElementsByTagName('link')[2].href = syntaxSheetPath;
        } else {
            let sheetPath = window.path.join('src', window.path.sep, 'styles', window.path.sep, 'theme', window.path.sep, 'light.css')
            let syntaxSheetPath = path.join('src', window.path.sep, 'styles', window.path.sep, 'code', window.path.sep, 'github-gist.css')

            document.getElementsByTagName('link')[0].href = sheetPath;
            document.getElementsByTagName('link')[2].href = syntaxSheetPath;
        }
    },

    SET_FONT_SIZE (state, size) {
        state.fontSize = size
    },

    SET_AUTOMOJI_OPEN (state, value) {
        state.autoMojiOpen = value
    },

    SET_MODAL_VISIBILITY (state, value) {
        state.showModal = value
    }
}

const getters = {
    activeNote: state => state.activeNote,
    live: state => state.livemode,
    uNCount: state => state.unnamedNoteCount,
    onPane: state => state.onPane,
    /*hSidepane: state => state.hiddenSidepane,*/
    fontSize: state => state.fontSize,
    nm: state => state.nightmode,
    searchType: state => state.searchType,
    showSpanel: state => state.showSpanel,
    autoMojiOpen: state => state.autoMojiOpen
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    plugins: [createPersistedState()] //Initiate Persistent Local Store of state
})
