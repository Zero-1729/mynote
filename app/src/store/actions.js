export const addNote = ({ commit }, title) => {
    commit("ADD_NOTE", title)
}

export const editNote = ({ commit }, text) => {
    commit("EDIT_NOTE", text)
}

export const deleteNote = ({ commit }) => {
    commit("DELETE_NOTE")
}

export const updateActiveNote = ({ commit }, note) => {
    commit("SET_ACTIVE_NOTE", note)
}

export const updateActiveNoteDOM = ({ commit }, domObj) => {
    commit("SET_ACTIVE_NOTE_DOM", domObj)
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

export const toggleSpanel = ({ commit }) => {
    commit("TOGGLE_SPANEL")
}

export const toggleSidepane = ({ commit }) => {
    commit("TOGGLE_SIDEPANE")
}

export const calculateAvgReadTime = ({ commit }, text) => {
    commit("CALCULATE_AVG_READ_TIME", text)
}

export const setCurrentPane = ({ commit }, pane) => {
    commit("SET_CURRENT_PANE", pane)
}

export const setSearchType = ({ commit }, type) => {
    commit("SET_SEARCH_TYPE", type)
}

export const loadStyle = ({ commit }) => {
    commit("LOAD_STYLE")
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
