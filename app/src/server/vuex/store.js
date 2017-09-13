// Vuex Store

import Vue  from "vue"
import Vuex from "vuex"
import * as actions from "./actions"
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

// initial state object for store
const state = {
    notes: [],
    activeNote: {},
    allNotesCount: 0
}

// Definition for possible mutations that can be applied to teh state
const mutations = {
    ADD_NOTE (state) {
        const newNote = {
            text: "Blank Note",
            favourite: false
        }
        state.notes.push(newNote)
        state.activeNote = newNote
        state.allNotesCount ++
    },

    EDIT_NOTE (state, text) {
        state.activeNote.text = text
    },

    DELETE_NOTE (state) {
        if ( state.allNotesCount <= 0) {
            //Perform no more subtractions
        }
        else {
            state.allNotesCount --
        }

        var index = state.notes.indexOf(state.activeNote)
        state.notes.splice(index, 1)
        state.activeNote = state.notes.length > 0 ? state.notes[0] : {}
    },

    TOGGLE_FAVOURITE (state) {
        state.activeNote.favourite = !state.activeNote.favourite
    },

    SET_ACTIVE_NOTE (state, note) {
        state.activeNote = note
    }
}

const getters = {
    activeNote: state => state.activeNote
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    plugins: [createPersistedState()] //Initiate Persistent Local Store of state
})
