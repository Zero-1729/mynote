// Vuex Store

import Vue  from "vue"
import Vuex from "vuex"
import * as actions from "./actions"
import createPersistedState from "vuex-persistedstate"

const path           = require('path')
const sha256         = require('./../util/hasher').sha256

const { mergeNotes }   = require('./../util/importer')
const { Id, TagNameN } = require('./../util/document')

Vue.use(Vuex)

// initial state object for store
const state = {
    notes: [],
    vars: {
        activeNote: {},
        unnamedNoteCount: 0,
        onPane: 'all',
        nightmode: false,
        livemode: false,
        cachedTheme: 'Light',
        cachedRoute: '/',
        searchType: 'Fuzzy',
        settingsOpen: false,
        showSpanel: false,
        showModal: false,
        showToolset: false,
        showExportModal: false,
        autoMojiOpen: false,
        emojisPath: null,
        sideNavHidden: false,
        exportedSingle: false,
        exportedSingleName: null,
        exportedAll: false,
        exportedAllStatus: false,
        importedNotes: false,
    },
    settings: {
        theme: "Light", // "Light" or "Dark"
        bulletListMarker: "disc", // "circle", "square", etc
        fontSize: 14, // [0-9]+
        textFontFamily: "Lato", // Must be installed locally
        lineHeight: 1.2, // [0-9][.[0-9]?+]*
        emojisType: "GitHub", // "EmojiOne" or "GitHub"
        autoDelimiterCompleter: true, // "]", "'" or '"', "}", ")"; true or false
        displayInfoModals: true, // Whether warning and succes modal messages should appear
        autoNightMode: false, // Sets the night mode depending on the time of the day
        tabSize: 4, // [0-9]+
        lang: 'en-US'
    }
}

// Definition for possible mutations that can be applied to teh state
const mutations = {
    IMPORT_NOTES (state, notes) {
        // EXPERIMENTAL!
        state.notes = mergeNotes(state.notes, notes)
        /*let m = mergeNotes(state.notes, notes)
        m.forEach((note) => {
            console.log(note.title, note.epoch)
        })*/
    },

    ADD_NOTE (state, title) {
        const newNote = {
            title: title,
            text: "Blank Note",
            epoch: Date(),
            timestamp: Date(),
            favourite: false
        }
        state.notes.push(newNote)
        state.vars.activeNote = newNote

        let index = state.notes.length - 1

        // Create hash for note
        state.notes[index].hash = sha256(newNote)

        state.vars.unnamedNoteCount ++
    },

    EDIT_NOTE_TITLE (state, obj) {
        state.notes[obj.index].title = obj.title
    },

    EDIT_NOTE (state, text) {
        for (let i = 0;i<state.notes.length;i++) {
            if (state.notes[i].hash == state.vars.activeNote.hash) {
                state.notes[i].text = text
                state.vars.activeNote.text = text

                state.vars.activeNote.timestamp = Date()
                state.notes[i].timestamp = state.vars.activeNote.timestamp

                state.vars.activeNote.hash = sha256(state.vars.activeNote)
                state.notes[i].hash = state.vars.activeNote.hash
            }
        }
    },

    DELETE_NOTE (state) {
        var index = state.notes.indexOf(state.vars.activeNote)
        state.notes.splice(index, 1)
        var last_index = state.notes.length - 1

        state.vars.activeNote = state.notes.length > 0 ? state.notes[last_index] : {}
    },

    SET_ACTIVE_NOTE (state, note) {
        state.vars.activeNote = note
    },

    TOGGLE_FAVOURITE (state) {
        state.vars.activeNote.favourite = !state.vars.activeNote.favourite
    },

    TOGGLE_LIVE_MODE (state) {
        if (state.vars.livemode) {
            state.vars.livemode = false
        } else {
            state.vars.livemode = true
        }
    },

    TOGGLE_NM (state) {
        state.vars.nightmode = !state.vars.nightmode
        state.settings.theme = !state.vars.nightmode ? 'Light' : 'Dark'
    },

    TOGGLE_SPANEL (state, forced=null) {
        state.vars.showSpanel = forced ? false : !state.vars.showSpanel
    },

    TOGGLE_TOOLSET (state, forced=null) {
        state.vars.showToolset = forced ? true : !state.vars.showToolset
    },

    SET_SIDENAV_HIDDEN (state, value) {
        state.vars.sideNavHidden = value
    },

    SET_SETTINGS_OPEN (state, value) {
        state.vars.settingsOpen = value
    },

    SET_CURRENT_PANE (state, pane) {
        state.vars.onPane = pane
    },

    SET_SEARCH_TYPE (state, type) {
        if (state.vars.searchType == type) {
            state.vars.searchType = 'Fuzzy'
        } else {state.vars.searchType = type}
    },

    IS_NIGHT_TIME (state) {
        // time is between 6 pm - 6 am (i.e evening)
        return !(Number(Date().slice(16, 18)) > 6
                && Number(Date().slice(16, 18)) <= 18)
    },

    LOAD_STYLE (state) {
        // Check if the time of the day is appropriate and change theme accordingly if user wants
        if (state.settings.theme == "Dark" ||
            (state.settings.autoNightMode && !(Number(Date().slice(16, 18)) > 6
                && Number(Date().slice(16, 18)) <= 18)
            )
        ) {
            let sheetPath = path.join('src', path.sep, 'styles', path.sep, 'theme', path.sep, 'night.css')
            let syntaxSheetPath = path.join('src', path.sep, 'styles', path.sep, 'code', path.sep, 'monokai.css')

            TagNameN('link', 0).href = sheetPath;
            TagNameN('link', 2).href = syntaxSheetPath;
        } else {
            let sheetPath = path.join('src', path.sep, 'styles', path.sep, 'theme', path.sep, 'light.css')
            let syntaxSheetPath = path.join('src', path.sep, 'styles', path.sep, 'code', path.sep, 'github-gist.css')

            TagNameN('link', 0).href = sheetPath;
            TagNameN('link', 2).href = syntaxSheetPath;
        }
    },

    LOAD_FONT_SIZE (state, path) {
        if (path == "Editor") {
            if (Id('textarea') != null) {
                Id('textarea').style.fontSize = String(state.settings.fontSize).concat("px")
                Id('fake-ta').style.fontSize = String(state.settings.fontSize).concat("px")
                Id('screen').style.fontSize = String(state.settings.fontSize).concat("px")
            }
        } else {
            Id('settings').style.fontSize = String(state.settings.fontSize).concat("px")
        }
    },

    LOAD_FONT_FAMILY (state, path) {
        Id('app').style.fontFamily = state.settings.textFontFamily

        if (path == "Editor") {
            Id('textarea').style.fontFamily = state.settings.textFontFamily
            Id('fake-ta').style.fontFamily = state.settings.textFontFamily
            Id('screen').style.fontFamily = state.settings.textFontFamily
        } else {
            Id('settings').style.fontFamily = state.settings.textFontFamily
        }
    },

    SET_EXPORTED_SINGLE (state, value) {
        state.vars.exportedSingle = value
    },

    SET_EXPORTED_SINGLE_NAME (state, value) {
        state.vars.exportedSingleName = value
    },

    SET_EXPORTED_ALL (state, value) {
        state.vars.exportedAll = value
    },

    SET_EXPORTED_ALL_STATUS (state, value) {
        state.vars.exportedAllStatus = value
    },

    SET_FONT_SIZE (state, size) {
        state.settings.fontSize = size
    },

    SET_AUTOMOJI_OPEN (state, value) {
        state.vars.autoMojiOpen = value
    },

    SET_MODAL_VISIBILITY (state, value) {
        state.vars.showModal = value
    },

    SET_EXPORT_MODAL_VISIBILITY (state, value) {
        state.vars.showExportModal = value
    },

    RESET_SETTINGS (state) {
        state.settings = {
            theme: state.settings.theme, // Leave unchanged
            bulletListMarker: "disc",
            fontSize: 14,
            textFontFamily: "Lato",
            lineHeight: 1.2,
            emojisType: "GitHub",
            displayInfoModals: true,
            autoDelimiterCompleter: true,
            autoNightMode: false,
            tabSize: 8,
            lang: 'en-US'
        }
    },

    CHANGE_SETTINGS (state, obj) {
        state.settings[obj.key] = obj.value
    },

    CACHE_THEME (state, value) {
        state.vars.cachedTeme = value
    },

    CACHE_ROUTE (state, path) {
        state.vars.cachedRoute = path
    },

    LOAD_EMOJIS_PATH (state, root) {
        state.vars.emojisPath = path.join(root, path.sep, 'app', path.sep, 'build',
                        path.sep, 'emojis', path.sep,
                        (state.settings.emojisType != 'EmojiOne' ? 'pngs' : (path.join('pngs', path.sep, 'emojione'))))
    }
}

const getters = {
    notes: state => state.notes,
    activeNote: state => state.vars.activeNote,
    live: state => state.vars.livemode,
    uNCount: state => state.vars.unnamedNoteCount,
    onPane: state => state.vars.onPane,
    fontSize: state => state.settings.fontSize,
    nm: state => state.vars.nightmode,
    cachedTheme: state => state.vars.cachedTeme,
    cachedRoute: state => state.vars.cachedRoute,
    searchType: state => state.vars.searchType,
    autoMojiOpen: state => state.vars.autoMojiOpen,
    newNote: state => state.vars.showModal,
    exportFile: state => state.vars.showExportModal,
    settingsOpen: state => state.vars.settingsOpen,
    sideNavHidden: state => state.vars.sideNavHidden,
    showSPanel: state => state.vars.showSpanel,
    showToolset: state => state.vars.showToolset,
    settings: state => state.settings,
    emojisPath: state => state.vars.emojisPath,
    exportedSingle: state => state.vars.exportedSingle,
    exportedSingleName: state => state.vars.exportedSingleName,
    exportedAll: state => state.vars.exportedAll,
    exportedAllStatus: state => state.vars.exportedAllStatus
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    plugins: [createPersistedState()] //Initiate Persistent Local Store of state
})
