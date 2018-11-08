<template>
    <footer id='bottom'>
        <automoji :data="emojiNames" :parent="this.$parent"></automoji>
        <div class="editor-search-bar" v-show="showPanel">
            <div class="editor-search-bar-container">
                <p class="editor-search-bar-status-panel-info">
                    {{status}} "{{searchText}}"
                </p>
                <div class="right-bound">
                    <p class="editor-search-bar-status-panel-info-right">
                        <font color="grey">Search rule:</font> {{searchType}}
                    </p>
                    <div class="editor-search-bar-status-panel-buttons">
                        <button class="editor-search-bar-small-btn" :class="{type: searchType == 'Regex'}" @click="setSearchType('Regex')">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 20 20" width="20" height="20"><circle vector-effect="non-scaling-stroke" cx="5.950840538182177" cy="14.5" r="1" /><path d=" M 14.185 10.506 L 14.185 10.506 C 13.235 10.312 12.285 10.922 12.065 11.867 L 12.065 11.867 C 11.845 12.811 11.416 12.831 11.108 11.912 L 11.108 11.912 C 10.8 10.992 9.797 10.475 8.869 10.756 L 8.869 10.756 C 7.942 11.038 7.71 10.677 8.352 9.951 L 8.352 9.951 C 8.994 9.224 8.941 8.096 8.233 7.434 L 8.233 7.434 C 7.526 6.771 7.722 6.39 8.673 6.583 L 8.673 6.583 C 9.623 6.776 10.573 6.166 10.793 5.222 L 10.793 5.222 C 11.013 4.277 11.441 4.257 11.749 5.177 L 11.749 5.177 C 12.057 6.096 13.06 6.614 13.988 6.332 L 13.988 6.332 C 14.916 6.051 15.148 6.412 14.506 7.138 L 14.506 7.138 C 13.863 7.864 13.916 8.992 14.624 9.655 L 14.624 9.655 C 15.332 10.318 15.135 10.699 14.185 10.506 Z " /></g></g></svg>
                        </button>
                        <button class="editor-search-bar-small-btn" :class="{type: searchType == 'Case Sensative'}" @click="setSearchType('Case Sensative')">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 20 20" width="20" height="20"><g transform="matrix(1,0,0,1,2,5.5)"><text transform="matrix(1,0,0,1,0,8.58)" style="font-family:&quot;Corbert&quot;;font-weight:400;font-size:12px;font-style:normal;stroke:none;">Aa</text></g></g></svg>
                        </button>
                        <button class="editor-search-bar-small-btn" :class="{type: searchType == 'In Selection'}" @click="setSearchType('In Selection')">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 20 20" width="20" height="20"><rect x="2" y="7" width="2" height="2.5" transform="matrix(1,0,0,1,0,0)" class="lighter" /><rect x="5" y="7" width="13" height="2.5" transform="matrix(1,0,0,1,0,0)" class="darker" /><rect x="16" y="10.5" width="2" height="2.5" transform="matrix(1,0,0,1,0,0)" class="lighter" /><rect x="13" y="10.5" width="2" height="2.5" transform="matrix(1,0,0,1,0,0)" class="lighter" /><rect x="2" y="10.5" width="10" height="2.5" transform="matrix(1,0,0,1,0,0)" class="darker" /></g></svg>
                        </button>
                        <button class="editor-search-bar-small-btn" :class="{type: searchType == 'Whole Word'}" @click="setSearchType('Whole Word')">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 20 20" width="20" height="20"><rect x="5.25" y="7" width="9.5" height="2.5" transform="matrix(1,0,0,1,0,0)" class="darker" /><rect x="2.25" y="7" width="2" height="2.5" transform="matrix(1,0,0,1,0,0)" class="lighter" /><rect x="15.75" y="7" width="2" height="2.5" transform="matrix(1,0,0,1,0,0)" class="lighter" /><path d=" M 5.125 11 L 6.125 11 L 6.125 12 L 13.75 12 L 13.75 11 L 14.75 11 L 14.75 13 L 5.125 13 L 5.125 11 Z " class="darker" /></g></svg>
                        </button>
                    </div>
                </div>
                <svg class="editor-search-bar-close-btn" @click="closeSearchPanel" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 20 20" width="20" height="20"><path d=" M 10 8.586 L 6.464 5.05 C 6.074 4.66 5.441 4.66 5.05 5.05 L 5.05 5.05 C 4.66 5.441 4.66 6.074 5.05 6.464 L 8.586 10 L 5.05 13.536 C 4.66 13.926 4.66 14.559 5.05 14.95 L 5.05 14.95 C 5.441 15.34 6.074 15.34 6.464 14.95 L 10 11.414 L 13.536 14.95 C 13.926 15.34 14.559 15.34 14.95 14.95 L 14.95 14.95 C 15.34 14.559 15.34 13.926 14.95 13.536 L 11.414 10 L 14.95 6.464 C 15.34 6.074 15.34 5.441 14.95 5.05 L 14.95 5.05 C 14.559 4.66 13.926 4.66 13.536 5.05 L 10 8.586 Z " fill-rule="evenodd" /></g></svg>
            </div>
            <div class="editor-search-bar-container">
                <input class="editor-search-bar-input" v-model="searchText" @input="search"/>
                <!--<button class="editor-search-bar-btn">Find</button>-->
            </div>
        </div>
        <div class="item-0">
        </div>
        <div v-show="showInfo" class="slowIn" @mouseover.prevent="showInfo = !showInfo">{{ noteCount }} Notes by {{ user }}</div>
        <div v-show="showInfo == false" class="slowIn"><b>Created</b>: {{created}} &nbsp;&nbsp;&nbsp; <b>Updated</b>: {{updated}}</div>
        <button class="item-1" @click="toggleLiveMode" :class="{live: isLive == true}">
            <svg class="md-icn" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="8.2 7 19.607 5.86" width="28.607" height="14.86">
                <g><path d="M 8.768 9.344 L 10.723 9.344 C 11.036 9.344 11.291 9.599 11.291 9.912 L 11.291 9.938 C 11.291 10.251 11.036 10.506 10.723 10.506 L 8.768 10.506 C 8.455 10.506 8.2 10.251 8.2 9.938 L 8.2 9.912 C 8.2 9.599 8.455 9.344 8.768 9.344 Z" style="stroke:none;stroke-miterlimit:10;"/><path d="M 11.402 7 L 12.019 7 C 12.366 7 12.648 7.26 12.648 7.581 L 12.648 7.581 C 12.648 7.902 12.366 8.162 12.019 8.162 L 11.402 8.162 C 11.055 8.162 10.773 7.902 10.773 7.581 L 10.773 7.581 C 10.773 7.26 11.055 7 11.402 7 Z" style="stroke:none;stroke-miterlimit:10;"/><path d="M 11.604 11.688 L 12.604 11.688 C 12.999 11.688 13.319 11.948 13.319 12.269 L 13.319 12.269 C 13.319 12.59 12.999 12.85 12.604 12.85 L 11.604 12.85 C 11.209 12.85 10.889 12.59 10.889 12.269 L 10.889 12.269 C 10.889 11.948 11.209 11.688 11.604 11.688 Z" style="stroke:none;stroke-miterlimit:10;"/><g><path d=" M 14.329 7.005 L 17.326 7.005 L 17.326 8.167 L 14.329 8.167 C 13.786 8.167 13.346 7.906 13.346 7.586 L 13.346 7.586 C 13.346 7.265 13.786 7.005 14.329 7.005 L 14.329 7.005 Z  M 12.692 9.329 L 16.989 9.329 L 16.989 10.491 L 12.692 10.491 C 12.31 10.491 12 10.231 12 9.91 L 12 9.91 C 12 9.589 12.31 9.329 12.692 9.329 L 12.692 9.329 Z  M 14.76 11.66 L 17 11.66 L 17.241 12.385 C 17.328 12.647 17.174 12.86 16.898 12.86 L 14.76 12.86 C 14.341 12.86 14 12.591 14 12.26 L 14 12.26 C 14 11.929 14.341 11.66 14.76 11.66 Z " fill-rule="evenodd" /><path d=" M 16.261 9.361 L 16.26 9.361 L 16.376 8.715 L 16.681 7 L 18.41 7.001 L 17.484 12.357 C 17.437 12.629 17.175 12.847 16.899 12.843 L 16.705 12.84 C 16.12 12.832 15.729 12.358 15.831 11.782 L 15.853 11.661 L 15.853 11.661 L 15.852 11.661 L 16.049 10.559 L 16.261 9.361 Z  M 16.261 9.361 L 16.439 9.361 L 16.439 9.361 C 16.998 9.361 17.452 9.093 17.452 8.764 L 17.452 8.764 C 17.452 8.434 17.014 8.167 16.475 8.167 L 16.475 8.167 L 16.376 8.715 L 16.261 9.361 L 16.261 9.361 L 16.261 9.361 Z  M 15.853 11.661 L 15.885 11.661 L 15.885 11.661 C 16.444 11.661 16.899 11.393 16.899 11.064 L 16.899 11.064 C 16.899 10.734 16.525 10.467 16.065 10.467 L 16.065 10.467 L 16.049 10.559 L 15.853 11.661 L 15.853 11.661 L 15.853 11.661 Z " fill-rule="evenodd"/></g><g><g><path d=" M 19.632 10.451 L 17.49 7.717 L 18.184 7.08 C 18.306 6.968 18.486 6.984 18.585 7.116 L 20.556 9.728 C 20.765 10.004 20.729 10.389 20.477 10.586 L 20.477 10.586 C 20.224 10.784 19.846 10.724 19.632 10.451 Z " /><path d=" M 20.65 10.451 L 23.351 7 L 22.178 7 C 22.012 7 21.795 7.106 21.693 7.236 L 19.735 9.734 C 19.522 10.007 19.553 10.389 19.806 10.586 L 19.806 10.586 C 20.058 10.784 20.436 10.723 20.65 10.451 Z "/></g><path d=" M 27.626 8.774 C 27.505 8.433 27.318 8.128 27.065 7.861 C 26.812 7.594 26.488 7.385 26.093 7.233 C 25.699 7.081 25.238 7.005 24.711 7.005 L 22.484 7.005 L 21.689 12.355 C 21.648 12.628 21.839 12.85 22.115 12.85 L 24.406 12.85 C 25.151 12.85 25.776 12.736 26.281 12.508 C 26.786 12.281 27.167 11.946 27.423 11.505 C 27.679 11.063 27.807 10.518 27.807 9.869 C 27.807 9.481 27.747 9.116 27.626 8.774 Z  M 26.131 10.577 C 26.063 10.796 25.951 10.999 25.792 11.186 C 25.633 11.373 25.415 11.523 25.137 11.636 C 24.859 11.748 24.526 11.804 24.139 11.804 L 23.327 11.804 L 23.89 8.047 L 24.139 8.047 C 24.686 8.047 25.114 8.143 25.423 8.336 C 25.732 8.528 25.943 8.762 26.058 9.038 C 26.173 9.313 26.231 9.597 26.231 9.89 C 26.231 10.129 26.197 10.358 26.131 10.577 Z "/></g></g>
            </svg>
        </button>
    </footer>
</template>

<script>
    import os from 'os'
    import automoji from './AutoMoji.vue'

    // Change this to be assigned in the 'Vue' instance 
    // To allow user to control emoji kind
    const {ghEmojiNames} = require('./../lib/downmoji')

    const userInfo = os.userInfo();

    export default {
        components: {
            automoji
        },
        data () {
            return {
                user: userInfo.username,
                status: 'No results found for',
                searchText: '',
                searchBackup: '',
                showInfo: false,
                emojiNames: ghEmojiNames
            }
        },
        methods: {
            toggleLiveMode() {
                this.$store.dispatch("toggleLiveMode")
            },
            setSearchType(type) {
                this.$store.dispatch("setSearchType", type)
            },
            editNote(text) {
                this.$store.dispatch("editNote", text)
            },
            closeSearchPanel() {
                this.$store.dispatch("toggleSpanel")
            },
            search(e) {
                let regex = null
                // Reset "activeNote's text"; remove all highlights
                this.editNote(this.activeNote.text.replace(/<span class="hlt">[^\n]*<\/span>/g, (m, o, s) => {return m.slice(18, m.length-7)}))

                // Perform Text Replacement only if the current searcht text is not empty
                if (this.searchText.length > 0) {
                    // Otherwise we add highlights to the text depending on the 'searchType'
                    if (this.searchType === "Fuzzy") {
                        console.log("[Fuzzy]")
                        regex = new RegExp(this.searchText, 'gi')
                        //this.editNote(this.activeNote.text.replace(new RegExp(this.searchText, 'gi'), (m, o, s) => {return `<span class="hlt">${m}</span>`}))
                    }

                    if (this.searchType === "Regex") {
                        console.log("in regex?")
                        try {
                            regex = new RegExp(this.searchText, 'g')
                            //this.console.log(this.activeNote.text.replace(new RegExp(this.searchText, 'g'), (m, o, s) => {return `<span class="hlt">${m}</span>`}))
                        } catch {
                            console.log("Regex Exp not valid")
                        }
                    }

                    if (this.searchType === "Case Sensative") {
                        regex = new RegExp(this.searchText, 'g')
                        //this.editNote(this.activeNote.text.replace(new RegExp(this.searchText, 'g'), (m, o, s) => {return `<span class="hlt">${m}</span>`}))
                    }

                    if (this.searchType === "In Selection") {
                        console.log("[Implementation Error]")
                    }

                    if (this.searchType === "Whole Word") {
                        console.log("[Implementation Error]")
                    }
                }

                let newText = []
                let splitted = this.activeNote.text.split('\n')

                // Find fix: run beyond code snippet if found; if ``` is seen leave it unchanged until a closing ``` us matched.
                // The same holds for $$

                // Or ultimately we implement the hidden 'div' highlight trick
                // Wort case we just copy how github does its own highlighting

                // So we really need to consider swapping to content editable div or add a hidden div atop the textarea

                /*while (i < splitted.length) {
                    if (!(splitted[i].includes('$$') || splitted[i].includes('```'))) {
                        newText.push(splitted[i].replace(regex, (m, o, s) => {return `<span class="hlt">${m}</span>`}))
                    } else {
                        console.log("found code snippet or TeX", i, splitted[i])
                        newText.push(splitted[i])
                        i += 1
                        console.log("> ", i, splitted.length, splitted[i])
                        while (!(splitted[i].includes("$$") || splitted[i].includes("```"))) {
                            newText.push(splitted[i])
                            console.log("pushed: ", splitted[i], i, splitted.length)
                            i += 1

                            if (i < splitted.length -1) {
                                break
                            }
                        }
                    }
                    i += 1
                }*/

                newText = newText.join('\n')
                console.log("Result] ", newText)
            }
        },
        computed: {
            activeNote() {
                return this.$store.getters.activeNote
            },
            updated() {
                return this.activeNote.timestamp.slice(0, 15)
            },
            created() {
                return this.activeNote.epoch.slice(0, 15)
                //return this.activeNote.timestamp.slice(16, 24).concat(", ").concat(this.activeNote.timestamp.slice(0, 15))
            },
            noteCount () {
                if (this.show == 'all') {
                    return this.$store.state.allNotesCount
                }
                else if (this.show == 'fav') {
                    return this.$store.state.favNotesCount
                }
            },
            isLive () {
                return this.$store.getters.live
            },
            show () {
                return this.$store.getters.onPane
            },
            showPanel() {
                return this.$store.getters.showSpanel
            },
            currentText() {
                return this.$store.getters.activeNote.text
            },
            searchType() {
                return this.$store.getters.searchType
            }
        }
    }
</script>

<style scoped>

    .slowIn {
        color: ;
        transition: opacity 0.4s ease-in;
    }

    button:focus {
        outline: none;
    }

    .right-bound {
        display: inline-flex;
        margin-left: auto;
        margin-top: auto;
        margin-bottom: auto;
        margin-right: 16px;
        height: 25px;
    }

    .editor-search-bar-status-panel-info {
        font-size: 11px;
        margin-top: 3px;
        margin-left: 8px;
        margin-bottom: 0;
    }

    .editor-search-bar-status-panel-info-right {
        font-size: 11px;
        margin-top: -6px;
        margin-right: 16px;
    }

    .editor-search-bar-small-btn {
        cursor: pointer;
    }

    .editor-search-bar-small-btn:nth-child(3) {
        border-left: none;
    }

    .editor-search-bar-small-btn:first-child {
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        border-right: none;
    }

    .editor-search-bar-small-btn:last-child {
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        border-left: none;
    }

    .editor-search-bar-input {
        width: 96%;
        height: 10px;
        padding: 6px;
        margin-left: 8px;
        margin-bottom: 8px;
        outline: none;
        border-radius: 2.5px;
        border-width: 1px;
        border-style: solid;
    }

    .editor-search-bar-status-panel-buttons {
        display: inline-flex;
        margin: 0;
        padding: 0;
    }

    .editor-search-bar-btn {
        width: 80px;
        height: 25px;
        margin-right: 8px;
        margin-bottom: 8px;
        outline: none;
        border-radius: 2.5px;
        border-style: solid;
        border-width: 1px;
        cursor: pointer;
    }

    .editor-search-bar-btn:active {
        opacity: 0.85;
    }

    .editor-search-bar-close-btn {
        height: 20px;
        width: 20px;
        margin-right: 8px;
        margin-top: 10px;
        cursor: pointer;
    }

    .editor-search-bar-close-btn:hover {
        opacity: 0.85;
    }

    .editor-search-bar-container:first-child {
        margin-bottom: 8px;
        height: 40px;
    }

    .editor-search-bar-container {
        display: flex;
        flex-flow: row;
        justify-content: space-between;
    }

    .editor-search-bar {
        transition: opacity 1s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        width: 100%;
        display: flex;
        flex-flow: column;
        position: absolute;
        bottom: 36px;
    }

    #bottom {
        display: flex;
        font-family: Lato;
        font-size: 14px;
        line-height: 2.200rem;
        height: 2.4rem;
        cursor: default;
        position: sticky;
        -webkit-user-select: none;
    }

    .md-icn {
        margin-top: 2px;
    	margin-right: 2px;
    }

    .item-0 {
    }

    .item-1 {
        font-size: 12px;
        margin-top: 6.5px;
        margin-right: 10px;
        height: 25px;
        border-radius: 2px;
        border-style: none;
        width: 58px;
        outline: none;
        transition: background 0.3s linear;
    }

    .item-1:hover {
        cursor: pointer;
    }
</style>
