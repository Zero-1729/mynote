export const importNotes = ({ commit }, notes) => {
    commit("IMPORT_NOTES", notes)
}

export const addNote = ({ commit }, title) => {
    commit("ADD_NOTE", title)
}

export const editNote = ({ commit }, text) => {
    commit("EDIT_NOTE", text)
}

export const editNoteTitle = ({ commit }, obj) => {
    commit("EDIT_NOTE_TITLE", obj)
}

export const deleteNote = ({ commit }) => {
    commit("DELETE_NOTE")
}

export const updateActiveNote = ({ commit }, note) => {
    commit("SET_ACTIVE_NOTE", note)
}

export const toggleFavourite = ({ commit }) => {
    commit("TOGGLE_FAVOURITE")
}

export const toggleLiveMode = ({ commit }) => {
    commit("TOGGLE_LIVE_MODE")
}

export const toggleNM = ({ commit }) => {
    commit("TOGGLE_NM")
}

export const toggleSpanel = ({ commit }, forced) => {
    commit("TOGGLE_SPANEL", forced)
}

export const toggleToolset = ({ commit }, forced) => {
    commit("TOGGLE_TOOLSET", forced)
}

export const setExportedSingle = ({ commit }, value) => {
    commit("SET_EXPORTED_SINGLE", value)
}

export const setExportedSingleName = ({ commit }, value) => {
    commit("SET_EXPORTED_SINGLE_NAME", value)
}

export const setExportedAll = ({ commit }, value) => {
    commit("SET_EXPORTED_ALL", value)
}

export const setExportedAllStatus = ({ commit }, value) => {
    commit("SET_EXPORTED_ALL_STATUS", value)
}

export const setSideNavHidden = ({ commit }, value) => {
    commit("SET_SIDENAV_HIDDEN", value)
}

export const setCurrentPane = ({ commit }, pane) => {
    commit("SET_CURRENT_PANE", pane)
}

export const setSettingsOpen = ({ commit }, value) => {
    commit("SET_SETTINGS_OPEN", value)
}

export const setSearchType = ({ commit }, type) => {
    commit("SET_SEARCH_TYPE", type)
}

export const setFontSize = ({ commit }, size) => {
    commit("SET_FONT_SIZE", size)
}

export const setAutoMojiOpen = ({ commit }, value) => {
    commit("SET_AUTOMOJI_OPEN", value)
}

export const setModalVisibility = ({ commit }, value) => {
    commit("SET_MODAL_VISIBILITY", value)
}

export const setExportModalVisibility = ({ commit }, value) => {
    commit("SET_EXPORT_MODAL_VISIBILITY", value)
}

export const loadStyle = ({ commit }) => {
    commit("LOAD_STYLE")
}

export const loadFontSize = ({ commit }, path) => {
    commit("LOAD_FONT_SIZE", path)
}

export const loadFontFamily = ({ commit }, path) => {
    commit("LOAD_FONT_FAMILY", path)
}


export const resetSettings = ({ commit }) => {
    commit("RESET_SETTINGS")
}

export const changeSettings = ({ commit }, obj) => {
    commit("CHANGE_SETTINGS", obj)
}

export const isNightTime = ({ commit }) => {
    commit("IS_NIGHT_TIME")
}

export const cacheTheme = ({ commit }, value) => {
    commit("CACHE_THEME", value)
}

export const cacheRoute = ({ commit }, path) => {
    commit("CACHE_ROUTE", path)
}

export const loadEmojisPath = ({ commit }, root) => {
    commit("LOAD_EMOJIS_PATH", root)
}
