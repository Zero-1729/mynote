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

export const setModalVisibility = ({ commit }, value) => {
    commit("SET_MODAL_VISIBILITY", value)
}
